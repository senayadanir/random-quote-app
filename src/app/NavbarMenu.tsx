"use client";

import { ModeToggle } from "../components/ui/mode-toggle";
import Link from "next/link";

import { useUser } from "@auth0/nextjs-auth0/client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";

const appRoots = [
  {
    name: "Home",
    url: "/",
    protectedPage: false,
  },
  {
    name: "My Favorites",
    url: "/user/quotes/liked",
    protectedPage: true,
  },
];

export function NavbarMenu() {
  const { user, isLoading } = useUser();

  if (isLoading) return <></>;

  return (
    <header className="w-full border-b bg-background/70 sticky top-0 z-50 backdrop-blur">
      <div className="flex h-16 max-w-6xl mx-auto items-center justify-between px-4">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-2 ">
            {appRoots.map(({ name, url, protectedPage }) => {
              if (protectedPage && !user) return null;

              return (
                <NavigationMenuItem key={name}>
                  <NavigationMenuLink
                    asChild
                    className={`${navigationMenuTriggerStyle()} font-semibold rounded-lg transition ease-in duration-200`}
                  >
                    <Link href={url}>{name}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
            {!!user && (
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} font-semibold rounded-lg transition ease-in duration-200 `}
                >
                  <Link href="/user/quotes/new">Add New Quote</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-4 transition ease-in duration-300">
          <ModeToggle />

          {!!user ? (
            <a
              href="/auth/logout"
              className={`${navigationMenuTriggerStyle()} font-semibold rounded-lg transition ease-in duration-200 text-muted-foreground hover:text-foreground hover:bg-accent`}
            >
              Log out
            </a>
          ) : (
            <a
              href="/auth/login"
              className={`${navigationMenuTriggerStyle()} font-semibold rounded-lg transition ease-in duration-200 border-2 border-primary text-primary hover:opacity-90 active:scale-98`}
            >
              Log in
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
