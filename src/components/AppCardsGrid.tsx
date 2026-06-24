"use client";

import Image from "next/image";

interface AppData {
  name: string;
  description: string;
  screenImage: string;
  logoImage: string;
  rating: string;
}

const apps: AppData[] = [
  {
    name: "Pinterest",
    description: "Fashion, home design and ideas",
    screenImage: "/assets/pinterest-screen.png",
    logoImage: "/assets/pinterest-logo.png",
    rating: "4.95",
  },
  {
    name: "Posh",
    description: "Social experiences",
    screenImage: "/assets/posh-screen.png",
    logoImage: "/assets/posh-logo.png",
    rating: "5.0",
  },
  {
    name: "Kiwi.com",
    description: "Cheap flights",
    screenImage: "/assets/kiwi-screen.png",
    logoImage: "/assets/kiwi-logo.png",
    rating: "4.97",
  },
  {
    name: "Visitors",
    description: "Realtime web analytics",
    screenImage: "/assets/visitors-screen.png",
    logoImage: "/assets/visitors-logo.png",
    rating: "4.81",
  },
  {
    name: "Kraken",
    description: "Buy and sell crypto securely",
    screenImage: "/assets/kraken-screen.png",
    logoImage: "/assets/kraken-logo.png",
    rating: "5.0",
  },
  {
    name: "Linktree",
    description: "Link in bio creator",
    screenImage: "/assets/linktree-screen.png",
    logoImage: "/assets/linktree-logo.png",
    rating: "5.0",
  },
];

function AppCard({ app }: { app: AppData }) {
  return (
    <div className="group/cell relative flex flex-col gap-y-[16px]">
      {/* Card / Screenshot area — square aspect ratio */}
      <a
        href="#"
        className="relative block overflow-hidden rounded-[28px] bg-[#222222] transition-colors duration-300 aspect-square group-hover/cell:bg-[#272727]"
      >
        {/* Screenshot centered inside the square card */}
        <div className="flex size-full items-center justify-center">
          <div className="relative w-[81.7%] overflow-hidden rounded-[10px]">
            <Image
              src={app.screenImage}
              alt={`${app.name} screenshot`}
              width={800}
              height={500}
              className="w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[inset_0px_0px_0px_0.5px_rgba(255,255,255,0.16)]" />
          </div>
        </div>

        {/* Rating badge */}
        <div className="pointer-events-none absolute left-[16px] top-[16px] flex items-center justify-center gap-x-[4px] rounded-[8px] bg-[rgba(115,115,115,0.56)] px-[8px] py-[4px] backdrop-blur-sm">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M5 0.5L6.12 3.68L9.51 3.94L6.93 6.18L7.74 9.5L5 7.82L2.26 9.5L3.07 6.18L0.49 3.94L3.88 3.68L5 0.5Z"
              fill="white"
            />
          </svg>
          <span className="text-[12px] font-semibold leading-[16px] text-white">
            {app.rating}
          </span>
        </div>
      </a>

      {/* App info */}
      <section className="pointer-events-none flex w-full items-center gap-x-[8px]">
        {/* Logo */}
        <div
          className="relative h-[40px] w-[40px] shrink-0 overflow-hidden bg-[rgba(255,255,255,0.06)]"
          style={{ borderRadius: "30%" }}
        >
          <Image
            src={app.logoImage}
            alt={`${app.name} logo`}
            fill
            className="object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 shadow-[inset_0px_0px_0px_0.5px_rgba(255,255,255,0.16)]"
            style={{ borderRadius: "30%" }}
          />
        </div>
        {/* Text */}
        <div className="flex min-w-0 grow flex-col">
          <h3 className="truncate text-[16px] font-semibold leading-[24px] tracking-[0.144px] text-white">
            {app.name}
          </h3>
          <p className="truncate text-[14px] font-[456] leading-[20px] tracking-[0.196px] text-[#adadad]">
            {app.description}
          </p>
        </div>
      </section>
    </div>
  );
}

export default function AppCardsGrid() {
  return (
    <div className="pb-[24px]">
      <div
        className="grid content-start gap-x-[12px] gap-y-[20px] min-[720px]:gap-x-[16px] min-[720px]:gap-y-[48px]"
        style={{
          gridTemplateColumns:
            "repeat(auto-fill, minmax(max(300px, calc((100% - 2 * 16px) / 3)), 1fr))",
        }}
      >
        {apps.map((app) => (
          <AppCard key={app.name} app={app} />
        ))}
      </div>

      {/* Pagination dots */}
      <div className="flex w-full items-center justify-center py-[24px]">
        <Image
          src="/assets/pagination-dots.svg"
          alt=""
          width={34}
          height={7}
        />
      </div>
    </div>
  );
}
