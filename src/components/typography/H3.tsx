import { ReactNode } from "react";

export interface H3Interface {
  element: "p" | "span" | "h3";
  children: React.ReactNode;
  className?: string;
}

export function H3({ element, children }: H3Interface) {
  switch (element) {
    case "p":
      return <p className="text-2xl font-semibold">{children}</p>;
    case "span":
      return <span className="text-2xl font-semibold">{children}</span>;
    case "h3":
      return (
        <h3 className="text-2xl font-semibold text-current dark:text-white">
          {children}
        </h3>
      );
  }
}
