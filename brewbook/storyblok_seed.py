#!/usr/bin/env python3
import os
import sys
import time
import requests
from typing import Dict, Any, Optional

# Load environment variables from .env file
def load_env_file():
    try:
        with open('.env', 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value
    except FileNotFoundError:
        print("Warning: .env file not found, using system environment variables")

load_env_file()

SPACE_ID = os.getenv("SB_SPACE_ID")
PAT = os.getenv("SB_PAT")

if not SPACE_ID or not PAT:
    print("Available environment variables:")
    for key in sorted(os.environ.keys()):
        if 'SB_' in key or 'STORYBLOK' in key:
            print(f"  {key}={os.environ[key][:20]}...")
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
        "opening_hours": {"type": "richtext", "display_name": "Opening Hours (structured)"},
        "rating": {"type": "number"},
        "specialties": {"type": "text", "display_name": "Coffee specialties"},
        "ai_summary": {"type": "text", "display_name": "AI Generated Summary"},
        "ai_tags": {"type": "text", "display_name": "AI Generated Tags"},
        "detected_language": {"type": "text", "display_name": "Detected Language"},
        "open_now": {"type": "boolean", "display_name": "Currently Open"}
    }
    cafe_schema = {
        # Basic Info
        "title": {"type": "text", "display_name": "Café Title"},
        "description": {"type": "richtext", "display_name": "Long Description"},
        "short_summary": {"type": "text", "display_name": "Short Summary (1-2 sentences)"},

        # Location & Hours
        "address": {"type": "text", "display_name": "Street Address"},
        "city": {"type": "text", "display_name": "City"},
        "geo_location": {"type": "text", "display_name": "Latitude,Longitude"},
        "opening_hours": {"type": "richtext", "display_name": "Opening Hours (structured)"},

        # Amenities & Features
        "wifi": {"type": "boolean", "display_name": "WiFi Available"},
        "power_outlets": {"type": "boolean", "display_name": "Power Outlets Available"},
        "noise_level": {"type": "option", "display_name": "Noise Level", "options": [
            {"name": "Quiet", "value": "quiet"},
            {"name": "Moderate", "value": "moderate"},
            {"name": "Loud", "value": "loud"}
        ]},
        "seating_capacity": {"type": "option", "display_name": "Seating Capacity", "options": [
            {"name": "Small (1-20)", "value": "small"},
            {"name": "Medium (21-50)", "value": "medium"},
            {"name": "Large (50+)", "value": "large"}
        ]},
        "outdoor_seating": {"type": "boolean", "display_name": "Outdoor Seating"},
        "pet_friendly": {"type": "boolean", "display_name": "Pet Friendly"},

        # Media
        "hero_image": {"type": "asset", "display_name": "Hero Image"},
        "gallery": {"type": "asset", "display_name": "Gallery Images", "multiple": True},

        # Tags & Categories
        "tags": {"type": "text", "display_name": "Tags (comma-separated)"},
        "price_range": {"type": "option", "display_name": "Price Range", "options": [
            {"name": "$", "value": "budget"},
            {"name": "$$", "value": "moderate"},
            {"name": "$$$", "value": "expensive"}
        ]},
        "specialties": {"type": "text", "display_name": "Coffee Specialties"},

        # Legacy fields for compatibility
        "name": {"type": "text", "display_name": "Legacy Name Field"},
        "image": {"type": "asset", "display_name": "Legacy Image Field"},
        "location": {"type": "text", "display_name": "Legacy Location Field"},
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
    cafes_data = [
        {
            "title": "Demo Coffee Central",
            "address": "123 Coffee Street",
            "city": "Amsterdam",
            "geo_location": "52.3676,4.9041",
            "tags": "study spot,wifi,hipster,power outlets",
            "noise_level": "moderate",
            "seating_capacity": "medium",
            "specialties": "Single Origin Coffee, Cold Brew, Flat White",
            "price_range": "moderate",
            "wifi": True,
            "power_outlets": True,
            "outdoor_seating": False,
            "pet_friendly": True,
            "opening_hours": "Monday-Friday: 7:00-19:00, Saturday-Sunday: 8:00-20:00",
            "short_description": "A trendy study-friendly café in Amsterdam's city center, perfect for digital nomads and coffee enthusiasts.",
            "rating": 4.5,
            "img": "https://images.unsplash.com/photo-1509042239860-f550ce710b93"
        },
        {
            "title": "Café Aroma Artisan",
            "address": "456 Bean Boulevard",
            "city": "Berlin",
            "geo_location": "52.5200,13.4050",
            "tags": "hipster,late night,artisan,specialty coffee",
            "noise_level": "quiet",
            "seating_capacity": "small",
            "specialties": "Pour Over, Single Origin Espresso, Chemex",
            "price_range": "expensive",
            "wifi": True,
            "power_outlets": False,
            "outdoor_seating": True,
            "pet_friendly": False,
            "opening_hours": "Monday-Sunday: 8:00-22:00",
            "short_description": "An intimate artisan coffee house in Berlin, known for exceptional pour-over coffee and late-night hours.",
            "rating": 4.8,
            "img": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
        },
        {
            "title": "Bean & Byte Tech Café",
            "address": "789 Digital Drive",
            "city": "Paris",
            "geo_location": "48.8566,2.3522",
            "tags": "study spot,tech,power outlets,coworking",
            "noise_level": "moderate",
            "seating_capacity": "large",
            "specialties": "Nitro Coffee, Matcha Lattes, Iced Americano",
            "price_range": "moderate",
            "wifi": True,
            "power_outlets": True,
            "outdoor_seating": False,
            "pet_friendly": False,
            "opening_hours": "Monday-Friday: 6:30-20:00, Saturday-Sunday: 8:00-18:00",
            "short_description": "A modern tech-focused café in Paris with excellent WiFi, perfect for remote work and studying.",
            "rating": 4.3,
            "img": "https://images.unsplash.com/photo-1517705008128-361805f42e86"
        },
        {
            "title": "Roast & Route Travel Café",
            "address": "321 Explorer Lane",
            "city": "Lisbon",
            "geo_location": "38.7223,-9.1393",
            "tags": "outdoor seating,pet friendly,casual,travel theme",
            "noise_level": "loud",
            "seating_capacity": "medium",
            "specialties": "Dark Roast, Portuguese Pastéis, Galão",
            "price_range": "budget",
            "wifi": True,
            "power_outlets": True,
            "outdoor_seating": True,
            "pet_friendly": True,
            "opening_hours": "Monday-Sunday: 7:30-19:30",
            "short_description": "A vibrant travel-themed café in Lisbon with pet-friendly outdoor seating and local pastries.",
            "rating": 4.2,
            "img": "https://images.unsplash.com/photo-1511920170033-f8396924c348"
        },
        {
            "title": "Morning Grind Early Bird",
            "address": "654 Sunrise Street",
            "city": "Madrid",
            "geo_location": "40.4168,-3.7038",
            "tags": "early morning,quick service,breakfast,takeaway",
            "noise_level": "moderate",
            "seating_capacity": "small",
            "specialties": "Cortado, Spanish Tortilla, Café con Leche",
            "price_range": "budget",
            "wifi": False,
            "power_outlets": False,
            "outdoor_seating": False,
            "pet_friendly": False,
            "opening_hours": "Monday-Friday: 6:00-14:00, Saturday-Sunday: 7:00-15:00",
            "short_description": "An early-rising local favorite in Madrid, perfect for quick breakfast and authentic Spanish coffee.",
            "rating": 4.1,
            "img": "https://images.unsplash.com/photo-1453614512568-c4024d13c247"
        },
        {
            "title": "Espresso Lane Speed Café",
            "address": "987 Rush Road",
            "city": "London",
            "geo_location": "51.5074,-0.1278",
            "tags": "quick service,takeaway,business,commuter",
            "noise_level": "loud",
            "seating_capacity": "small",
            "specialties": "Espresso, Americano, Flat White, Grab & Go",
            "price_range": "moderate",
            "wifi": True,
            "power_outlets": True,
            "outdoor_seating": False,
            "pet_friendly": False,
            "opening_hours": "Monday-Friday: 6:00-18:00, Saturday: 8:00-16:00, Sunday: Closed",
            "short_description": "A fast-paced London café designed for busy commuters and business professionals.",
            "rating": 3.9,
            "img": "https://images.unsplash.com/photo-1470337458703-46ad1756a187"
        },
        {
            "title": "Pour Over Place Artisan",
            "address": "147 Craft Circle",
            "city": "Copenhagen",
            "geo_location": "55.6761,12.5683",
            "tags": "artisan,slow coffee,quality,third wave",
            "noise_level": "quiet",
            "seating_capacity": "small",
            "specialties": "V60 Pour Over, Aeropress, Scandinavian Roasts",
            "price_range": "expensive",
            "wifi": False,
            "power_outlets": False,
            "outdoor_seating": True,
            "pet_friendly": True,
            "opening_hours": "Tuesday-Sunday: 9:00-17:00, Monday: Closed",
            "short_description": "A minimalist Copenhagen coffee shop dedicated to the art of slow, precise coffee brewing.",
            "rating": 4.9,
            "img": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb"
        },
        {
            "title": "Latte Lab Experimental",
            "address": "258 Innovation Avenue",
            "city": "Vienna",
            "geo_location": "48.2082,16.3738",
            "tags": "experimental,latte art,unique,instagram worthy",
            "noise_level": "moderate",
            "seating_capacity": "medium",
            "specialties": "Signature Latte Art, Experimental Drinks, Viennese Coffee",
            "price_range": "expensive",
            "wifi": True,
            "power_outlets": True,
            "outdoor_seating": True,
            "pet_friendly": False,
            "opening_hours": "Monday-Sunday: 8:00-20:00",
            "short_description": "An innovative Vienna café where coffee meets art, featuring experimental drinks and stunning latte art.",
            "rating": 4.6,
            "img": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e"
        },
        {
            "title": "Mocha Market Variety",
            "address": "369 Flavor Street",
            "city": "Prague",
            "geo_location": "50.0755,14.4378",
            "tags": "variety,desserts,sweet treats,family friendly",
            "noise_level": "moderate",
            "seating_capacity": "large",
            "specialties": "Signature Mochas, Hot Chocolate, Czech Pastries",
            "price_range": "moderate",
            "wifi": True,
            "power_outlets": True,
            "outdoor_seating": True,
            "pet_friendly": True,
            "opening_hours": "Monday-Sunday: 8:00-21:00",
            "short_description": "A family-friendly Prague café specializing in decadent mochas and traditional Czech desserts.",
            "rating": 4.4,
            "img": "https://images.unsplash.com/photo-1445077100181-a33e9ac94db0"
        },
        {
            "title": "Drip District Community",
            "address": "741 Community Corner",
            "city": "Budapest",
            "geo_location": "47.4979,19.0402",
            "tags": "community,events,social,local hangout",
            "noise_level": "moderate",
            "seating_capacity": "large",
            "specialties": "Drip Coffee, Community Blends, Hungarian Pastries",
            "price_range": "budget",
            "wifi": True,
            "power_outlets": True,
            "outdoor_seating": True,
            "pet_friendly": True,
            "opening_hours": "Monday-Sunday: 7:00-22:00",
            "short_description": "A community-centered Budapest café that hosts local events and serves neighborhood-roasted coffee.",
            "rating": 4.7,
            "img": "https://images.unsplash.com/photo-1521017432531-fbd92d768814"
        }
    ]

    for i, cafe in enumerate(cafes_data):
        name = cafe["title"]
        slug = name.lower().replace("&", "and").replace(" ", "-").replace("é", "e").replace("ü", "u").replace("ä", "a").replace("ö", "o")

        # Generate opening hours as richtext
        opening_hours_content = {
            "type": "doc",
            "content": [{
                "type": "paragraph",
                "content": [{
                    "type": "text",
                    "text": cafe["opening_hours"]
                }]
            }]
        }

        # Generate comprehensive description as richtext
        description_text = f"{cafe['short_description']} Located at {cafe['address']} in {cafe['city']}, this café specializes in {cafe['specialties']}. The atmosphere is {cafe['noise_level']} with {cafe['seating_capacity']} seating capacity, making it ideal for various activities."

        # Add amenities to description
        amenities = []
        if cafe['wifi']: amenities.append("free WiFi")
        if cafe['power_outlets']: amenities.append("power outlets")
        if cafe['outdoor_seating']: amenities.append("outdoor seating")
        if cafe['pet_friendly']: amenities.append("pet-friendly environment")

        if amenities:
            description_text += f" Amenities include: {', '.join(amenities)}."

        description_content = {
            "type": "doc",
            "content": [{
                "type": "paragraph",
                "content": [{
                    "type": "text",
                    "text": description_text
                }]
            }]
        }

        # Gallery images (using variations of the hero image)
        gallery_images = [
            {"filename": cafe["img"]},
            {"filename": cafe["img"] + "?w=400"},
            {"filename": cafe["img"] + "?w=600"}
        ]

        content = {
            "component": "page",
            "_uid": f"page-{i}",
            "body": [{
                "component": "cafe",
                "_uid": f"cafe-{i}",

                # Basic Info
                "title": cafe["title"],
                "description": description_content,
                "short_summary": cafe["short_description"],

                # Location & Hours
                "address": cafe["address"],
                "city": cafe["city"],
                "geo_location": cafe["geo_location"],
                "opening_hours": opening_hours_content,

                # Amenities & Features
                "wifi": cafe["wifi"],
                "power_outlets": cafe["power_outlets"],
                "noise_level": cafe["noise_level"],
                "seating_capacity": cafe["seating_capacity"],
                "outdoor_seating": cafe["outdoor_seating"],
                "pet_friendly": cafe["pet_friendly"],

                # Media
                "hero_image": {"filename": cafe["img"]},
                "gallery": gallery_images,

                # Tags & Categories
                "tags": cafe["tags"],
                "price_range": cafe["price_range"],
                "specialties": cafe["specialties"],

                # Legacy fields for compatibility
                "name": cafe["title"],
                "image": {"filename": cafe["img"]},
                "location": f"{cafe['city']}, {cafe['address']}",
                "metadata": [{
                    "component": "metadata",
                    "_uid": f"meta-{i}",
                    "tags": cafe["tags"],
                    "opening_hours": opening_hours_content,
                    "rating": cafe["rating"],
                    "specialties": cafe["specialties"],
                    "ai_summary": f"A {cafe['price_range']}-range {cafe['noise_level']} café in {cafe['city']} perfect for {cafe['tags'].split(',')[0]} enthusiasts",
                    "ai_tags": f"{cafe['city']},{cafe['noise_level']},{cafe['price_range']},{'wifi' if cafe['wifi'] else 'no-wifi'},{'pet-friendly' if cafe['pet_friendly'] else 'no-pets'}",
                    "detected_language": "en",
                    "open_now": i % 2 == 0  # Alternate open/closed for demo
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