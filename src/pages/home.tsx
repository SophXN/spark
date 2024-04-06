import React from "react";
import Image from "next/image";
import { EventCard } from "~/components/EventCard";
import { useRouter } from 'next/router';
import Navbar from '~/components/Navbar';

interface Props {
  logo: string;
}

interface SquareEvent {
  id: string; // Assuming id is a string, adjust type as necessary
  image: string;
}

interface EventsListProps {
  events: SquareEvent[];
}

const listOfEvents: EventsListProps = {
  events: [
    { id: "1", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: "2", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: "3", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: "4", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: "5", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ]
}

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
            {listOfEvents.events.map((event) =>
            <div onClick={() => handleEventClick(event.id)}>
              <EventCard
                key={event.id}
                image={
                  event.image
                }
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
