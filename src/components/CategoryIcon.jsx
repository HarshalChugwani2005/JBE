const icons = {
  'ceiling-fans': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M18.4 5.6l-2.1 2.1M7.8 16.3l-2.1 2.1M12 8a4 4 0 100 8 4 4 0 000-8z"
    />
  ),
  'hot-plates': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 14h16M6 14V8a2 2 0 012-2h8a2 2 0 012 2v6M8 18h8"
    />
  ),
  mixers: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h8M8 14h5M12 6v12M9 6h6a2 2 0 012 2v8a2 2 0 01-2 2H9a2 2 0 01-2-2V8a2 2 0 012-2z"
    />
  ),
  torches: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 18h6M10 14l2-8 2 8M12 6V3"
    />
  ),
  geysers: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c-2 4-4 6-4 9a4 4 0 008 0c0-3-2-5-4-9zM8 21h8"
    />
  ),
  'immersion-rods': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 2v20M9 5h6M9 19h6M8 8h8M8 16h8"
    />
  ),
  'table-fans': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8a3 3 0 100 6 3 3 0 000-6zM12 3v2m0 14v2M5 12H3m18 0h-2"
    />
  ),
  'electric-irons': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 14l2-6h8l2 6H6zM8 14v4h8v-4"
    />
  ),
  'led-bulbs': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 18h6M12 3a5 5 0 015 5c0 2-1 3-2 4v2H9v-2c-1-1-2-2-2-4a5 5 0 015-5z"
    />
  ),
  'bluetooth-speakers': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 8v8l6-4-6-4zM16 9a2 2 0 010 6M18 7a4 4 0 010 10"
    />
  ),
  '12v-batteries': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 7h10v10H7V7zM9 10h6M9 13h4M5 10h1M18 10h1"
    />
  ),
  coolers: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 8h12v10H6V8zM9 8V5h6v3M9 12h6M12 12v4"
    />
  ),
}

export default function CategoryIcon({ slug, className = 'h-10 w-10' }) {
  const icon = icons[slug] ?? icons['ceiling-fans']

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {icon}
    </svg>
  )
}
