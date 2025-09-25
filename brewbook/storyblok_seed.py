#!/usr/bin/env python3
import os
import sys
import time
import requests
from typing import Dict, Any, Optional

SPACE_ID = os.getenv("SB_SPACE_ID")
PAT = os.getenv("SB_PAT")

if not SPACE_ID or not PAT:
    sys.exit("Missing SB_SPACE_ID or SB_PAT env vars.")

BASE = f"https://mapi.storyblok.com/v1/spaces/{SPACE_ID}"
HDRS = {"Authorization": PAT, "Content-Type": "application/json"}

def api(method: str, path: str, **kwargs) -> requests.Response:
    url = f"{BASE}{path}"
    resp = requests.request(method, url, headers=HDRS, **kwargs)
    if resp.status_code >= 400:
        raise RuntimeError(f"{method} {path} failed [{resp.status_code}] {resp.text}")
    return resp

# ---------- Components ----------
def list_components() -> Dict[str, Any]:
    return api("GET", "/components").json()

def ensure_component(name: str, schema: Dict[str, Any], is_nestable: bool=False):
    existing = list_components()
    for c in existing.get("components", []):
        if c["name"] == name:
            # update schema if changed (idempotent-ish)
            cid = c["id"]
            api("PUT", f"/components/{cid}", json={
                "component": {
                    "name": name,
                    "schema": schema,
                    "is_nestable": is_nestable
                }
            })
            return c["id"]
    # create
    created = api("POST", "/components", json={
        "component": {
            "name": name,
            "schema": schema,
            "is_nestable": is_nestable
        }
    }).json()
    return created["component"]["id"]

# ---------- Folders ----------
def list_folders() -> Dict[str, Any]:
    try:
        return api("GET", "/folders").json()
    except RuntimeError as e:
        if "404" in str(e):
            return {"folders": []}
        raise

def ensure_folder(name: str, slug: str) -> int:
    folders = list_folders().get("folders", [])
    for f in folders:
        if f["name"] == name or f["slug"] == slug:
            return f["id"]
    created = api("POST", "/folders", json={"folder": {"name": name, "slug": slug}}).json()
    return created["folder"]["id"]

# ---------- Stories ----------
def get_story_by_slug(full_slug: str) -> Optional[Dict[str, Any]]:
    try:
        r = api("GET", "/stories", params={"with_slug": full_slug}).json()
        return r.get("story")
    except RuntimeError as e:
        if "404" in str(e):
            return None
        raise

def find_story_by_slug(slug: str) -> Optional[Dict[str, Any]]:
    """Find existing story by slug using the list endpoint"""
    try:
        stories_response = api("GET", "/stories").json()
        for story in stories_response.get("stories", []):
            if story.get("slug") == slug:
                return story
        return None
    except RuntimeError:
        return None

def upsert_story(name: str, slug: str, content: Dict[str, Any], content_type: str = "page", parent_id: Optional[int]=None, publish=True):
    # Look for existing story by slug
    existing = find_story_by_slug(slug)

    payload = {
        "story": {
            "name": name,
            "slug": slug,
            "content": content,
            "content_type": content_type,
            "is_startpage": False
        }
    }
    if parent_id:
        payload["story"]["parent_id"] = parent_id
    if publish:
        payload["publish"] = 1

    if existing:
        sid = existing["id"]
        print(f"Updating existing story: {name} (ID: {sid})")
        api("PUT", f"/stories/{sid}", json=payload)
        return sid
    else:
        print(f"Creating new story: {name}")
        created = api("POST", "/stories", json=payload).json()
        return created["story"]["id"]

# ---------- Seed Data ----------
def main():
    # 1) Components
    metadata_schema = {
        "tags": {"type": "text", "display_name": "Tags (comma-separated)"},
        "opening_hours": {"type": "text"},
        "rating": {"type": "number"}
    }
    cafe_schema = {
        "name": {"type": "text"},
        "description": {"type": "richtext"},
        "image": {"type": "asset"},
        "location": {"type": "text"},
        "metadata": {"type": "bloks", "restrict_components": True, "component_whitelist": ["metadata"]}
    }
    event_schema = {
        "title": {"type": "text"},
        "description": {"type": "richtext"},
        "date": {"type": "datetime"},
        "image": {"type": "asset"},
        "location": {"type": "text"},
        "metadata": {"type": "bloks", "restrict_components": True, "component_whitelist": ["metadata"]}
    }

    print("Ensuring components…")
    ensure_component("metadata", metadata_schema, is_nestable=True)
    ensure_component("cafe", cafe_schema)
    ensure_component("event", event_schema)

    # 2) Skip folders for now - create stories directly
    print("Skipping folders (not available in starter plan)…")
    cafes_folder_id = None
    events_folder_id = None

    # 3) Demo cafés
    print("Creating cafés…")
    cafe_names = [
        "Demo Coffee", "Cafe Aroma", "Bean & Byte", "Roast & Route", "Morning Grind",
        "Espresso Lane", "Pour Over Place", "Latte Lab", "Mocha Market", "Drip District"
    ]
    cities = ["Amsterdam, NL", "Berlin, DE", "Paris, FR", "Lisbon, PT", "Madrid, ES",
              "London, UK", "Copenhagen, DK", "Vienna, AT", "Prague, CZ", "Budapest, HU"]
    images = [
        # Unsplash public images – OK for demo content
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
        "https://images.unsplash.com/photo-1517705008128-361805f42e86",
        "https://images.unsplash.com/photo-1511920170033-f8396924c348",
        "https://images.unsplash.com/photo-1453614512568-c4024d13c247",
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e",
        "https://images.unsplash.com/photo-1445077100181-a33e9ac94db0",
        "https://images.unsplash.com/photo-1521017432531-fbd92d768814"
    ]

    for i in range(10):
        name = cafe_names[i]
        slug = name.lower().replace("&", "and").replace(" ", "-")
        location = cities[i]
        img = images[i]
        content = {
            "component": "page",
            "_uid": f"page-{i}",
            "body": [{
                "component": "cafe",
                "_uid": f"cafe-{i}",
                "name": name,
                "description": {"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": f"{name} — great coffee and snacks."}]}]},
                "location": location,
                "image": {"filename": img},
                "metadata": [{
                    "component": "metadata",
                    "_uid": f"meta-{i}",
                    "tags": "test,coffee,demo",
                    "opening_hours": "Mon–Sun 08:00–18:00",
                    "rating": 4.5
                }]
            }]
        }
        upsert_story(name, slug, content, content_type="page", parent_id=cafes_folder_id, publish=True)

    # 4) Demo events
    print("Creating events…")
    events = [
        {
            "title": "Latte Art Workshop",
            "slug": "latte-art-workshop",
            "date": "2025-10-01T18:00:00+00:00",
            "location": "Amsterdam, NL",
            "img": "https://images.unsplash.com/photo-1522992319-0365e5f11656"
        },
        {
            "title": "Coffee Cupping Night",
            "slug": "coffee-cupping-night",
            "date": "2025-10-08T18:00:00+00:00",
            "location": "Berlin, DE",
            "img": "https://images.unsplash.com/photo-1512568400610-62da28bc8a13"
        },
        {
            "title": "Roaster Talk",
            "slug": "roaster-talk",
            "date": "2025-10-15T18:00:00+00:00",
            "location": "Paris, FR",
            "img": "https://images.unsplash.com/photo-1494415859740-21e878dd929d"
        }
    ]

    for idx, e in enumerate(events):
        content = {
            "component": "page",
            "_uid": f"event-page-{idx}",
            "body": [{
                "component": "event",
                "_uid": f"event-{idx}",
                "title": e["title"],
                "description": {"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Join us!"}]}]},
                "date": e["date"],
                "location": e["location"],
                "image": {"filename": e["img"]},
                "metadata": [{
                    "component": "metadata",
                    "_uid": f"event-meta-{idx}",
                    "tags": "event,coffee,demo",
                    "opening_hours": "",
                    "rating": 5
                }]
            }]
        }
        upsert_story(e["title"], e["slug"], content, content_type="page", parent_id=events_folder_id, publish=True)

    print("Seed complete: components, folders, 10 cafes, 3 events.")

if __name__ == "__main__":
    main()