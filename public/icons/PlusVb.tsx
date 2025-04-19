import React from "react";

interface PlusVbProps {
  className?: string;
}

export function PlusVb({ className }: PlusVbProps) {
    return (
        <svg
    viewBox="0 0 24 24"
    focusable="false"
    className={className}
    data-testid="PlusIcon"
  
  >
    <path d="M13 2h-2v9H2v2h9v9h2v-9h9v-2h-9V2Z" />
  </svg>
    )
}