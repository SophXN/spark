import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { type HomePageResponse } from "~/types/types";

interface EventCardProps {
  eventDetails: HomePageResponse;
  yourEvent?: boolean;
}

export function EventCard({ eventDetails, yourEvent = false }: EventCardProps) {
  const formattedDate = format(eventDetails?.eventDate, "MMMM do, yyyy");
  let collaboratorsExist = false;
  let sponsorsExists = false;
  let totalCollaboratorsNeeded = 0;
  let collaboratorSpacesLeft = 0;
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
    <Card className="col-span-1 flex cursor-pointer flex-col transition duration-150 ease-out hover:drop-shadow-md hover:ease-in">
      <CardContent className="px-3 py-3">
        <Image
          src={eventDetails.image}
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
        {yourEvent ? (
          <div></div>
        ) : (
          <div className="relative flex flex-row items-center gap-1 pt-2">
            <div>
              {eventDetails.requester.profilePicture ? (
                <div>
                  <Image
                    className="h-5 w-5 rounded-full object-cover"
                    src={eventDetails.requester.profilePicture}
                    alt="Business Logo"
                    width="100"
                    height="100"
                    layout="fixed"
                  />
                </div>
              ) : (
                <div className="h-5 w-5">
                  <span className="inline-block h-5 w-5 overflow-hidden rounded-full bg-gray-100">
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {eventDetails.requester.name}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
