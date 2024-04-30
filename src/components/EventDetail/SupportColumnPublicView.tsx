import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import RequestCollaborationDialog from "./RequestCollaborationDialog";
import { type HomePageResponse, type SponsorsExtended } from "~/types/types";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import SponsorshipSelectionDialog from "./SponsorshipSelectionDialog";
import { PaymentLink } from "@prisma/client";

interface PublicEventData {
  eventDetails: HomePageResponse;
}

export const SupportColumnPublicView: React.FC<PublicEventData> = ({
  eventDetails,
}) => {
  // let collaboratorsExist = false;
  // let sponsorsExists = false;
  let totalCollaboratorsRequired = 0;
  let totalCollaboratorsRemaining = 0;
  let totalSponsorsNeeded = 0;
  let totalPaymentsCompleted = 0;
  let totalSponsorsLeft = 0;
  
  const collabResponses = eventDetails.collaboratorsResponses ?? []
  const collabs = eventDetails.collaborators ?? []
  const sponsors = eventDetails.sponsors ?? []

  let totalAmountLeftToRaise = 0;
  let totalAmountRaised = 0;
  let totalSponsorAmountNeeded = 0;

  if (!collabResponses || !collabs || !sponsors) return;

  const countOfCollaboratorResponses =
    collabResponses.length ?? 0;

  const acceptedCollaboratorResponsesCount =
    collabResponses.reduce((acc, collaborator) => {
      return collaborator.status === "ACCEPTED" ? acc + 1 : acc;
    }, 0) ?? 0;

  // payment link count where status is PENDING

  if (collabs.length > 0) {
    totalCollaboratorsRequired = collabs
      ? collabs.reduce((acc, collaborator) => {
        return acc + collaborator.collaboratorsRequired;
      }, 0)
      : 0;
    totalCollaboratorsRemaining =
      totalCollaboratorsRequired - acceptedCollaboratorResponsesCount;
  }

  // TODO: Logic for sponsors when people start paying for it after Square checkout API is complete

  if (sponsors.length > 0) {

    totalSponsorsNeeded = sponsors
      ? sponsors.reduce((acc, sponsor) => {
        return acc + sponsor.sponsorsRequired;
      }, 0)
      : 0;

    totalSponsorsLeft = sponsors.reduce((acc, sponsor) => {
      // add up all the sponsors left where payment link paid status is pending
      return acc + sponsor.paymentLinks.length
    }, 0);
    
    totalPaymentsCompleted = totalSponsorsNeeded - totalSponsorsLeft;
        
    totalSponsorAmountNeeded = sponsors.reduce((accumulator, sponsor) => {
      const product = sponsor.sponsorsRequired * sponsor.amountPerSponsor;
      return accumulator + product;
    }, 0);

    totalAmountLeftToRaise = sponsors.reduce((accumulator, sponsor) => {
      const product = sponsor.amountPerSponsor * sponsor.paymentLinks.length
      return accumulator + product;
    }, 0)

    totalAmountRaised = totalSponsorAmountNeeded - totalAmountLeftToRaise;

  }

  return (
    <div>
      <Card className="mt-2">
        <CardHeader>
          <div className="flex flex-row justify-between space-y-0">
            <CardTitle className="text-xl font-bold">Sponsors</CardTitle>
            <CardTitle className="text-xl font-medium">
              {totalSponsorsLeft}{" "}
              {totalSponsorsLeft && totalSponsorsLeft > 1
                ? "spots"
                : "spot"}{" "}
              left
            </CardTitle>
          </div>
          <p className="text-sm">
            Get your logo applied to all over our merch and on the store front.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm">Total sponsors</p>
            <p className="text-sm font-bold">{totalPaymentsCompleted ?? 0}</p>
          </div>
          <div className="flex flex-row items-center justify-between mt-2">
            <p className="text-sm">Total amount raised</p>
            <p className="text-sm font-bold">${totalAmountRaised ?? 0}/${totalSponsorAmountNeeded}</p>
          </div>
        </CardContent>
        <CardFooter>
          {totalSponsorsLeft > 0 ? (
            <SponsorshipSelectionDialog eventDetails={eventDetails} />
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={"outline"} className="w-full">
                    Become a sponsor
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sponsors are now full for this event</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardFooter>
      </Card>
      {totalCollaboratorsRequired > 0 ? (
        <Card className="mt-2">
          <CardHeader>
            <div className="flex flex-row justify-between space-y-0">
              <CardTitle className="text-xl font-bold">Collaborators</CardTitle>
              <CardTitle className="text-xl font-medium">
                {totalCollaboratorsRemaining} spots left
              </CardTitle>
            </div>
            <p className="text-sm">
              Offer your services at this event. Get exposure to your brand for
              free.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row items-center justify-between">
              <p className="text-sm">Total Collaborators</p>
              <p className="text-sm font-bold">
                {acceptedCollaboratorResponsesCount}
              </p>
            </div>
            <div className="mt-2 flex flex-row items-center justify-between">
              <p className="text-sm">Total Responses</p>
              <p className="text-sm font-bold">
                {countOfCollaboratorResponses}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            {totalCollaboratorsRemaining > 0 ? (
              <RequestCollaborationDialog eventDetails={eventDetails} />
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={"outline"} className="w-full">
                      Become a collaborator
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Collaborations are now full for this event</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardFooter>
        </Card>
      ) : (
        <div></div>
      )}
    </div>
  );
};
