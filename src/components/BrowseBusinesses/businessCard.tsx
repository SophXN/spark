"use client"

import React from "react";
import { Badge } from "../ui/badge";
import { Facebook, Globe2, Home, Instagram, SendIcon, Twitter } from "lucide-react";
import { TwitterLogoIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { BrowseCompanies } from "~/types/types";
import { mcc } from "~/utils/mcc";

interface BusinessCardProps {
    companyData: BrowseCompanies; // Using the extended type here
}

export default function BusinessCard({ companyData }: BusinessCardProps) {

    function findMerchantByMcc(mccCode: string) {
        return mcc.find(merchant => merchant.mcc === mccCode)?.value;
    }

    const concatenatedCities = companyData.locations.reduce((accumulator, currentValue) => {
        return accumulator + (accumulator ? ', ' : '') + currentValue.city;
    }, '');

    const concatenatedTypes = companyData.locations.reduce((accumulator, currentValue) => {
        return accumulator + (accumulator ? ', ' : '') + currentValue.type;
    }, '');

    return (
        <div className="mt-4 w-full bg-slate-50 rounded-md p-3 flex flex-row flex-wrap">
            <div className="flex flex-col flex-grow">
                <div className="flex flex-row gap-2 items-center">
                    <div className="flex-shrink-0">
                        <img
                            className="h-[70px] w-[70px] rounded-full"
                            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt=""
                        />
                    </div>
                    <div className="min-w-0 flex flex-col gap-1">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {companyData.name}
                            </p>
                        </div>
                        <div className="flex flex-row gap-1 mt-0.5">
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
                        return <Badge key={location.merchantCode}>{findMerchantByMcc(location.merchantCode)}</Badge>
                    })}
                </div>
                <div className="mt-2 flex flex-row gap-1 items-center">
                    <Globe2 size={"20"}></Globe2>
                    <p className="text-muted-foreground text-sm">{concatenatedCities}</p>
                    <p className="font-extrabold">·</p>
                    <Home size={"20"}></Home>
                    <p className="text-muted-foreground text-sm">{concatenatedTypes}</p>
                </div>
                <div className="mt-2 flex flex-row flex-wrap gap-2 items-center">
                    <div className="flex flex-row gap-1">
                        <p className="text-sm">Collaborations:</p>
                        <p className="text-sm font-bold">{companyData.collaboratorResponses.filter(item => item.status === "ACCEPTED").length}</p>
                    </div>
                    <div className="flex flex-row gap-1">
                        <p className="text-sm">Events thrown:</p>
                        <p className="text-sm font-bold">{companyData._count.eventRequests}</p>
                    </div>
                    <div className="flex flex-row gap-1">
                        <p className="text-sm">Collab requests:</p>
                        <p className="text-sm font-bold">{companyData._count.collaboratorResponses}</p>
                    </div>
                </div>

            </div>
            <Button className="px-2 mt-2 sm:mt-0 w-full sm:w-auto"><SendIcon size={"17"} className="mr-1" /><span className="text-sm">Invite to Collab</span></Button>
        </div>
    )
}