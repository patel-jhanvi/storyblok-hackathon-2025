import { storyblokEditable, StoryblokComponent } from "@storyblok/react";

interface PageProps {
  blok: {
    _uid: string;
    component: string;
    body?: any[];
  };
}

export default function Page({ blok }: PageProps) {
  return (
    <div {...storyblokEditable(blok)} className="page">
      {blok.body?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}