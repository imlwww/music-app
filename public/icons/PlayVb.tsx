interface PlayVbProps {
    className: string;
  }
  export function PlayVb({ className }: PlayVbProps) {
    return (
        <svg
        viewBox="0 0 24 24"
        focusable="false"
        className={className}
        data-testid="PlayFilledIcon"

      >
        <path d="M16.04 9.009a93.31 93.31 0 0 0-5.18-2.992 85.246 85.246 0 0 0-3.861-1.945.756.756 0 0 0-1.075.62 85.122 85.122 0 0 0-.246 4.317 92.993 92.993 0 0 0 0 5.982c.048 1.492.131 2.935.246 4.316.043.524.6.845 1.074.62a85.293 85.293 0 0 0 3.861-1.944 93.24 93.24 0 0 0 5.181-2.992 85.086 85.086 0 0 0 3.652-2.396.725.725 0 0 0 0-1.19A84.99 84.99 0 0 0 16.04 9.01Z" />
      </svg>
    );
  }
  