"use client"

import React from "react";
import { useState, useEffect } from "react";
import Navbar from "~/components/Navbar";
import Filters from "~/components/BrowseBusinesses/filters";
import { filterObject, BusinessType, BrowseMerchantsQuery } from "~/types/types";
import { mcc } from "~/utils/mcc";
import { api } from "~/utils/api";

const BrowseMerchantsPage: React.FC = () => {

  const [query, setQuery] = React.useState<BrowseMerchantsQuery>({})
  console.log(query, "<= final query")
  
  const {
    data: companyData,
    isLoading,
    error,
  } = api.company.filterCompanies.useQuery(query)

  return (
    <div>
      <Navbar />
      <div className="relative w-screen flex-1 space-y-8 mb-4">
        <div className="mx-3 mt-4 grid justify-items-center">
          <div className="w-full items-center sm:max-w-4xl">
            <h3 className="text-2xl font-bold">Explore businesses to work with</h3>
          </div>
          <div className="mt-3 w-full max-w-4xl">
          <Filters onChange={setQuery} />
          <div>
            
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseMerchantsPage;