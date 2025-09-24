import React from "react";

const FreeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-5 h-5 text-brown-600"
        {...props}
    >
        <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="white"
        />
        <text
            x="50%"
            y="55%"
            textAnchor="middle"
            fontSize="8"
            fontWeight="bold"
            fill="currentColor"
        >
            FREE
        </text>
    </svg>
);

export default FreeIcon;
