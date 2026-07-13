export function SearchIcon({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </svg>
  );
}

export function StarIcon({ className = "", filled = false }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="m12 3.6 2.5 5.1 5.7.8-4.1 4 1 5.6L12 16.6l-5.1 2.5 1-5.6-4.1-4 5.7-.8L12 3.6Z" />
    </svg>
  );
}

export function SettingsIcon({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M10 5H4" />
      <path d="M20 5h-4" />
      <path d="M12 5a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
      <path d="M20 12h-8" />
      <path d="M6 12H4" />
      <path d="M16 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
      <path d="M10 19H4" />
      <path d="M20 19h-4" />
      <path d="M18 19a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
    </svg>
  );
}

export function SparkBookIcon({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17.5A2.5 2.5 0 0 0 17.5 17H5Z" />
      <path d="M5 4.5V19a3 3 0 0 0 3 3" />
      <path d="m15.3 6.5.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5.5-1.3Z" />
    </svg>
  );
}
