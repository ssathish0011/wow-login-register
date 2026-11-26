// Multicolor, filled SVG icons for the category grid.
// Each icon is drawn on a 64x64 canvas with a consistent style:
// base color + a darker shade + a light highlight, and a soft ground shadow.
// They are rendered with react-native-svg (SvgXml).
//
// To use an icon from SVG Repo (or anywhere else) instead:
//   1. Download the .svg file and open it in a text editor.
//   2. Paste its full contents into the matching entry below, as a template string.
// Check the license of each SVG Repo icon before using it in your app.

const wrap = (body: string, shadow = true) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${shadow ? '<ellipse cx="32" cy="59" rx="17" ry="2.5" fill="#000" opacity=".08"/>' : ""
  }${body}</svg>`;

export const CATEGORY_SVGS: Record<string, string> = {
  // Diamond with facets and a sparkle
  jewellery: wrap(`
    <path d="M20 14h24l12 14H8z" fill="#7DD3FC"/>
    <path d="M8 28l12-14 6 14z" fill="#38BDF8"/>
    <path d="M20 14h12l-6 14z" fill="#E0F2FE"/>
    <path d="M32 14h12l-6 14z" fill="#BAE6FD"/>
    <path d="M8 28h48L32 54z" fill="#0EA5E9"/>
    <path d="M8 28h18l6 26z" fill="#0284C7"/>
    <path d="M26 28h12l-6 26z" fill="#38BDF8"/>
    <path d="M38 28h18L32 54z" fill="#0369A1"/>
    <path d="M52 4l1.8 4.2L58 10l-4.2 1.8L52 16l-1.8-4.2L46 10l4.2-1.8z" fill="#FBBF24"/>
  `),

  // Dress
  fashion: wrap(`
    <path d="M24 5l4 13M40 5l-4 13" stroke="#BE185D" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M24 16h16l2 14H22z" fill="#EC4899"/>
    <path d="M22 30h20l12 26H10z" fill="#F472B6"/>
    <path d="M32 32v24M26 32l-6 24M38 32l6 24" stroke="#DB2777" stroke-width="1.5" opacity=".45" fill="none"/>
    <path d="M27 16c1 4 9 4 10 0z" fill="#FBCFE8"/>
    <rect x="21" y="28" width="22" height="4" rx="2" fill="#FBBF24"/>
  `),

  // Lotus on water
  beauty: wrap(`
    <path d="M6 30c10 0 18 6 20 16-10 0-18-6-20-16z" fill="#C084FC"/>
    <path d="M58 30c-10 0-18 6-20 16 10 0 18-6 20-16z" fill="#C084FC"/>
    <path d="M16 18c8 4 14 12 12 28-10-4-16-14-12-28z" fill="#A855F7"/>
    <path d="M48 18c-8 4-14 12-12 28 10-4 16-14 12-28z" fill="#A855F7"/>
    <path d="M32 8c8 8 10 22 0 38-10-16-8-30 0-38z" fill="#E879F9"/>
    <path d="M32 14c3 6 3 14 0 22-3-8-3-16 0-22z" fill="#F5D0FE"/>
    <path d="M10 48c8 6 36 6 44 0-2 6-12 10-22 10S12 54 10 48z" fill="#2DD4BF"/>
  `, false),

  // Burger
  food: wrap(`
    <path d="M8 30C8 16 18 8 32 8s24 8 24 22z" fill="#F59E0B"/>
    <path d="M14 26c1-9 8-14 16-15" stroke="#FCD34D" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="38" cy="16" rx="2.4" ry="1.2" fill="#FEF3C7"/>
    <ellipse cx="46" cy="22" rx="2.4" ry="1.2" fill="#FEF3C7"/>
    <ellipse cx="30" cy="22" rx="2.4" ry="1.2" fill="#FEF3C7"/>
    <path d="M6 32q4 5 8 0t8 0 8 0 8 0 8 0 8 0t4 0v5H6z" fill="#4ADE80"/>
    <rect x="8" y="37" width="48" height="4" rx="2" fill="#EF4444"/>
    <path d="M9 41h46l-3 4H12z" fill="#FACC15"/>
    <rect x="7" y="45" width="50" height="7" rx="3.5" fill="#78350F"/>
    <path d="M8 53h48v1c0 3-2 5-5 5H13c-3 0-5-2-5-5z" fill="#F59E0B"/>
  `, false),

  // Spool of thread
  textiles: wrap(`
    <rect x="16" y="8" width="32" height="8" rx="3" fill="#A16207"/>
    <rect x="16" y="48" width="32" height="8" rx="3" fill="#A16207"/>
    <rect x="19" y="16" width="26" height="32" fill="#F43F5E"/>
    <path d="M19 22l26 4M19 30l26 4M19 38l26 4" stroke="#BE123C" stroke-width="2"/>
    <rect x="22" y="16" width="4" height="32" fill="#FB7185"/>
    <path d="M45 40c8 0 11 6 8 14" stroke="#F43F5E" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M53 6L40 40" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
  `),

  // Businesswoman
  women: wrap(`
    <path d="M14 30c0-14 8-22 18-22s18 8 18 22v12H14z" fill="#7C2D12"/>
    <path d="M6 62c0-12 9-20 26-20s26 8 26 20z" fill="#4F46E5"/>
    <path d="M26 44l6 12 6-12z" fill="#F8FAFC"/>
    <path d="M26 44l-7 6 9 12zM38 44l7 6-9 12z" fill="#4338CA"/>
    <rect x="28" y="36" width="8" height="9" rx="3" fill="#F5C28A"/>
    <ellipse cx="32" cy="29" rx="11" ry="13" fill="#FBD0A0"/>
    <path d="M21 28c8 0 14-5 16-11 3 3 5 7 6 11-1-12-6-17-11-17s-10 5-11 17z" fill="#7C2D12"/>
    <circle cx="27.5" cy="29" r="1.3" fill="#1F2937"/>
    <circle cx="36.5" cy="29" r="1.3" fill="#1F2937"/>
    <path d="M28 35q4 3 8 0" stroke="#E11D48" stroke-width="2" fill="none" stroke-linecap="round"/>
  `, false),

  // Green apple
  organic: wrap(`
    <path d="M32 20c-8-6-22-2-22 14 0 14 10 24 22 22 12 2 22-8 22-22 0-16-14-20-22-14z" fill="#4ADE80"/>
    <path d="M32 20c8-6 22-2 22 14 0 14-10 24-22 22z" fill="#22C55E"/>
    <path d="M16 32c0-5 3-9 7-10" stroke="#BBF7D0" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M32 20c0-5 1-9 4-12" stroke="#78350F" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M35 14c0-7 6-11 13-10 0 7-6 11-13 10z" fill="#15803D"/>
    <path d="M38 12l7-5" stroke="#86EFAC" stroke-width="1.5" stroke-linecap="round"/>
  `),

  // Cupcake
  bakery: wrap(`
    <path d="M16 36h32l-4 20H20z" fill="#F59E0B"/>
    <path d="M24 36l1 20M32 36v20M40 36l-1 20" stroke="#D97706" stroke-width="2"/>
    <path d="M12 38c-2-8 4-12 8-12h24c4 0 10 4 8 12z" fill="#F9A8D4"/>
    <path d="M18 28c-1-7 4-10 8-10h12c4 0 9 3 8 10z" fill="#F472B6"/>
    <path d="M25 20c0-6 3-9 7-12 4 3 7 6 7 12z" fill="#EC4899"/>
    <circle cx="32" cy="8" r="4" fill="#DC2626"/>
    <circle cx="30.8" cy="6.8" r="1.1" fill="#FCA5A5"/>
    <rect x="18" y="31" width="5" height="2" rx="1" fill="#FDE047" transform="rotate(-25 20 32)"/>
    <rect x="40" y="30" width="5" height="2" rx="1" fill="#38BDF8" transform="rotate(25 42 31)"/>
    <rect x="30" y="25" width="5" height="2" rx="1" fill="#FFFFFF"/>
  `),

  // Lipstick
  makeup: wrap(`
    <path d="M25 32V16l9-11 5 4v23z" fill="#E11D48"/>
    <path d="M28 30V18l4-5v17z" fill="#FB7185"/>
    <rect x="23" y="32" width="18" height="6" fill="#FBBF24"/>
    <rect x="21" y="38" width="22" height="20" rx="3" fill="#7C3AED"/>
    <rect x="25" y="41" width="3" height="14" rx="1.5" fill="#C4B5FD"/>
    <path d="M50 12l1.5 3.5L55 17l-3.5 1.5L50 22l-1.5-3.5L45 17l3.5-1.5z" fill="#F472B6"/>
  `),

  // Scissors with a leaf
  salon: wrap(`
    <path d="M20 44L50 6l4 3-28 38z" fill="#CBD5E1"/>
    <path d="M44 44L14 6l-4 3 28 38z" fill="#94A3B8"/>
    <circle cx="32" cy="29" r="2.5" fill="#F59E0B"/>
    <circle cx="20" cy="47" r="8" fill="#F43F5E"/>
    <circle cx="20" cy="47" r="4" fill="#FFFFFF"/>
    <circle cx="44" cy="47" r="8" fill="#6366F1"/>
    <circle cx="44" cy="47" r="4" fill="#FFFFFF"/>
    <path d="M8 16c6-6 14-4 16 0-4 6-12 6-16 0z" fill="#22C55E"/>
  `),

  // Gift box
  gifting: wrap(`
    <rect x="10" y="28" width="44" height="28" rx="3" fill="#F43F5E"/>
    <rect x="10" y="28" width="9" height="28" fill="#FB7185" opacity=".55"/>
    <rect x="7" y="20" width="50" height="10" rx="3" fill="#E11D48"/>
    <rect x="28" y="20" width="8" height="36" fill="#FBBF24"/>
    <path d="M32 20C24 6 12 10 18 18c3 3 10 3 14 2z" fill="#FCD34D"/>
    <path d="M32 20C40 6 52 10 46 18c-3 3-10 3-14 2z" fill="#FCD34D"/>
    <circle cx="32" cy="19" r="4" fill="#F59E0B"/>
  `),

  // Potted plant
  decor: wrap(`
    <path d="M32 38C18 38 12 26 14 12c12 2 18 12 18 26z" fill="#4ADE80"/>
    <path d="M32 38c14 0 20-12 18-26-12 2-18 12-18 26z" fill="#22C55E"/>
    <path d="M32 34c-5-7-5-17 0-26 5 9 5 19 0 26z" fill="#86EFAC"/>
    <path d="M32 38V16" stroke="#15803D" stroke-width="1.5" opacity=".5"/>
    <path d="M18 42h28l-4 16H22z" fill="#F97316"/>
    <rect x="16" y="36" width="32" height="7" rx="3" fill="#EA580C"/>
  `),

  // Graduation cap
  education: wrap(`
    <path d="M16 32v12c0 5 32 5 32 0V32l-16 8z" fill="#1D4ED8"/>
    <path d="M32 10L4 24l28 14 28-14z" fill="#3B82F6"/>
    <path d="M32 10L4 24l28 14z" fill="#60A5FA"/>
    <path d="M56 26v16" stroke="#FBBF24" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M53 42h6l-1 9h-4z" fill="#FBBF24"/>
  `),

  // Camera
  photography: wrap(`
    <path d="M20 18l4-8h16l4 8z" fill="#4338CA"/>
    <rect x="4" y="18" width="56" height="38" rx="7" fill="#6366F1"/>
    <rect x="4" y="26" width="56" height="5" fill="#4F46E5"/>
    <circle cx="32" cy="39" r="13" fill="#E2E8F0"/>
    <circle cx="32" cy="39" r="10" fill="#0EA5E9"/>
    <circle cx="32" cy="39" r="6" fill="#0C4A6E"/>
    <circle cx="28.5" cy="35.5" r="2.5" fill="#FFFFFF" opacity=".8"/>
    <rect x="47" y="21" width="8" height="4" rx="2" fill="#FDE047"/>
    <rect x="46" y="12" width="8" height="6" rx="2" fill="#A5B4FC"/>
  `),

  // Sofa
  interior: wrap(`
    <rect x="10" y="14" width="44" height="26" rx="9" fill="#FBBF24"/>
    <rect x="14" y="24" width="17" height="16" rx="5" fill="#FCD34D"/>
    <rect x="33" y="24" width="17" height="16" rx="5" fill="#FCD34D"/>
    <rect x="12" y="38" width="40" height="14" rx="4" fill="#F59E0B"/>
    <rect x="4" y="30" width="12" height="22" rx="6" fill="#D97706"/>
    <rect x="48" y="30" width="12" height="22" rx="6" fill="#D97706"/>
    <rect x="10" y="52" width="4" height="6" rx="1" fill="#78350F"/>
    <rect x="50" y="52" width="4" height="6" rx="1" fill="#78350F"/>
  `, false),

  // Suitcase
  travel: wrap(`
    <path d="M24 20v-6a3 3 0 013-3h10a3 3 0 013 3v6" stroke="#0369A1" stroke-width="4" fill="none"/>
    <rect x="8" y="20" width="48" height="34" rx="6" fill="#38BDF8"/>
    <rect x="18" y="20" width="5" height="34" fill="#0EA5E9"/>
    <rect x="41" y="20" width="5" height="34" fill="#0EA5E9"/>
    <circle cx="32" cy="37" r="7" fill="#FBBF24"/>
    <circle cx="32" cy="37" r="3.5" fill="#FEF3C7"/>
    <circle cx="20" cy="57" r="3" fill="#1E293B"/>
    <circle cx="44" cy="57" r="3" fill="#1E293B"/>
  `, false),

  // Medical kit
  healthcare: wrap(`
    <path d="M24 20v-5a3 3 0 013-3h10a3 3 0 013 3v5" stroke="#B91C1C" stroke-width="4" fill="none"/>
    <rect x="6" y="20" width="52" height="34" rx="7" fill="#EF4444"/>
    <rect x="6" y="20" width="52" height="8" rx="4" fill="#F87171" opacity=".5"/>
    <rect x="28" y="27" width="8" height="20" rx="2" fill="#FFFFFF"/>
    <rect x="22" y="33" width="20" height="8" rx="2" fill="#FFFFFF"/>
  `),

  // Paint palette
  crafts: wrap(`
    <g transform="scale(1.3333)">
      <path d="M24 6C12 6 4 14 4 24s8 18 18 18c3 0 4-2 4-4 0-3-3-3-3-6 0-2 2-4 5-4h6c5 0 10-3 10-9C44 12 36 6 24 6z" fill="#FFB74D"/>
    </g>
    <circle cx="19" cy="32" r="4.5" fill="#EF4444"/>
    <circle cx="27" cy="19" r="4.5" fill="#FDE047"/>
    <circle cx="40" cy="17" r="4.5" fill="#22C55E"/>
    <circle cx="49" cy="28" r="4.5" fill="#3B82F6"/>
    <circle cx="32" cy="46" r="3" fill="#FFFFFF"/>
  `, false),

  // Balloons
  events: wrap(`
    <path d="M20 34c2 10 8 14 12 24M44 32c-2 10-8 16-12 26M32 42v16" stroke="#94A3B8" stroke-width="1.5" fill="none"/>
    <ellipse cx="20" cy="22" rx="10" ry="12" fill="#EF4444"/>
    <path d="M20 34l-2 3h4z" fill="#B91C1C"/>
    <ellipse cx="44" cy="20" rx="10" ry="12" fill="#3B82F6"/>
    <path d="M44 32l-2 3h4z" fill="#1D4ED8"/>
    <ellipse cx="32" cy="30" rx="10" ry="12" fill="#FBBF24"/>
    <path d="M32 42l-2 3h4z" fill="#D97706"/>
    <ellipse cx="16.5" cy="17" rx="2.5" ry="4" fill="#FFFFFF" opacity=".5"/>
    <ellipse cx="40.5" cy="15" rx="2.5" ry="4" fill="#FFFFFF" opacity=".5"/>
    <ellipse cx="28.5" cy="25" rx="2.5" ry="4" fill="#FFFFFF" opacity=".5"/>
  `, false),

  // Briefcase
  services: wrap(`
    <path d="M24 20v-5a3 3 0 013-3h10a3 3 0 013 3v5" stroke="#78350F" stroke-width="4" fill="none"/>
    <rect x="6" y="20" width="52" height="34" rx="6" fill="#B45309"/>
    <rect x="6" y="20" width="52" height="7" rx="3" fill="#D97706" opacity=".6"/>
    <rect x="6" y="34" width="52" height="5" fill="#78350F"/>
    <rect x="28" y="31" width="8" height="11" rx="2" fill="#FBBF24"/>
  `),
};