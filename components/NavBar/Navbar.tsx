/** @format */

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// import ThemeSwitch from "./ThemeSwitch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CloseIcons, MenuIcons } from "../social-icons/icons";
import ThemeSwitch from "./components/ThemeSwitch";
import { styles } from "@/app/style";

export const navLinks = [
  {
    id: "dashboard",
    title: "Dashboard",
  },
  {
    id: "map",
    title: "Map",
  },

  {
    id: "profile",
    title: "Profile",
  },
];

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("loginStatus");
    setIsLoggedIn(loginStatus === "true");
  }, []);

  const handleLogout = () => {
    localStorage.setItem("loginStatus", "false");
    setIsLoggedIn(false);
  };

  return (
    <nav
      className={`${styles.paddingX} fixed top-0 z-20 flex w-full items-center border-b-2 border-gray-300 bg-white/30 py-5 opacity-80 backdrop-blur-md`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scroll(0, 0);
          }}
        >
          <Image
            alt="logo"
            className="border-black-100 border-1 rounded-full"
            src={"/images/Backlog.png"}
            width={200}
            height={10}
            loading="eager"
            priority
          />
         
        </Link>
        <div className="flex gap-4 lg:gap-6">
          <ul className="hidden list-none flex-row items-center gap-4 text-sm md:flex lg:gap-6">
            {navLinks.map((link) => {
              return (
                <li
                  key={link.id}
                  className={`text-foreground transition-colors hover:text-foreground/80 ${
                    active === link.title ? "text-[#915eff]" : ""
                  }cursor-pointer`}
                  onClick={() => setActive(link.title)}
                >
                  <a href={`/${link.id}`}>{link.title}</a>
                </li>
              );
            })}
          </ul>

          {/* Login/Logout Button */}
          <div className="flex items-center">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-foreground transition-colors hover:text-foreground/80 cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth"
                className="text-foreground transition-colors hover:text-foreground/80 cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>

          <div className="flex flex-1 items-center justify-end md:hidden">
            <DropdownMenu onOpenChange={(open) => setToggle(open)}>
              <DropdownMenuTrigger aria-label="Small Screen navbar">
                {!toggle ? <MenuIcons /> : <CloseIcons />}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32">
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.title}>
                    <a
                      href={`/${link.id}`}
                      className={`text-foreground transition-colors hover:text-foreground/80 ${
                        active === link.title ? "text-[#915eff]" : ""
                      }cursor-pointer`}
                      onClick={() => {
                        setToggle(false);
                        setActive(link.title);
                      }}
                    >
                      {link.title}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
