"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type MenuButtonProps = {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  href?: string;
};

export function MenuButton({
  icon: Icon,
  label,
  active,
  onClick,
  href,
}: MenuButtonProps) {
  const buttonClassName = `flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors focus-visible:ring-2 focus-visible:ring-blue-300 ${
    active
      ? "bg-blue-600 text-white"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

  const content = (
    <>
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={buttonClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={buttonClassName}
    >
      {content}
    </button>
  );
}
