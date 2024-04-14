import React from "react";
import { EventCard } from "~/components/EventCard";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import { type HomePageEventDetails } from "~/types/types";
import { Button } from "~/components/ui/button";
import { StarFilledIcon } from "@radix-ui/react-icons";

interface Props {
  logo: string;
}

const listOfEvents: HomePageEventDetails[] = [
  {
    eventId: "1",
    organizerId: "1982931",
    organizerCompanyName: "Landon Co",
    eventTitle: "Best event of the year",
    eventDescription: "Some description of the event",
    location: "324 Berkin st",
    eventDate: "20th March 2024",
    isHost: true,
    totalSponsorsRemaining: 5,
    totalCollaboratorsRemain: 3,
  },
  {
    eventId: "2",
    organizerId: "1982931",
    organizerCompanyName: "Landon Co",
    eventTitle: "Best event of the year",
    eventDescription: "Some description of the event",
    location: "324 Berkin st",
    eventDate: "20th March 2024",
    isHost: false,
    totalSponsorsRemaining: 3,
    totalCollaboratorsRemain: 3,
  },
  {
    eventId: "3",
    organizerId: "1982931",
    organizerCompanyName: "Landon Co",
    eventTitle: "Best event of the year",
    eventDescription: "Some description of the event",
    location: "324 Berkin st",
    eventDate: "20th March 2024",
    isHost: false,
    totalSponsorsRemaining: 6,
    totalCollaboratorsRemain: 3,
  },
  {
    eventId: "4",
    organizerId: "1982931",
    organizerCompanyName: "Landon Co",
    eventTitle: "Best event of the year",
    eventDescription: "Some description of the event",
    location: "324 Berkin st",
    eventDate: "20th March 2024",
    isHost: false,
    totalSponsorsRemaining: 2,
    totalCollaboratorsRemain: 3,
  },
];

const HomePage: React.FC<Props> = () => {
  const router = useRouter();

  const handleEventClick = (eventId: string) => {
    console.log(eventId);
    void router.push(`/events/${eventId}`);
  };

  const handleCreateEventClick = () => {
    void router.push(`/create-event`);
  }

  return (
    <div>
      <Navbar></Navbar>
      <main>
        <div className="mx-auto max-w-7xl px-3">
          <div className="flex flex-row justify-between my-2">
            <div className="text-2xl font-semibold">Events</div>
            <Button onClick={() => handleCreateEventClick()} size="sm" className="p-2"><StarFilledIcon className="mr-1" ></StarFilledIcon>Create Event</Button>
          </div>
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {listOfEvents.map((event) => (
              <div
                key={event.eventId}
                onClick={() => handleEventClick(event.eventId)}
              >
                <EventCard key={event.eventId} eventCardDetails={event} />
              </div>
            ))}
          </ul>
        </div>
      </main>
      <footer>{/* Your footer content goes here */}</footer>
    </div>
  );
};

export default HomePage;
