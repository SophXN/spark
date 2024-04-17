"use client"

import React from "react";
import Navbar from "~/components/Navbar";
import Filters from "~/components/BrowseBusinesses/filters";

const BrowseMerchantsPage: React.FC = () => {

  return (
    <div>
      <Navbar />
      <div className="relative w-screen flex-1 space-y-8 mb-4">
        <div className="mx-3 mt-4 grid justify-items-center">
          <div className="w-full items-center sm:max-w-4xl">
            <h3 className="text-2xl font-bold">Explore businesses to work with</h3>
          </div>
          <div className="mt-3 w-full max-w-4xl">
          <Filters/>
          <div>
            
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseMerchantsPage;