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
  let totalSponsorSpotsLeft = 0;
  const acceptedCollaboratorResponsesCount =
    eventDetails._count.collaboratorsResponses ?? 0;
  const collaborators = eventDetails.collaborators;
  const sponsors = eventDetails.sponsors;

  let totalSponsorAmountNeeded = 0;
  let totalAmountLeftToRaise = 0;
  let totalAmountRaised = 0;

  if (collaborators.length > 0) {
    collaboratorsExist = true;
    totalCollaboratorsNeeded = collaborators.reduce(
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

  if (sponsors.length > 0) {
    sponsorsExists = true;

    totalSponsorSpotsLeft = sponsors.reduce((accumulator, sponsor) => {
      return accumulator + sponsor.paymentLinks.length
    }, 0)

    totalSponsorAmountNeeded = sponsors.reduce((accumulator, sponsor) => {
      const product = sponsor.sponsorsRequired * sponsor.amountPerSponsor;
      return accumulator + product;
    }, 0);

    totalAmountLeftToRaise = sponsors.reduce((accumulator, sponsor) => {
      if (!sponsor.paymentLinks) return accumulator;
      const product = sponsor.amountPerSponsor * sponsor.paymentLinks.length
      return accumulator + product;
    }, 0)

    totalAmountRaised = totalSponsorAmountNeeded - totalAmountLeftToRaise;
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
        <div className="mt-2">
          {sponsorsExists ? (
            <div className="flex flex-row flex-wrap gap-1">
              <Badge variant="secondary">
                Amount raised · ${totalAmountRaised}
              </Badge>
              <Badge variant="secondary">
                {totalSponsorSpotsLeft > 0 && (`Sponsors needed · ${totalSponsorSpotsLeft} more`)}
                {totalSponsorSpotsLeft == 0 && ("Sponsors filled")}
              </Badge>
            </div>
          ) : (
            <div />
          )}
          {collaboratorsExist ? (
            <Badge variant="secondary">
              Collabs needed · {collaboratorSpacesLeft} more
              {collaboratorSpacesLeft > 0 && (`Collabs needed · ${collaboratorSpacesLeft} more`)}
              {collaboratorSpacesLeft == 0 && ("Collabs filled")}
            </Badge>
          ) : (
            <div />
          )}
        </div>
        <CardTitle className="mt-2">{eventDetails.title}</CardTitle>
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
                    className="h-5 w-5 object-cover rounded-full"
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
