import { storyblokEditable } from "@storyblok/react";

interface FallbackProps {
  blok: {
    _uid: string;
    component: string;
    [key: string]: unknown;
  };
}

export default function Fallback({ blok }: FallbackProps) {
  return (
    <div
      {...storyblokEditable(blok as any)}
      className="fallback-component p-4 border-2 border-dashed border-yellow-400 bg-yellow-50 rounded-lg"
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Unknown Component: &ldquo;{blok.component}&rdquo;
        </h3>
        <p className="text-sm text-yellow-700 mb-4">
          This component type is not yet implemented. Please add it to the component registry.
        </p>
        <details className="text-left">
          <summary className="cursor-pointer text-yellow-800 font-medium">
            Component Data (Click to expand)
          </summary>
          <pre className="mt-2 p-3 bg-white rounded border text-xs overflow-auto">
            {JSON.stringify(blok, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}