import { render } from "storyblok-rich-text-react-renderer";

export default function RichText({ content }: { content: any }) {
    if (!content) return null;
    return <div className="prose max-w-none">{render(content)}</div>;
}
