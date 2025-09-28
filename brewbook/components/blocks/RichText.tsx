import { render } from "storyblok-rich-text-react-renderer";

export default function RichText({ content }: { content: object }) {
    if (!content) return null;
    return <div className="prose max-w-none">{render(content)}</div>;
}
