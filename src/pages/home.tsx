import React from "react";
import { useState, useEffect } from "react";
import { EventCard } from "~/components/EventCard";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import { Button } from "~/components/ui/button";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { api } from "~/utils/api";

interface Props {
  logo: string;
}

const HomePage: React.FC<Props> = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEventClick = (eventId: string) => {
    console.log(eventId);
    void router.push(`/events/${eventId}`);
  };

  const handleCreateEventClick = () => {
    void router.push(`/create-event`);
  }

  const { data: eventData, isLoading, error } = api.events.getHomePageEvents.useQuery();

  if (!eventData) return <div/>;

  return (
    <div>
      <Navbar></Navbar>
      <main>
        <div className="mx-auto max-w-7xl px-3">
          <div className="flex flex-row justify-between my-2">
            <div className="text-2xl font-semibold">Events</div>
            <Button onClick={() => handleCreateEventClick()} size="sm" className="p-2"><StarFilledIcon className="mr-1" ></StarFilledIcon>Create Event</Button>
          </div>
          {isLoading ? <p>Loading...</p> :
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {eventData?.map((event) => (
                <div
                  key={event.eventId}
                  onClick={() => handleEventClick(event.eventId)}
                >
                  <EventCard key={event.eventId} eventDetails={event} />
                </div>
              ))}
            </ul>
          }
        </div>
      </main>
    </div>
  );
};

export default HomePage;
