interface StopVbProps {
    className: string;
  }
  export function StopVb({ className }: StopVbProps) {
    return (
        <svg
        viewBox="0 0 24 24"
        focusable="false"
        className={className}
        data-testid="PauseFilledIcon"
      >
        <path
          fillRule="evenodd"
          d="M5.001 11.58c.02-2.585.249-4.847.55-6.753A.97.97 0 0 1 6.503 4H11v16H6.521a.968.968 0 0 1-.95-.823A45.403 45.403 0 0 1 5 11.579ZM17.48 4c.468 0 .873.344.95.823a45.4 45.4 0 0 1 .57 7.598 45.347 45.347 0 0 1-.55 6.752.97.97 0 0 1-.951.827H13V4h4.479Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  