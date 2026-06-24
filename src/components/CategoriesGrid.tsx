"use client";

import Image from "next/image";

const categoriesData = [
  {
    title: "Categories",
    items: ["Business", "Health & Fitness", "Productivity", "Crypto & Web3", "Developer Tools"],
  },
  {
    title: "Screens",
    items: [
      "Filter & Sort",
      "Chat Bot",
      "Charts",
      "Signup",
      "Login",
    ],
  },
  {
    title: "UI Elements",
    items: ["Text Field", "Stepper", "Side Navigation", "Card", "Table"],
  },
  {
    title: "Flows",
    items: [
      "Reporting",
      "Resetting Password",
      "Chatting & Sending Messages",
      "Searching & Finding",
      "Onboarding",
    ],
  },
];

export default function CategoriesGrid() {
  return (
    <div className="hidden grid-cols-4 gap-x-[40px] min-[1024px]:grid">
      {categoriesData.map((category) => (
        <div key={category.title} className="flex flex-col gap-y-[8px]">
          <button className="group flex w-fit items-center gap-x-[4px]">
            <h3 className="text-[14px] font-[456] leading-[20px] tracking-[0.196px] text-[#adadad]">
              {category.title}
            </h3>
            <Image
              src="/assets/chevron.svg"
              alt=""
              width={16}
              height={16}
              className="opacity-0 transition-opacity group-hover:opacity-100"
            />
          </button>
          <ul className="group/list flex flex-col">
            {category.items.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-[24px] font-[652] leading-[30px] text-white transition-opacity duration-150 group-hover/list:opacity-40 hover:!opacity-100"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
