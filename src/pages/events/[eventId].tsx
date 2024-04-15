import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import React from "react";
import EventLocationAndDate from "~/components/EventDetail/WhenAndWhere";
import OrganizerCard from "~/components/EventDetail/OrganizerCard";
import Image from "next/image";
import { SupportColumnPublicView } from "~/components/EventDetail/SupportColumnPublicView";
import { SupportColumnHostView } from "~/components/EventDetail/SupportColumnHostView";
import { api } from "~/utils/api";
import { format } from "date-fns";

const EventDetails: React.FC = () => {
  const router = useRouter();
  const { eventId } = router.query; // Access the dynamic segment

  const {
    data: eventData,
    isLoading,
    error,
  } = api.events.getEventById.useQuery(eventId as string, {
    enabled: !!eventId,
  });

  if (!eventData || !eventId) return null;
  const formattedDate = format(eventData?.eventDate, "MMMM do, yyyy");

  const eventCompanyId = eventData?.requesterId;

  console.log(eventData);

  return (
    <div>
      <Navbar />
      <div className="px-3 py-3">
        <Image
          src={eventData.image}
          alt="Event"
          className="h-[500px] w-full rounded object-cover"
          width={1000}
          height={1000}
        />

        <div className="flex min-h-full flex-col py-3">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-start gap-x-3">
            <main className="bg-black-200 flex-grow">
              <h1 className="text-4xl font-extrabold">{eventData.title}</h1>
              <p className="pt-1 text-sm text-muted-foreground">
                {eventData.description}
              </p>
              <h2 className="mt-2 scroll-m-20 text-xl font-bold tracking-tight">
                When and where
              </h2>
              <EventLocationAndDate
                eventDate={formattedDate}
                eventLocation={eventData.eventLocation}
              />
              <h2 className="mt-2 scroll-m-20 text-xl font-bold tracking-tight">
                Organized by
              </h2>
              <OrganizerCard eventDetails={eventData} />
            </main>
            <div className="sticky mt-2 w-full xl:mt-0 xl:block xl:w-96">
              <h2 className="scroll-m-20 text-xl font-bold tracking-tight">
                Support needed
              </h2>
              <SupportColumnPublicView eventDetails={eventData} />
              <SupportColumnHostView eventDetails={eventData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
