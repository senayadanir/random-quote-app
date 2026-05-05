"use client";

import { ModeToggle } from "../components/ui/mode-toggle.jsx";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu.jsx";

const appRoots = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Liked Quotes",
    url: "/user/quotes/liked",
  },
  {
    name: "Unliked Quotes",
    url: "/user/quotes/unliked",
  },
];

export function NavbarMenu() {
  return (
    <header className="w-full border-b bg-background/70 sticky top-0 z-50 backdrop-blur">
      <div className="flex h-16 max-w-6xl mx-auto items-center justify-between px-4">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-2 ">
            {appRoots.map(({ name, url }) => (
              <NavigationMenuItem key={name}>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} font-semibold rounded-lg transition ease-in duration-200`}
                >
                  <Link href={url}>{name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            {/* <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
         <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/user/quotes/liked">Liked Quotes</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/user/quotes/unliked">Unliked Quotes</Link>
          </NavigationMenuLink>
        </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto">
          <ModeToggle className="transition ease-in duration-300" />
        </div>
      </div>
    </header>
  );
}
