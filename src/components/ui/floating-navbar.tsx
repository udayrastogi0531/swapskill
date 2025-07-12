"use client";

import React, { JSX, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";  // make sure this path matches your config

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress, scrollY } = useScroll();

  // Pull user and signOut action from our Zustand store
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (scrollY.get() === 0) {
      setVisible(true);
      return;
    }
    if (typeof current === "number") {
      const delta = current - scrollYProgress.getPrevious()!;
      // if very near top, hide nav
      if (current < 0.05) {
        setVisible(false);
      } else {
        // scroll up → show; scroll down → hide
        setVisible(delta < 0);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed inset-x-0 top-10 z-50 mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full border border-border bg-card py-2 pl-8 pr-2 shadow-lg backdrop-blur-sm",
          className
        )}
      >
        {navItems.map((item, idx) => {
          // e.g. hide "Ask a Question" nav link if not signed in
          if (item.link === "/questions/ask" && !user) return null;
          return (
            <Link
              key={idx}
              href={item.link}
              className={cn(
                "relative flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
              )}
            >
              <span className="block sm:hidden">{item.icon}</span>
              <span className="hidden text-sm sm:block">{item.name}</span>
            </Link>
          );
        })}

        {user ? (
          <button
            onClick={() => signOut()}
            className="relative rounded-full border border-border bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/80 transition-colors"
          >
            <span>Sign Out</span>
            <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent" />
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="relative rounded-full border border-border bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              <span>Login</span>
              <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-secondary-foreground/50 to-transparent" />
            </Link>
            <Link
              href="/register"
              className="relative rounded-full border border-border bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/80 transition-colors"
            >
              <span>Signup</span>
              <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent" />
            </Link>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
