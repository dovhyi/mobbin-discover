// Real Mobbin screens, gathered via the Mobbin MCP. Images are hotlinked from
// mobbin.com (loaded directly by the browser via plain <img>), and each card
// links to its canonical Mobbin screen page. Note: the `src` short links are
// MCP-generated and may expire over time.

export interface RealScreen {
  app: string;
  description: string;
  src: string; // Mobbin image URL (hotlinked)
  href: string; // canonical Mobbin screen page
  logoColor: string;
}

// iOS app home screens (portrait).
export const iosAppScreens: RealScreen[] = [
  { app: "Mindvalley", description: "Personal growth & learning", src: "https://mobbin.com/api/mcp/short/4dsuOUCV", href: "https://mobbin.com/screens/e730fb3a-0fe3-460f-901a-962910aa8c49", logoColor: "#1B1340" },
  { app: "Mammoth", description: "A Mastodon client", src: "https://mobbin.com/api/mcp/short/l8cQnzzQ", href: "https://mobbin.com/screens/cfbcf917-e6dd-4d4c-ba90-47bc54edba11", logoColor: "#6364FF" },
  { app: "Greg", description: "Plant care companion", src: "https://mobbin.com/api/mcp/short/P1rWQPhM", href: "https://mobbin.com/screens/2042d132-2ab0-4be2-b16b-fe65fe87dd1c", logoColor: "#4B7B4B" },
  { app: "Imgur", description: "The magic of the Internet", src: "https://mobbin.com/api/mcp/short/S4icOABU", href: "https://mobbin.com/screens/d8a4106e-89c7-4c6d-82ac-04d733b1f559", logoColor: "#1BB76E" },
  { app: "X", description: "What's happening", src: "https://mobbin.com/api/mcp/short/YVZtWVLe", href: "https://mobbin.com/screens/c61167fe-d104-417a-bf31-d712bf2d3848", logoColor: "#0D0D0D" },
];

// Web app screens (landscape).
export const webAppScreens: RealScreen[] = [
  { app: "Mixpanel", description: "Product analytics", src: "https://mobbin.com/api/mcp/short/asfdaV5H", href: "https://mobbin.com/screens/b02b8505-4e88-4f29-b32f-54a3f3f0d0f6", logoColor: "#7856FF" },
  { app: "Notion", description: "One workspace. Every team.", src: "https://mobbin.com/api/mcp/short/HXlTMNAK", href: "https://mobbin.com/screens/51cae267-6b32-4e06-b59e-302028fb9ce1", logoColor: "#0D0D0D" },
  { app: "Apollo", description: "The AI sales platform", src: "https://mobbin.com/api/mcp/short/XQWh0imo", href: "https://mobbin.com/screens/f529b1c6-55b7-422f-8386-995815296ce8", logoColor: "#ECF03C" },
];

// Website screens (landscape).
export const siteScreens: RealScreen[] = [
  { app: "Craft", description: "Notes, tasks, and big ideas", src: "https://mobbin.com/api/mcp/short/WOA4P0O1", href: "https://mobbin.com/screens/4d743fe2-e06e-4ea4-abd9-7f2b80d9b5b4", logoColor: "#2EA7FF" },
  { app: "Langdock", description: "The platform for AI adoption", src: "https://mobbin.com/api/mcp/short/nXWxMx7V", href: "https://mobbin.com/screens/b3db08cc-9aa6-43a7-9beb-436148558a52", logoColor: "#2E6BFF" },
  { app: "Mixpanel", description: "Progress is possible", src: "https://mobbin.com/api/mcp/short/7eK8x4ou", href: "https://mobbin.com/screens/21f5533a-1bde-45e1-9972-ff263254191b", logoColor: "#7856FF" },
];
