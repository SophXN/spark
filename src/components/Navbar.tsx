// components/Navbar.tsx

import { Link, LogOutIcon, SearchIcon, SearchXIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleBrowseMerchantsClick = () => {
    void router.push(`/browse-merchants`);
  };
  
  return (
    <header className="w-full flex justify-center sticky top-0 z-10 overflow-visible border-b border-gray-200 bg-white">
      <div className="w-full px-3">
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
          <div className="flex flex-row">
            <Button size={"sm"}
              onClick={() => handleBrowseMerchantsClick()}
              className="px-1"
              variant={"ghost"}>
              <SearchIcon size={"14"} className="mr-1"></SearchIcon>
              Browse Merchants
            </Button>
            <Button
              size={"sm"}
              className="px-2"
              variant={"ghost"}
              onClick={() => signOut()}>
              <LogOutIcon size={"14"} className="mr-1"></LogOutIcon>
              Logout</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
