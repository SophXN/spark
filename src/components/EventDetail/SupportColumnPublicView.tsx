import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import RequestCollaborationDialog from "~/components/EventDetail/RequestCollaborationDialog";
import { HomePageResponse } from "~/types/types";

interface PublicEventData {
  eventDetails: HomePageResponse;
}

export const SupportColumnPublicView: React.FC<PublicEventData> = ({
  eventDetails,
}) => {

  let collaboratorsExist: boolean = false;
  let sponsorsExists: boolean = false;
  let totalCollaboratorsRequired: number = 0;
  let totalCollaboratorsRemaining: number = 0;
  let totalSponsorsNeeded: number = 0;
  let totalSponsors: number = 0;
  let sponsorSpacesLeft: number = 0;
  let totalSponsorsRemaining: number = 0;
  const countOfCollaboratorResponses = eventDetails.collaboratorsResponses?.length ?? 0;
  const acceptedCollaboratorResponsesCount = eventDetails.collaboratorsResponses?.reduce((acc, collaborator) => { return collaborator.status === "ACCEPTED" ? acc + 1 : acc }, 0) ?? 0

  if (eventDetails.collaborators.length > 0) {
    collaboratorsExist = true;
    totalCollaboratorsRequired = eventDetails.collaborators
      ? eventDetails.collaborators?.reduce((acc, collaborator) => {
        return acc + collaborator.collaboratorsRequired;
      }, 0)
      : 0;
    totalCollaboratorsRemaining = totalCollaboratorsRequired - acceptedCollaboratorResponsesCount;
  }

  // TODO: Logic for sponsors when people start paying for it after Square checkout API is complete

  if (eventDetails.sponsors.length > 0) {
    sponsorsExists = true;
    totalSponsorsNeeded = eventDetails.sponsors
      ? eventDetails.sponsors?.reduce((acc, sponsor) => {
        return acc + sponsor.sponsorsRequired;
      }, 0)
      : 0;
      totalSponsorsRemaining = totalSponsorsNeeded - 0;
  }

  return (
    <div>
      <Card className="mt-2">
        <CardHeader>
          <div className="flex flex-row justify-between space-y-0">
            <CardTitle className="text-xl font-bold">Sponsors</CardTitle>
            <CardTitle className="text-xl font-medium">
              {totalSponsorsRemaining}{" "}
              {totalSponsorsRemaining && totalSponsorsRemaining > 1
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
            <p className="text-sm font-bold">{totalSponsors ?? 0}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Become a sponsor</Button>
        </CardFooter>
      </Card>
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
            <p className="text-sm font-bold">{acceptedCollaboratorResponsesCount}</p>
          </div>
          <div className="mt-2 flex flex-row items-center justify-between">
            <p className="text-sm">Total Responses</p>
            <p className="text-sm font-bold">{countOfCollaboratorResponses}</p>
          </div>
        </CardContent>
        <CardFooter>
          <RequestCollaborationDialog eventDetails={eventDetails} />
        </CardFooter>
      </Card>
    </div>
  );
};
