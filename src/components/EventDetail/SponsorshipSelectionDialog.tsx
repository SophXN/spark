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
import { PaymentLink } from "@prisma/client";

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
  const paymentLinkArray: Array<PaymentLink[]> = [];
  const [merchantId, setSquareMerchantId] = useState(eventDetails.requester.squareMerchantId)

  eventDetails.sponsors.forEach((sponsor) => {
    paymentLinkArray.push(sponsor.paymentLinks);
  });

  const testPaymentHandler = () => {

    const paymentLinks: PaymentLink[] = paymentLinkArray.flat();
    const paymentLinkInfo = paymentLinks.filter((pl) => pl.sponsorId === selectedSponsorId)[0];
    if(!paymentLinkInfo) { return }

    const paymentLink = paymentLinkInfo.paymentLink;
    const paymentLinkOrderId = paymentLinkInfo?.squareOrderId;

    if (
      !selectedSponsorId ||
      !sessionData?.user.id ||
      !merchantId ||
      !paymentLink ||
      !paymentLinkOrderId
    ) {
      return;
    }

    console.log(paymentLinkInfo, " <= selected a sponsor option")
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
      <DialogContent className="w-full sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Become a sponsor</DialogTitle>
          <DialogDescription>
            Select a tier you would like to sponsor.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {eventDetails.sponsors.map((sponsor) => {
            return (
              <div key={sponsor.id}>
                <div
                  className={`relative flex items-center space-x-2 
                    rounded-lg bg-slate-100 px-6 py-3 border-2 cursor-pointer hover:bg-slate-200 
                      ${selectedSponsorId === sponsor.id ? "border-slate-900" : "border-white"}`}
                  onClick={() => setSelectedSponsorId(sponsor.id)}
                >
                  <div className="flex w-full flex-row items-center justify-between gap-5">
                    <div className="flex flex-col">
                      {getTierTitle(sponsor.tier)}
                      <p className="text-sm text-gray-500">
                        {sponsor.description}
                      </p>
                    </div>
                    <div className="flex flex-col text-end ">
                      <div>
                        ${sponsor.amountPerSponsor}
                      </div>
                      <div className="text-sm text-slate-500">
                        { sponsor.paymentLinks.length > 1 && <div>{sponsor.paymentLinks.length} spots left</div> }
                        { sponsor.paymentLinks.length == 1 && <div>{sponsor.paymentLinks.length} spot left</div> }
                        { sponsor.paymentLinks.length == 0 && <div>No spots left</div> }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
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
