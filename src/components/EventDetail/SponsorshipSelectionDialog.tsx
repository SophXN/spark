import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { type HomePageResponse } from "~/types/types";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import router from "next/router";

interface PublicEventData {
  eventDetails: HomePageResponse;
}

export default function SponsorshipSelectionDialog({
  eventDetails,
}: PublicEventData) {
  const [open, setOpen] = useState(false);
  const [selectedSponsorId, setSelectedSponsorId] = useState("");
  const { data: sessionData } = useSession();
  const companyId = sessionData?.user.companyId ?? "";
  const sponsorMutation = api.sponsors.addCompanyAsSponsor.useMutation();

  const paymentLinkInfo = api.sponsors.getSponsor
    .useQuery(selectedSponsorId)
    .data?.paymentLinks.filter((ea) => ea.paymentStatus === "PENDING")[0];
  const paymentLink = paymentLinkInfo?.paymentLink;
  const paymentLinkOrderId = paymentLinkInfo?.squareOrderId;

  const testPaymentHandler = () => {
    if (
      !selectedSponsorId ||
      !sessionData?.user.id ||
      !eventDetails.requester.squareMerchantId ||
      !paymentLink ||
      !paymentLinkOrderId
    ) {
      return;
    }

    sponsorMutation.mutate({
      userId: sessionData?.user.id,
      companyId: companyId,
      sponsorId: selectedSponsorId,
      paymentLinkOrderId: paymentLinkOrderId,
    });
    void router.push(paymentLink);
  };

  const getTierTitle = (tier: string) => {
    switch (tier) {
      case "ONE":
        return "Gold Tier";
      case "TWO":
        return "Silver Tier";
      case "THREE":
        return "Bronze Tier";
      default:
        return "Platinum Tier";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Become a sponsor</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Become a sponsor</DialogTitle>
          <DialogDescription>
            Select a tier you would like to sponsor.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          {eventDetails.sponsors.map((sponsor) => {
            return (
              <div key={sponsor.id}>
                <div
                  className={`relative mt-2 flex items-center space-x-2 rounded-lg bg-slate-100 px-6 py-3 
                    ${selectedSponsorId === sponsor.id ? "border-2 border-blue-500" : ""} cursor-pointer hover:bg-slate-200`}
                  onClick={() => setSelectedSponsorId(sponsor.id)}
                >
                  <div className="flex w-full flex-row items-center justify-between">
                    <div className="flex flex-col">
                      {getTierTitle(sponsor.tier)}
                      <p className="truncate text-sm text-gray-500">
                        {sponsor.description}
                      </p>
                    </div>
                    ${sponsor.amountPerSponsor}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="mt-2">
          <Button
            onClick={testPaymentHandler}
            disabled={selectedSponsorId === ""}
          >
            Go to payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
