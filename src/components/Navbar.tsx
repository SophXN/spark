// components/Navbar.tsx

import Image from 'next/image';
import React from 'react';

const Navbar: React.FC = () => {
  return (
      <header className="sticky top-0 z-10 overflow-visible border-b border-gray-200 bg-white">
        <Image
          src={"/spark-logo.png"} // Make sure the logo is placed in the public directory
          alt="Logo"
          width={100}
          height={100}
          className="ml-3 py-2"
        />
      </header>
  );
};

export default Navbar;
