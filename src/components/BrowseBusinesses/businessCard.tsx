"use client";

import React from "react";
import { Badge } from "../ui/badge";
import {
  Facebook,
  Globe2,
  Home,
  Instagram,
  SendIcon,
  Twitter,
} from "lucide-react";
import { Button } from "../ui/button";
import { type BrowseCompanies, BusinessType } from "~/types/types";
import { mcc } from "~/utils/mcc";
import Image from "next/image";

interface BusinessCardProps {
  companyData: BrowseCompanies; // Using the extended type here
}

export default function BusinessCard({ companyData }: BusinessCardProps) {
  function findMerchantByMcc(mccCode: string) {
    return mcc.find((merchant) => merchant.mcc === mccCode)?.value;
  }

  const concatenatedCities = companyData.locations.reduce(
    (accumulator, currentValue) => {
      return accumulator + (accumulator ? ", " : "") + currentValue.city;
    },
    "",
  );

  const concatenatedTypes = companyData.locations.reduce(
    (accumulator, currentValue) => {
      let newValue = "";
      if(currentValue.type == BusinessType.PHYSICAL as string) newValue = "Physical"
      if(currentValue.type == BusinessType.VIRTUAL as string) newValue = "Virtual"
      if(currentValue.type == BusinessType.MOBILE as string) newValue = "Mobile"
      return accumulator + (accumulator ? ", " : "") + newValue;
    },
    "",
  );

  return (
    <div className="mt-4 flex w-full flex-row flex-wrap rounded-md bg-slate-50 p-3">
      <div className="flex flex-grow flex-col">
        <div className="flex flex-row items-center gap-2">
          <div className="flex-shrink-0">
            {companyData.profilePicture ? (
              <div>
                <Image
                  className="h-12 w-12 object-cover rounded-full"
                  src={companyData.profilePicture}
                  alt="Business Logo"
                  width="100"
                  height="100"
                  layout="fixed"
                />
              </div>
            ) : (
              <div className="h-12 w-12">
                <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {companyData.name}
              </p>
            </div>
            <div className="mt-0.5 flex flex-row gap-1">
              <a href="">
                <Twitter size={"18"} className="text-slate-700"></Twitter>
              </a>
              <a href="">
                <Instagram size={"18"} className="text-slate-700"></Instagram>
              </a>
              <a href="">
                <Facebook size={"18"} className="text-slate-700"></Facebook>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm">{companyData.businessDescription}</p>
        </div>
        <div className="mt-2 flex flex-row gap-1">
          {companyData.locations.map((location) => {
            return (
              <Badge key={location.merchantCode}>
                {findMerchantByMcc(location.merchantCode)}
              </Badge>
            );
          })}
        </div>
        <div className="mt-2 flex flex-row items-center gap-1">
          <Globe2 size={"20"}></Globe2>
          <p className="text-sm text-muted-foreground">{concatenatedCities}</p>
          <p className="font-extrabold">·</p>
          <Home size={"20"}></Home>
          <p className="text-sm text-muted-foreground">{concatenatedTypes}</p>
        </div>
        <div className="mt-2 flex flex-row flex-wrap items-center gap-2">
          <div className="flex flex-row gap-1">
            <p className="text-sm">Collaborations:</p>
            <p className="text-sm font-bold">
              {
                companyData.collaboratorResponses.filter(
                  (item) => item.status === "ACCEPTED",
                ).length
              }
            </p>
          </div>
          <div className="flex flex-row gap-1">
            <p className="text-sm">Events thrown:</p>
            <p className="text-sm font-bold">
              {companyData._count.eventRequests}
            </p>
          </div>
          <div className="flex flex-row gap-1">
            <p className="text-sm">Collab requests:</p>
            <p className="text-sm font-bold">
              {companyData._count.collaboratorResponses}
            </p>
          </div>
        </div>
      </div>
      <Button size={"sm"} className="mt-2 w-full px-1 sm:mt-0 sm:w-auto">
        <SendIcon size={"17"} className="mr-1" />
        <span className="text-sm">Invite to Collab</span>
      </Button>
    </div>
  );
}
