interface HouseVbProps {
    className: string;
  }
  export function HouseVb({ className }: HouseVbProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        focusable="false"
        className={className}
        data-testid="HouseOutlinedIcon"
      >
        <path d="M22.834 14.656c-.182-2.288-.495-3.923-.853-5.738 0 0-2.517-2.695-5.128-4.817C14.324 2.044 12.788 1 12.006 1h-.012c-.764 0-2.316 1.044-4.847 3.101-2.61 2.122-5.128 4.817-5.128 4.817-.358 1.816-.671 3.45-.853 5.738A52.258 52.258 0 0 0 1.167 23H9v-6.31a3 3 0 0 1 3-2.994 3 3 0 0 1 3 2.994V23h7.833c.185-2.29.257-5.113 0-8.344Z" />
      </svg>
    );
  }
  