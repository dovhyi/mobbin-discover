"use client";

import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  onSearchClick?: () => void;
  activePage?: "apps" | "sites";
}

export default function Navbar({ onSearchClick, activePage = "apps" }: NavbarProps) {
  const linkClass = (page: string) =>
    `text-[15px] font-semibold leading-[24px] tracking-[0.144px] transition-colors ${
      activePage === page ? "text-white" : "text-[#707070] hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-11">
      <nav className="border-b border-[rgba(255,255,255,0.08)] bg-[#141414] min-[1160px]:border-0">
        <div className="relative">
          <div
            className="mx-auto grid w-full grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[1fr_auto] items-center gap-x-[8px] min-[720px]:gap-x-[12px] min-[1160px]:grid-cols-[1fr_minmax(auto,520px)_1fr] min-[1160px]:grid-rows-1 min-[1160px]:py-[4px]"
            style={{
              maxWidth:
                "calc(var(--max-content-width) + var(--container-x-padding) * 2)",
              paddingLeft: "var(--container-x-padding)",
              paddingRight: "var(--container-x-padding)",
            }}
          >
            {/* Left: Logo + Nav (desktop) */}
            <div className="flex items-center gap-x-[16px] min-[1160px]:gap-x-[32px]">
              <Link href="/" className="shrink-0">
                <Image
                  src="/assets/logo.svg"
                  alt="Mobbin"
                  width={43}
                  height={20}
                />
              </Link>
              {/* Desktop nav links */}
              <div className="hidden min-[1160px]:block">
                <div className="flex items-center gap-x-[16px] min-[1160px]:gap-x-[24px]">
                  <Link href="/" className={linkClass("apps")}>
                    Apps
                  </Link>
                  <Link href="#" className={linkClass("sites")}>
                    Sites
                  </Link>
                </div>
              </div>
            </div>

            {/* Center: Search */}
            <div className="overflow-hidden px-[4px] py-[8px]">
              <div className="group relative">
                <button onClick={onSearchClick} className="relative flex h-[40px] w-full min-w-0 cursor-pointer items-center justify-start gap-x-[8px] rounded-[24px] bg-[rgba(255,255,255,0.06)] px-[16px] text-[#707070] transition-colors hover:bg-[rgba(255,255,255,0.10)] min-[1160px]:h-[48px] min-[1160px]:gap-x-[12px] min-[1160px]:px-[20px]">
                  <Image
                    src="/assets/search-icon.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="shrink-0 min-[1160px]:h-[20px] min-[1160px]:w-[20px]"
                  />
                  <span className="truncate text-[16px] font-normal leading-[24px]">
                    Search on Web...
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="shrink-0 pl-[0px] min-[720px]:px-0">
              <div className="flex flex-row items-center gap-x-[16px] min-[720px]:justify-end">
                <div className="flex flex-row items-center gap-x-[8px]">
                  {/* Bookmark icon — hidden below 1024 */}
                  <div className="hidden min-[1024px]:inline-flex">
                    <a href="#" className="p-[4px]">
                      <div className="h-[28px] w-[28px]">
                        <Image
                          src="/assets/bookmark-icon.png"
                          alt="Saved"
                          width={28}
                          height={28}
                        />
                      </div>
                    </a>
                  </div>
                  {/* Settings icon — hidden below 1024 */}
                  <div className="hidden min-[1024px]:inline-flex">
                    <a href="#" className="p-[4px]">
                      <div className="h-[28px] w-[28px]">
                        <Image
                          src="/assets/settings-icon.png"
                          alt="Community"
                          width={28}
                          height={28}
                        />
                      </div>
                    </a>
                  </div>
                </div>
                {/* Invite & earn — hidden below 1024 */}
                <div className="hidden items-center justify-center min-[1024px]:flex">
                  <button className="relative h-[36px] cursor-pointer rounded-full border border-[rgba(255,255,255,0.16)] px-[12px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[rgba(255,255,255,0.06)]">
                    <span className="flex items-center justify-center gap-x-[8px]">
                      <span className="truncate">Invite &amp; earn</span>
                    </span>
                  </button>
                </div>
                {/* Avatar */}
                <button className="transition-opacity hover:opacity-90">
                  <div className="relative">
                    <span className="relative block shrink-0 overflow-hidden rounded-full bg-[#141414]" style={{ width: 36, height: 36 }}>
                      <Image
                        src="/assets/avatar.png"
                        alt="Profile"
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile: Nav tabs on second row — hidden at 840+ */}
            <div className="col-span-full row-start-2 min-[1160px]:hidden">
              <div className="flex h-[44px] items-center gap-x-[16px] py-[4px] min-[1160px]:gap-x-[24px] min-[1160px]:py-0">
                <Link href="/" className={linkClass("apps")}>
                  Apps
                </Link>
                <Link href="#" className={linkClass("sites")}>
                  Sites
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
