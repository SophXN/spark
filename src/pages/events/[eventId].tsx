import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
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
import { Skeleton } from "~/components/ui/skeleton";

const EventDetails: React.FC = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { eventId } = router.query; // Access the dynamic segment
  const [pageLoading, setLoadingPage] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    data: eventData,
    isLoading,
    error,
  } = api.events.getEventPageDetails.useQuery(eventId as string, {
    enabled: !!eventId,
  });

  console.log(eventData);

  React.useEffect(() => {
    if (status !== "authenticated" && status !== "loading") {
      void router.push("/login");
    }

    if (!isLoading && status !== "loading") {
      // stop page loading
      setLoadingPage(false);
    }
  }, [sessionData, router, status, isLoading]);

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
            className="h-[500px] w-full rounded object-cover"
            width={1000}
            height={1000}
          />
        </div>

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
              {sessionData?.user.companyId ===
              eventData.requester.squareMerchantId ? (
                <SupportColumnHostView
                  eventDetails={eventData as HomePageResponse}
                />
              ) : (
                <SupportColumnPublicView
                  eventDetails={eventData as HomePageResponse}
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
