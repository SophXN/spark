import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { type HomePageResponse } from "~/types/types";

interface EventCardProps {
  eventDetails: HomePageResponse;
}

export function EventCard({ eventDetails }: EventCardProps) {
  const formattedDate = format(eventDetails?.eventDate, "MMMM do, yyyy");
  let collaboratorsExist = false;
  let sponsorsExists = false;
  let totalCollaboratorsNeeded = 0;
  let collaboratorSpacesLeft = 0;
  const totalSponsorsNeeded = 0;
  const sponsorSpacesLeft = 0;
  const acceptedCollaboratorResponsesCount =
    eventDetails._count.collaboratorsResponses ?? 0;

  if (eventDetails.collaborators.length > 0) {
    collaboratorsExist = true;
    totalCollaboratorsNeeded = eventDetails.collaborators?.reduce(
      (acc, collaborator) => {
        return acc + collaborator.collaboratorsRequired;
      },
      0,
    );
    collaboratorSpacesLeft =
      totalCollaboratorsNeeded - acceptedCollaboratorResponsesCount;
  }

  // TODO: replace sponsor count below with sponsors that have actually paid, bottom calculation currently
  // doesn't make sense

  if (eventDetails.sponsors.length > 0) {
    sponsorsExists = true;
  }

  return (
    <Card className="col-span-1 flex flex-col">
      <CardContent className="px-3 py-3">
        <Image
          src={
            eventDetails.image
          }
          alt="Event"
          className="h-[200px] w-full rounded object-cover"
          width={500}
          height={500}
        />
        <div className="py-2">
          {sponsorsExists ? (
            <Badge className="mr-1" variant="secondary">
              Sponsor spots · {sponsorSpacesLeft}
            </Badge>
          ) : (
            <div />
          )}
          {collaboratorsExist ? (
            <Badge variant="secondary">
              Collab spots · {collaboratorSpacesLeft}
            </Badge>
          ) : (
            <div />
          )}
        </div>
        <CardTitle>{eventDetails.title}</CardTitle>
        <CardDescription className="py-1 text-orange-400">
          {formattedDate}
        </CardDescription>
        <CardDescription>{eventDetails.eventLocation}</CardDescription>
        <div className="relative flex items-center space-x-1 pt-2">
          <div className="flex-shrink-0">
            <Image
              className="h-5 w-5 rounded-full"
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Business Logo"
              width="100"
              height="100"
            />
          </div>
          <div className="min-w-0 flex-1">
            <a href="#" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">
                {eventDetails.requester.name}
              </p>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
