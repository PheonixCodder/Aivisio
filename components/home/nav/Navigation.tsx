"use client";

import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ROUTES } from "@/lib/routes";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Navigation = () => {
  return (
    <div className="w-full bg-background/60 backdrop-blur-md fixed top-0 left-0 px-8 py-4 z-50 shadow-xl">
      <header className="container mx-auto flex items-center">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden md:flex items-center gap-6">
          <NavItems />
        </nav>

        {/* Mobile Navigation */}
        <div className="ml-auto md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <MenuIcon className="h-6 w-6" strokeWidth={1.5} />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <SheetHeader>
                <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
              </SheetHeader>
              <NavItems mobile />
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
};

export default Navigation;

const NavItems = ({ mobile }: { mobile?: boolean }) => {
  const links = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faqs", label: "FAQs" },
  ];

  if (mobile) {
    return (
      <div className="flex flex-col gap-6 mt-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            {link.label}
          </Link>
        ))}
        <Link href={`${ROUTES.LOGIN}?state=signup`}>
          <Button className="mt-4 w-full">Get Started</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          {link.label}
        </Link>
      ))}
      <Link href={`${ROUTES.LOGIN}?state=signup`}>
        <Button>Get Started</Button>
      </Link>
    </>
  );
};
