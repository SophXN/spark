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
import { api } from "~/utils/api";
import { EventRequest } from "@prisma/client";

interface HostEventData {
  eventDetails: EventRequest;
}

export const SupportColumnHostView: React.FC<HostEventData> = ({ eventDetails }) => {
  const router = useRouter();

  const manageCollaborators = () => {
    void router.push(`/manage/${eventDetails.eventId}`);
  };

  const { data: totalApprovedCollaborators } =
    api.collaboratorResponse.getCountOfApprovedCollaboratorResponses.useQuery(
      eventDetails.eventId,
    );

  const { data: countOfCollaboratorResponses } =
    api.collaboratorResponse.getCountOfCollaboratorResponses.useQuery(eventDetails.eventId);


  const totalCollaboratorsRemaining = eventDetails.collaborators
    ? eventDetails.collaborators?.reduce((acc, collaborator) => {
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
            value={50} // temporary value
          ></Progress>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm">Amount raised for event</p>
            <p className="text-sm font-bold">{1000}</p>
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
            value={
              ((totalApprovedCollaborators ?? 0) /
                totalCollaboratorsRemaining) *
              100
            }
          ></Progress>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm">Total Collaborators</p>
            <p className="text-sm font-bold">
              {totalApprovedCollaborators ?? 0}/{totalCollaboratorsRemaining}
            </p>
          </div>
          <div className="mt-2 flex flex-row items-center justify-between">
            <p className="text-sm">Total requests</p>
            <p className="text-sm font-bold">{countOfCollaboratorResponses}</p>
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
