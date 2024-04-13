import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import RequestCollaborationDialog from "~/components/EventDetail/RequestCollaborationDialog";
import { type HomePageEventDetails } from "~/types/types";
import { api } from "~/utils/api";

interface PublicEventData {
  eventId: string;
  publicData: HomePageEventDetails;
}
const SupportColumnPublicView: React.FC<PublicEventData> = ({
  publicData,
  eventId,
}) => {
  const { data: totalSponsors } =
    api.sponsors.getTotalSponsors.useQuery(eventId);
  const { data: sponsors } = api.sponsors.getSponsors.useQuery(eventId);

  if (!sponsors || !totalSponsors) return null;
  const totalSponsorsRemaining =
    sponsors?.reduce((acc, sponsor) => {
      return acc + sponsor.sponsorsRequired;
    }, 0) - totalSponsors;
  console.log(totalSponsorsRemaining);

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
              {publicData.totalCollaboratorsRemain} spots left
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
            <p className="text-sm font-bold">{publicData.totalCollaborators}</p>
          </div>
        </CardContent>
        <CardFooter>
          <RequestCollaborationDialog></RequestCollaborationDialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SupportColumnPublicView;
