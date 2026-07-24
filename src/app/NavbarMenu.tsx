"use client";

import { ModeToggle } from "../components/ui/mode-toggle";
import Link from "next/link";
import { Home, Heart, FileText, PlusCircle, LogIn, LogOut } from "lucide-react";
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
    icon: Home,
  },
  {
    name: "My Favorites",
    url: "/user/quotes/liked",
    protectedPage: true,
    icon: Heart,
  },
  {
    name: "My Quotes",
    url: "/user/quotes/my",
    protectedPage: true,
    icon: FileText,
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
            {appRoots.map(({ name, url, protectedPage, icon: Icon }) => {
              if (protectedPage && !user) return null;

              return (
                <NavigationMenuItem key={name}>
                  <NavigationMenuLink
                    asChild
                    className={`${navigationMenuTriggerStyle()} font-semibold rounded-lg transition ease-in duration-200`}
                  >
                    <Link href={url} aria-label={name}>
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span className="hidden sm:block md:block xl:block 2xl:block">
                        {name}
                      </span>
                    </Link>
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
                  <Link href="/user/quotes/new" aria-label="Add New Quote">
                    <PlusCircle className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:block md:block xl:block 2xl:block">
                      Add New Quote
                    </span>
                  </Link>
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
              aria-label="Log out"
              className={`${navigationMenuTriggerStyle()} font-semibold rounded-lg transition ease-in duration-200 text-muted-foreground hover:text-foreground hover:bg-accent`}
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:block md:block xl:block 2xl:block">
                Log out
              </span>
            </a>
          ) : (
            <a
              href="/auth/login"
              aria-label="Login"
              className={`${navigationMenuTriggerStyle()} font-semibold rounded-lg transition ease-in duration-200 border-2 border-primary text-primary hover:opacity-90 active:scale-98`}
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:block md:block xl:block 2xl:block">
                Log in
              </span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
