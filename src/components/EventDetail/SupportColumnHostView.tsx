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
import { type HomePageEventDetails } from "~/types/types";
import { api } from "~/utils/api";

interface HostEventData {
  eventId: string;
  hostData: HomePageEventDetails;
}

export const SupportColumnHostView: React.FC<HostEventData> = ({
  hostData,
  eventId,
}) => {
  const router = useRouter();

  const manageCollaborators = () => {
    void router.push(`/manage/${eventId}`);
  };

  const { data: totalCollaborators } =
    api.collaborators.getTotalCollaborators.useQuery(eventId);

  const { data: collaborators } =
    api.collaborators.getCollaborators.useQuery(eventId);

  const totalCollaboratorsRemaining = collaborators
    ? collaborators?.reduce((acc, collaborator) => {
        return acc + collaborator.collaboratorsRequired;
      }, 0)
    : 0;

  return (
    <div>
      <Card className="mt-2">
        <CardHeader>
          <CardTitle className="mb-1 text-xl font-bold">Sponsors</CardTitle>
          <Progress
            className="h-1"
            value={hostData.percentageRaised}
          ></Progress>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm">Amount raised for event</p>
            <p className="text-sm font-bold">{hostData.totalAmountRaised}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">View Sponsors</Button>
        </CardFooter>
      </Card>
      <Card className="mt-2">
        <CardHeader>
          <CardTitle className="mb-1 text-xl font-bold">
            Collaborators
          </CardTitle>
          <Progress
            className="h-1"
            value={hostData.percentageCollaborators}
          ></Progress>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm">Total Collaborators</p>
            <p className="text-sm font-bold">
              {totalCollaboratorsRemaining}/{totalCollaborators}
            </p>
          </div>
          <div className="mt-2 flex flex-row items-center justify-between">
            <p className="text-sm">Total requests</p>
            <p className="text-sm font-bold">
              {hostData.totalCollaboratorRequests}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => manageCollaborators()} className="w-full">
            Manage Collaborators
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
