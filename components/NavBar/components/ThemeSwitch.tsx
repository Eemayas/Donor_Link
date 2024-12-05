/** @format */

"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "@/components/social-icons/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  return (
    <div className="mr-5">
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Theme Changer">
          {resolvedTheme === "dark" ? <Moon /> : <Sun />}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32">
          <DropdownMenuItem onSelect={() => setTheme("light")}>
            <div className="mr-2">
              <Sun />
            </div>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              console.log("Helloe");
              setTheme("dark");
            }}
          >
            <div className="mr-2">
              <Moon />
            </div>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setTheme("system")}>
            <div className="mr-2">
              <Monitor />
            </div>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThemeSwitch;
