import React from "react";
import Image from "next/image";
import { EventCard } from "~/components/EventCard";
import { useRouter } from 'next/router';
import Navbar from '~/components/Navbar';
import { EventPageDetails } from "~/types/types";
import { ServiceType } from "@prisma/client";

interface Props {
  logo: string;
}

const listOfEvents: EventPageDetails[] =
  [
    { eventId: "1", collaboratorServiceTypesNeeded:[ServiceType.ART, ServiceType.DESIGN], organizerId: "1982931", organizerCompanyName: "Landon Co", eventTitle: "Best event of the year", eventDescription: "Some description of the event", location: "484 humboldt st", time: "20th March 2024", isHost: true, percentageRaised: 30, percentageCollaborators: 50},
    { eventId: "2", collaboratorServiceTypesNeeded:[ServiceType.FOOD, ServiceType.FOOD], organizerId: "1982931", organizerCompanyName: "Landon Co", eventTitle: "Best event of the year", eventDescription: "Some description of the event", location: "484 humboldt st", time: "20th March 2024", isHost: false, totalSponsorsRemaining: 3, totalSponsors: 10, totalCollaborators: 6, totalCollaboratorsRemain: 3},
    { eventId: "3", collaboratorServiceTypesNeeded:[ServiceType.MUSIC, ServiceType.FOOD], organizerId: "1982931", organizerCompanyName: "Landon Co", eventTitle: "Best event of the year", eventDescription: "Some description of the event", location: "484 humboldt st", time: "20th March 2024", isHost: false, totalSponsorsRemaining: 6, totalSponsors: 10, totalCollaborators: 6, totalCollaboratorsRemain: 3},
    { eventId: "4", collaboratorServiceTypesNeeded:[ServiceType.MUSIC, ServiceType.DESIGN], organizerId: "1982931", organizerCompanyName: "Landon Co", eventTitle: "Best event of the year", eventDescription: "Some description of the event", location: "484 humboldt st", time: "20th March 2024", isHost: false, totalSponsorsRemaining: 2, totalSponsors: 10, totalCollaborators: 6, totalCollaboratorsRemain: 3}, 
  ]

const HomePage: React.FC<Props> = () => {
  const router = useRouter();

  const handleEventClick = (eventId: string) => {
    // Potentially some logic here
    console.log(eventId)
    router.push(`/events/${eventId}`);
  };

  return (
    <div>
      <Navbar></Navbar>
      <main>
        <div className="mx-auto max-w-7xl px-3">
          <div className="my-2 text-2xl font-semibold">Events</div>
          <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {listOfEvents.map((event) =>
            <div onClick={() => handleEventClick(event.eventId)}>
              <EventCard
                key={event.eventId}
                eventCardDetails={event}
              />
              </div>
            )}
          </ul>
        </div>
      </main>
      <footer>{/* Your footer content goes here */}</footer>
    </div>
  );
};

export default HomePage;
