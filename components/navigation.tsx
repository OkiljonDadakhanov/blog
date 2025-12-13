"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/writing", label: "Writing" },
  { href: "/notes", label: "Notes" },
  { href: "/reading", label: "Reading" },
  { href: "/movies", label: "Movies" },
  { href: "/quotes", label: "Quotes" },
  { href: "/about", label: "About" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="max-w-[640px] mx-auto px-6 py-6">
      <div className="flex gap-6 text-sm flex-wrap items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:opacity-60 transition-opacity",
                isActive && "font-medium opacity-100"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

