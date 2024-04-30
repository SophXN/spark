import { useRouter } from "next/router";
import Navbar from "~/components/Home/Navbar";
import React from "react";
import { useState } from "react";
import EventLocationAndDate from "~/components/EventDetail/WhenAndWhere";
import OrganizerCard from "~/components/EventDetail/OrganizerCard";
import Image from "next/image";
import { SupportColumnPublicView } from "~/components/EventDetail/SupportColumnPublicView";
import { SupportColumnHostView } from "~/components/EventDetail/SupportColumnHostView";
import { api } from "~/utils/api";
import { format } from "date-fns";
import { type HomePageResponse } from "~/types/types";
import { useSession } from "next-auth/react";

const EventDetails: React.FC = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { eventId } = router.query; // Access the dynamic segment
  const [pageLoading, setLoadingPage] = useState(true);
  const [id, setId] = useState(eventId);
  const [eventData, setEventData] = useState<HomePageResponse>();

  console.log(eventId, sessionData, eventData);

  const {
    data: responseData,
    isLoading,
  } = api.events.getEventPageDetails.useQuery(eventId as string, {
    enabled: !!eventId && (eventData == null),
  });

  React.useEffect(() => {
    if (status !== "authenticated" && status !== "loading") {
      void router.push("/login");
    }

    if (!isLoading && status !== "loading") {
      // stop page loading
      setEventData(responseData as HomePageResponse);
      setLoadingPage(false);
    }
  }, [sessionData, router, status, isLoading, id]);

  if (!eventData) {
    return;
  }

  const formattedDate = eventData
    ? format(eventData?.eventDate, "MMMM do, yyyy")
    : "no date found";

  return (
    <div>
      <Navbar />
      <div className="px-3 py-3">
        <div className="flex w-full justify-center">
          <Image
            src={eventData.image}
            alt="Event"
            className="h-[300px] sm:h-[500px] w-full rounded object-cover"
            width={1000}
            height={1000}
          />
        </div>

        <div className="flex min-h-full flex-col py-3">
          <div className="mx-auto flex flex-row flex-wrap w-full max-w-7xl items-start gap-x-3">
            <main className="bg-black-200 flex-shrink flex-1">
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
            <div className="sticky mt-2 w-full flex-none lg:mt-0 lg:block lg:w-96">
              <h2 className="scroll-m-20 text-xl font-bold tracking-tight">
                Support needed
              </h2>
              {sessionData?.user.companyId ===
              eventData.requester.squareMerchantId ? (
                <SupportColumnHostView
                  eventDetails={eventData}
                />
              ) : (
                <SupportColumnPublicView
                  eventDetails={eventData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
