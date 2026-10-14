import React from "react";

/** Admin panel bilan bir xil brend belgisi */
export default function BrandMark(props: { size?: number }) {
  const size = props.size ?? 38;
  return (
    <span className="brand-mark" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8h13a3 3 0 0 1 0 6h-1" />
        <path d="M4 8v6a6 6 0 0 0 6 6h0a6 6 0 0 0 6-6V8" />
        <path d="M7 2v3M10 2v3M13 2v3" />
      </svg>
    </span>
  );
}
