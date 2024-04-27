"use client"

import React from "react";
import Navbar from "~/components/Home/Navbar";
import Filters from "~/components/BrowseBusinesses/filters";
import { type BrowseMerchantsQuery } from "~/types/types";
import { api } from "~/utils/api";
import BusinessCard from "~/components/BrowseBusinesses/businessCard";
import { Skeleton } from "~/components/ui/skeleton"

const BrowseMerchantsPage: React.FC = () => {

  const [query, setQuery] = React.useState<BrowseMerchantsQuery>({})
  console.log(query, "<= final query")

  const {
    data: companyData,
    isLoading,
  } = api.company.filterCompanies.useQuery(query)

  return (
    <div>
      <Navbar />
      <div className="flex w-full items-start sm:justify-center gap-1 px-4 my-4">
        <div className="w-full sm:w-[1000px]">
          <div className="w-full items-center">
            <h3 className="text-2xl font-bold">Explore businesses to work with</h3>
          </div>
          <div className="mt-3 w-full">
            <Filters onChange={setQuery} />
            {isLoading ? (
              <div>
                <Skeleton className="mt-4 w-full h-[300px] rounded-md" />
                <Skeleton className="mt-4 w-full h-[300px] rounded-md" />
                <Skeleton className="mt-4 w-full h-[300px] rounded-md" />
              </div>) :
              (
                companyData?.map((company) => {
                  console.log(company)
                  return <BusinessCard key={company.squareMerchantId} companyData={company} ></BusinessCard>
                }))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseMerchantsPage;