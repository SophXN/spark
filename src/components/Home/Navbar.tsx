import { LogOutIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Link from "next/link";

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleBrowseMerchantsClick = () => {
    void router.push(`/browse-merchants`);
  };

  return (
    <header className="sticky top-0 z-10 flex w-full justify-center overflow-visible border-b border-gray-200 bg-white">
      <div className="w-full px-3">
        <div className="flex flex-row items-center justify-between">
          <Link href="/">
            <Image
              src={"/spark-logo.png"} // Make sure the logo is placed in the public directory
              alt="Logo"
              width={100}
              height={100}
              className="py-2"
            />
          </Link>
          <div className="flex flex-row">
            <Button
              size={"sm"}
              onClick={() => handleBrowseMerchantsClick()}
              className="px-1"
              variant={"ghost"}
            >
              <SearchIcon size={"14"} className="mr-1"></SearchIcon>
              Browse Merchants
            </Button>
            <Button
              size={"sm"}
              className="px-2"
              variant={"ghost"}
              onClick={() => signOut()}
            >
              <LogOutIcon size={"14"} className="mr-1"></LogOutIcon>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
