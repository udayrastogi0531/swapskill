"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import {
  IconHome,
  IconMessage,
  IconWorldQuestion,
  IconPlus,
} from "@tabler/icons-react";
import { useAuthStore } from "@/store/useAuthStore";  // corrected path
import slugify from "@/utils/slugify";

export default function Header() {
  const user = useAuthStore((s) => s.user);

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-muted-foreground" />,
    },
    {
      name: "Questions",
      link: "/questions",
      icon: (
        <IconWorldQuestion className="h-4 w-4 text-muted-foreground" />
      ),
    },
    {
      name: "Ask Question",
      link: "/questions/ask",
      icon: <IconPlus className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  if (user) {
    navItems.push({
      name: "Profile",
      link: `/users/${user.uid}/${slugify(user.displayName ?? "profile")}`,
      icon: (
        <IconMessage className="h-4 w-4 text-muted-foreground" />
      ),
    });
  }

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}
