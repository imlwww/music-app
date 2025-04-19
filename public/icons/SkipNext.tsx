interface SkipNextVbProps {
    className: string;
  }
  export function SkipNextVb({ className }: SkipNextVbProps) {
    return (
        <svg
        viewBox="0 0 24 24"
        focusable="false"
        className={className}
        data-testid="SkipNextFilledIcon"
        aria-hidden="true"
      >
        <path d="M18.667 4v7.153c-.886-.64-2.045-1.457-2.595-1.767-.916-.516-2.466-1.407-3.434-1.915-.968-.507-1.929-.992-2.88-1.454a97.797 97.797 0 0 0-4.25-1.945c-.524-.224-1.136.097-1.184.62a77.49 77.49 0 0 0-.271 4.317 84.791 84.791 0 0 0 0 5.982c.053 1.492.144 2.935.27 4.316.049.524.66.845 1.184.62a97.801 97.801 0 0 0 4.252-1.944c.95-.462 1.911-.947 2.88-1.454.967-.508 2.554-1.423 3.47-1.94.547-.308 1.684-1.11 2.558-1.74V20H20V4h-1.333Z" />
      </svg>
    );
  }
  