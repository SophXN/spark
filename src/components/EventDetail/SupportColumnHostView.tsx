import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "../ui/progress";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/router";
import { type HomePageResponse } from "~/types/types";
import { api } from "~/utils/api";

interface HostEventData {
  eventDetails: HomePageResponse;
}

export const SupportColumnHostView: React.FC<HostEventData> = ({
  eventDetails,
}) => {
  const router = useRouter();

  let collaboratorsExist = false;
  let sponsorsExists = false;
  let totalCollaboratorsRequired = 0;
  let totalCollaboratorsRemaining = 0;
  let totalSponsorAmountNeeded = 0;

  const collabResponses = eventDetails.collaboratorsResponses;
  const collaborators = eventDetails.collaborators;
  const sponsors = eventDetails.sponsors;
  
  let totalAmountLeftToRaise = 0;
  let totalAmountRaised = 0;
  let percentageRaised = 0;
  
    const countOfCollaboratorResponses =
    collabResponses.length ?? 0;
  const acceptedCollaboratorResponsesCount =
  collabResponses.reduce((acc, collaborator) => {
      return collaborator.status === "ACCEPTED" ? acc + 1 : acc;
    }, 0) ?? 0;

  if (eventDetails.collaborators.length > 0) {
    collaboratorsExist = true;
    totalCollaboratorsRequired = collaborators
      ? collaborators.reduce((acc, collaborator) => {
          return acc + collaborator.collaboratorsRequired;
        }, 0)
      : 0;
    totalCollaboratorsRemaining =
      totalCollaboratorsRequired - acceptedCollaboratorResponsesCount;
  }

  // TODO: Logic for sponsors when people start paying for it after Square checkout API is complete

  if (sponsors.length > 0) {
    sponsorsExists = true;
    
    totalSponsorAmountNeeded = sponsors.reduce((accumulator, sponsor) => {
      const product = sponsor.sponsorsRequired * sponsor.amountPerSponsor;
      return accumulator + product;
    }, 0);

    totalAmountLeftToRaise = sponsors.reduce((accumulator, sponsor) => {
      const product = sponsor.amountPerSponsor * sponsor.paymentLinks.length
      return accumulator + product;
    }, 0)

    totalAmountRaised = totalSponsorAmountNeeded - totalAmountLeftToRaise;
    percentageRaised = (totalAmountRaised / totalSponsorAmountNeeded) * 100;
  }

  const manageCollaborators = () => {
    void router.push(`/manage/${eventDetails.eventId}`);
  };

  return (
    <div>
      {sponsorsExists ? (
        <Card className="mt-2">
          <CardHeader>
            <CardTitle className="mb-1 text-xl font-bold">Sponsors</CardTitle>
            <Progress
              className="h-1"
              value={percentageRaised} // temporary value
            ></Progress>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row items-center justify-between">
              <p className="text-sm">Amount raised for event</p>
              <p className="text-sm font-bold">${totalAmountRaised}/${totalSponsorAmountNeeded}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">View Sponsors</Button>
          </CardFooter>
        </Card>
      ) : (
        <div />
      )}
      {collaboratorsExist ? (
        <Card className="mt-2">
          <CardHeader>
            <CardTitle className="mb-1 text-xl font-bold">
              Collaborators
            </CardTitle>
            <Progress
              className="h-1"
              value={
                ((acceptedCollaboratorResponsesCount ?? 0) /
                  totalCollaboratorsRemaining) *
                100
              }
            ></Progress>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row items-center justify-between">
              <p className="text-sm">Total Collaborators</p>
              <p className="text-sm font-bold">
                {acceptedCollaboratorResponsesCount ?? 0}/
                {totalCollaboratorsRequired}
              </p>
            </div>
            <div className="mt-2 flex flex-row items-center justify-between">
              <p className="text-sm">Total responses</p>
              <p className="text-sm font-bold">
                {countOfCollaboratorResponses}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => manageCollaborators()} className="w-full">
              Manage Collaborators
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div />
      )}
    </div>
  );
};
