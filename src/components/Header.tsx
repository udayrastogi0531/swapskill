"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import {
  IconHome,
  IconMessage,
  IconWorldQuestion,
  IconPlus,
  IconUser,
  IconDashboard,
} from "@tabler/icons-react";
import { useAuthStore } from "@/store/useAuthStore";  // corrected path
import slugify from "@/utils/slugify";

export default function Header() {
  const user = useAuthStore((s) => s.session);

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-muted-foreground" />,
    },
    {
      name: "Explore",
      link: "/explore",
      icon: (
        <IconWorldQuestion className="h-4 w-4 text-muted-foreground" />
      ),
    },
  ];

  if (user) {
    navItems.push(
      {
        name: "Dashboard",
        link: "/dashboard",
        icon: <IconDashboard className="h-4 w-4 text-muted-foreground" />,
      },
      {
        name: "Profile",
        link: "/profile",
        icon: <IconUser className="h-4 w-4 text-muted-foreground" />,
      }
    );
  }

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}
