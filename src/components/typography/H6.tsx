import { ReactNode } from "react";

export interface H6Interface {
  element: "h6" | "italic";
  children: ReactNode;
}

export function H6({ element, children }: H6Interface) {
  switch (element) {
    case "h6":
      return (
        <h6 className="text-md font-semibold self-end text-current dark:text-white">
          {children}
        </h6>
      );
    case "italic":
      return (
        <h6 className="text-md font-semibold self-end text-current dark:text-white italic">
          {children}
        </h6>
      );
  }
}
