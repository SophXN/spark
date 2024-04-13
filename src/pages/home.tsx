import React from "react";
import { EventCard } from "~/components/EventCard";
import { useRouter } from 'next/router';
import Navbar from '~/components/Navbar';
import { type HomePageEventDetails } from "~/types/types";

interface Props {
  logo: string;
}

const listOfEvents: HomePageEventDetails[] =
  [
    { eventId: "1", organizerId: "1982931", organizerCompanyName: "Landon Co", eventTitle: "Best event of the year", eventDescription: "Some description of the event", location: "484 humboldt st", eventDate: "20th March 2024", isHost: true, totalSponsorsRemaining: 5, totalCollaboratorsRemain: 3},
    { eventId: "2", organizerId: "1982931", organizerCompanyName: "Landon Co", eventTitle: "Best event of the year", eventDescription: "Some description of the event", location: "484 humboldt st", eventDate: "20th March 2024", isHost: false, totalSponsorsRemaining: 3, totalCollaboratorsRemain: 3},
    { eventId: "3", organizerId: "1982931", organizerCompanyName: "Landon Co", eventTitle: "Best event of the year", eventDescription: "Some description of the event", location: "484 humboldt st", eventDate: "20th March 2024", isHost: false, totalSponsorsRemaining: 6, totalCollaboratorsRemain: 3},
    { eventId: "4", organizerId: "1982931", organizerCompanyName: "Landon Co", eventTitle: "Best event of the year", eventDescription: "Some description of the event", location: "484 humboldt st", eventDate: "20th March 2024", isHost: false, totalSponsorsRemaining: 2, totalCollaboratorsRemain: 3}, 
  ]

const HomePage: React.FC<Props> = () => {
  const router = useRouter();

  const handleEventClick = async (eventId: string) => {
    console.log(eventId)
    await router.push(`/events/${eventId}`);
  };

  return (
    <div>
      <Navbar></Navbar>
      <main>
        <div className="mx-auto max-w-7xl px-3">
          <div className="my-2 text-2xl font-semibold">Events</div>
          <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {listOfEvents.map((event) =>
            <div key={event.eventId} onClick={() => handleEventClick(event.eventId)}>
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
