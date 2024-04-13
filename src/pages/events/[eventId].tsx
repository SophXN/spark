import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import React from "react";
import WhenAndWhere from "~/components/EventDetail/WhenAndWhere";
import OrganizerCard from "~/components/EventDetail/OrganizerCard";
import Image from "next/image";
import SupportColumnPublicView from "~/components/EventDetail/SupportColumnPublicView";
import SupportColumnHostView from "~/components/EventDetail/SupportColumnHostView";
import { type EventPageDetails } from "~/types/types";
import { ServiceType } from "@prisma/client";
import { api } from "~/utils/api";

const currentEvent: EventPageDetails = {
  eventId: "1",
  organizerId: "1982931",
  organizerCompanyName: "Landon Co",
  eventTitle: "Best event of the year",
  eventDescription: "Some description of the event",
  eventBannerImage:
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  location: "234 asdfjljk st",
  eventDate: "20th March 2024",
  isHost: true,
  percentageRaised: 30,
  percentageCollaborators: 50,
  totalSponsorsRemaining: 3,
  totalSponsors: 10,
  totalAmountRaised: 3000,
  totalCollaborators: 6,
  totalCollaboratorRequests: 12,
  totalCollaboratorsRemain: 3,
  collaboratorServiceTypesNeeded: [ServiceType.ART, ServiceType.DESIGN],
};

const EventDetails: React.FC = () => {
  const router = useRouter();
  const { eventId } = router.query; // Access the dynamic segment
  if (eventId === undefined) {
    return <div>Event not found</div>;
  } else {
    const { data } = api.events.getEventById.useQuery(eventId as string);
    console.log(data);
  }

  return (
    <div>
      <Navbar />
      <div className="px-3 py-3">
        <Image
          src={currentEvent.eventBannerImage!}
          alt="Event"
          className="h-[500px] w-full rounded object-cover"
          width={1000}
          height={1000}
        />

        <div className="flex min-h-full flex-col py-3">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-start gap-x-3">
            <main className="bg-black-200 flex-grow">
              <h1 className="text-4xl font-extrabold">
                {currentEvent.eventTitle}
              </h1>
              <p className="pt-1 text-sm text-muted-foreground">
                {currentEvent.eventDescription}
              </p>
              <h2 className="mt-2 scroll-m-20 text-xl font-bold tracking-tight">
                When and where
              </h2>
              <WhenAndWhere locationData={currentEvent} />
              <h2 className="mt-2 scroll-m-20 text-xl font-bold tracking-tight">
                Organized by
              </h2>
              <OrganizerCard organizerData={currentEvent} />
            </main>
            <div className="sticky mt-2 w-full xl:mt-0 xl:block xl:w-96">
              <h2 className="scroll-m-20 text-xl font-bold tracking-tight">
                Support needed
              </h2>
              {!currentEvent.isHost ? (
                <SupportColumnPublicView publicData={currentEvent} />
              ) : (
                <SupportColumnHostView hostData={currentEvent} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
