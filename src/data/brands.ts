// Brand registry for recognized brand queries (e.g. "wise", "shopify").
// When a search query matches a brand, the SRP shows a brand spotlight:
// a brand card on app results, or a brand banner on screen/flow results.
// Screenshots are hotlinked from Mobbin (browser-loaded via <img>).

export interface Brand {
  name: string;
  description: string;
  color: string; // brand color (drives the spotlight background tint)
  rating: string;
  ratingCount: string;
  category: string;
  platforms: string[];
  screens: string[]; // portrait iOS screens for the brand card strip
  screensWeb: string[]; // landscape web screens for the brand card strip
  href: string; // canonical Mobbin app page
}

export const BRANDS: Record<string, Brand> = {
  wise: {
    name: "Wise",
    description: "Money without borders",
    color: "#9FE870",
    rating: "4.18",
    ratingCount: "34",
    category: "Finance",
    platforms: ["iOS", "Android", "Web", "Site"],
    href: "https://mobbin.com/apps/wise-ios",
    screens: [
      "https://mobbin.com/api/mcp/short/L99AIkwj",
      "https://mobbin.com/api/mcp/short/sYoqSHja",
      "https://mobbin.com/api/mcp/short/9TKfX05a",
      "https://mobbin.com/api/mcp/short/A8lRdRV0",
      "https://mobbin.com/api/mcp/short/x5ZouumS",
      "https://mobbin.com/api/mcp/short/v3DxsxAJ",
    ],
    screensWeb: [
      "https://mobbin.com/api/mcp/short/yayqOdT1",
      "https://mobbin.com/api/mcp/short/yNsiBKZS",
      "https://mobbin.com/api/mcp/short/0YpdLPEP",
      "https://mobbin.com/api/mcp/short/K0KeHYzO",
      "https://mobbin.com/api/mcp/short/VuVVrljM",
      "https://mobbin.com/api/mcp/short/gye9yYSf",
    ],
  },
  shopify: {
    name: "Shopify",
    description: "Commerce for everyone",
    color: "#95BF47",
    rating: "4.50",
    ratingCount: "120",
    category: "Business",
    platforms: ["iOS", "Android", "Web", "Site"],
    href: "https://mobbin.com/apps/shopify-ios",
    screens: [
      "https://mobbin.com/api/mcp/short/aubVf7Ex",
      "https://mobbin.com/api/mcp/short/zxzxRWFl",
      "https://mobbin.com/api/mcp/short/csL0qUMy",
      "https://mobbin.com/api/mcp/short/Z7zKlUDK",
      "https://mobbin.com/api/mcp/short/nWo7Q5g3",
      "https://mobbin.com/api/mcp/short/Gt3AxXRG",
    ],
    screensWeb: [
      "https://mobbin.com/api/mcp/short/LtZKdaPH",
      "https://mobbin.com/api/mcp/short/ExZy6kd3",
      "https://mobbin.com/api/mcp/short/vUp4bDSG",
      "https://mobbin.com/api/mcp/short/XoeiRm04",
      "https://mobbin.com/api/mcp/short/ZgkI6GC8",
      "https://mobbin.com/api/mcp/short/l4Cb0H4h",
    ],
  },
};

export function brandFor(query: string): Brand | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return BRANDS[q] ?? null;
}
