// components/Navbar.tsx

import { Link, LogOutIcon, SearchIcon, SearchXIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";

const Navbar: React.FC = () => {
  return (
    <header className="w-full flex justify-center sticky top-0 z-10 overflow-visible border-b border-gray-200 bg-white">
      <div className="w-full max-w-7xl px-3">
        <div className="flex flex-row justify-between items-center">
          <a href="/">
            <Image
              src={"/spark-logo.png"} // Make sure the logo is placed in the public directory
              alt="Logo"
              width={100}
              height={100}
              className="py-2"
            />
          </a>
          <div className="flex flex-row gap-2">
          <Button size={"sm"} className="px-2" variant={"outline"}><SearchIcon size={"14"} className="mr-1"></SearchIcon>Browse Merchants</Button>
            <Button size={"sm"} className="px-2" variant={"outline"}><LogOutIcon size={"14"} className="mr-1"></LogOutIcon>Logout</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
