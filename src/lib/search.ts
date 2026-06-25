// Filter model ported from the Mobbin SRP reference prototype.

export type Experience = "apps" | "sites";
export type Platform = "iOS" | "Web";

export interface FilterGroup {
  name: string | null;
  items: string[];
}

export const FILTER_DATA: Record<Experience, Record<string, FilterGroup[]>> = {
  apps: {
    Categories: [
      {
        name: null,
        items: [
          "AI", "Business", "Collaboration", "Communication", "CRM", "Crypto & Web3",
          "Developer Tools", "Education", "Entertainment", "Finance", "Food & Drink",
          "Games", "Health & Fitness", "Lifestyle", "Music", "News", "Photo & Video",
          "Productivity", "Real Estate", "Shopping", "Social", "Sports", "Travel",
          "Utilities", "Weather",
        ],
      },
    ],
    Screens: [
      { name: "New User Experience", items: ["Account Setup", "Guided Tour & Tutorial", "Signup", "Splash Screen", "Verification", "Welcome & Get Started"] },
      { name: "Account Management", items: ["Delete & Deactivate Account", "Forgot Password", "Login", "Logout", "Profile", "Settings", "Two-Factor Authentication"] },
      { name: "Discovery", items: ["Browse", "Categories", "Explore", "Feed", "Home", "Search"] },
      { name: "Commerce", items: ["Cart", "Checkout", "Order History", "Payment", "Product Detail"] },
      { name: "Communication", items: ["Chat", "Inbox", "Messages", "Notifications"] },
      { name: "Engagement", items: ["Empty State", "Error", "Loading", "Paywall", "Permission", "Rating Prompt"] },
    ],
    "UI Elements": [
      { name: "Control", items: ["Accordion", "Button", "Checkbox", "Color Picker", "Date Picker", "File Upload", "Floating Action Button", "Page Control", "Radio Button", "Rating Control", "Slider", "Stepper", "Switch", "Tab", "Text Field"] },
      { name: "Navigation", items: ["Breadcrumb", "Header", "Menu", "Pagination", "Sidebar", "Tab Bar"] },
      { name: "Feedback", items: ["Alert", "Badge", "Banner", "Progress Bar", "Snackbar", "Toast", "Tooltip"] },
      { name: "Data Display", items: ["Avatar", "Card", "Carousel", "Chart", "Icon", "Image", "List", "Table", "Tag"] },
      { name: "Container", items: ["Bottom Sheet", "Dialog", "Drawer", "Modal", "Popover"] },
    ],
    Flows: [
      { name: "New User Experience", items: ["Browsing Tutorial", "Creating Account", "Onboarding"] },
      { name: "Account Management", items: ["Deleting & Deactivating Account", "Editing Profile", "Logging In", "Logging Out", "Resetting Password", "Switching Account"] },
      { name: "Commerce", items: ["Adding to Cart", "Browsing Products", "Checking Out", "Making Payment", "Tracking Order"] },
      { name: "Content", items: ["Bookmarking", "Filtering", "Searching", "Sharing", "Sorting"] },
      { name: "Communication", items: ["Calling", "Messaging", "Sending File"] },
    ],
  },
  sites: {
    Categories: [
      { name: null, items: ["Business", "Crypto", "Education", "Entertainment", "Finance", "Food", "Health", "Lifestyle", "Portfolio", "Shopping", "Social", "Technology", "Travel", "Other"] },
    ],
    Sections: [
      { name: null, items: ["404", "About", "Blog", "CTA", "Comparison", "Contact", "Downloads", "FAQ", "Features", "Footer", "Hero", "How It Works", "Logos", "Navigation", "Newsletter", "Pricing", "Roadmap", "Stats", "Team", "Testimonials"] },
    ],
    Styles: [
      { name: null, items: ["3D", "Black & White", "Bold", "Brutalist", "Colorful", "Dark", "Editorial", "Fun", "Glass", "Grid", "Illustration", "Light", "Minimal", "Monochrome", "Motion", "Neumorphism", "Playful", "Retro", "Serif", "Vibrant"] },
    ],
  },
};

export const DIMENSIONS: Record<Experience, string[]> = {
  apps: ["Categories", "Screens", "UI Elements", "Flows"],
  sites: ["Categories", "Sections", "Styles"],
};

// Screens/UI Elements and Flows are mutually exclusive content axes: a
// selected Flow hides Screens & UI Elements, and vice versa.
export function visibleDimensions(experience: Experience, filters: Filters): string[] {
  if (experience === "sites") return DIMENSIONS.sites;
  if ((filters["Flows"] || []).length) return ["Categories", "Flows"];
  if ((filters["Screens"] || []).length || (filters["UI Elements"] || []).length) {
    return ["Categories", "Screens", "UI Elements"];
  }
  return ["Categories", "Screens", "UI Elements", "Flows"];
}

export const SORTS = ["Trending", "Latest", "Most popular", "Top rated"];

export type Filters = Record<string, string[]>;

export type ResultType = "apps" | "screens" | "flows";

// Which result grid to show given the active filters (per the design rules):
// Apps when nothing / a category is selected; Screens for Screens or UI Elements;
// Flows for Flows.
export function resultTypeFor(experience: Experience, filters: Filters): ResultType {
  if (experience === "apps") {
    if ((filters["Flows"] || []).length) return "flows";
    if ((filters["Screens"] || []).length || (filters["UI Elements"] || []).length) return "screens";
    return "apps";
  }
  // sites: Sections / Styles behave like the screen grid; otherwise app/site cards.
  if ((filters["Sections"] || []).length || (filters["Styles"] || []).length) return "screens";
  return "apps";
}

const TOTALS: Record<ResultType, number> = { apps: 479, screens: 1240, flows: 312 };

export function resultCount(type: ResultType): number {
  return TOTALS[type];
}

export function flattenItems(groups: FilterGroup[]): string[] {
  return groups.flatMap((g) => g.items);
}
