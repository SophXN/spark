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

  const totalSponsors = eventDetails._count.sponsors;
  const totalCollaborators = eventDetails._count.collaborators;
  const sponsors = eventDetails.sponsors;
  const collaborators = eventDetails.collaborators;

  // TODO: check for sponsors + collab and render based on that
  //   if (!sponsors || !totalSponsors || !totalCollaborators || !collaborators)
  //     return null;

  // TODO: need to count the total number of sponsors and collaborators and subtract from the total required
  const totalSponsorsRemaining = sponsors?.reduce((acc, sponsor) => {
    return acc + sponsor.sponsorsRequired;
  }, 0);

  const totalCollaboratorsRemaining = collaborators?.reduce(
    (acc, collaborator) => {
      return acc + collaborator.collaboratorsRequired;
    },
    0,
  );

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
            <p className="text-sm font-bold">{totalCollaborators}</p>
          </div>
        </CardContent>
        <CardFooter>
          <RequestCollaborationDialog eventDetails={eventDetails} />
        </CardFooter>
      </Card>
    </div>
  );
};
