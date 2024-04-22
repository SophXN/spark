import React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { EventCard } from "~/components/EventCard";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import { Button } from "~/components/ui/button";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { api } from "~/utils/api";
import { type HomePageResponse } from "~/types/types";
import useManageCompanyAndLocations from "~/hooks/useManageCompanyAndLocations";
import { Session } from "next-auth";
import { Skeleton } from "~/components/ui/skeleton";

interface Props {
  logo: string;
}

const HomePage: React.FC<Props> = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [loadingPage, setLoadingPage] = useState(true);
  const { loading, error } = useManageCompanyAndLocations(sessionData?.user.companyId, sessionData?.user.id as string, { enabled: !!sessionData });

  const {
    data: eventData,
    isLoading,
  } = api.events.getHomePageEvents.useQuery();

  console.log(eventData);

  React.useEffect(() => {
    if (status !== "authenticated" && status !== "loading") {
      void router.push("/login");
    }

    if (!loading && !isLoading) {
      // stop page loading
      setLoadingPage(false);
    }

  }, [sessionData, router, status, loading, isLoading]);

  const handleEventClick = (eventId: string) => {
    console.log(eventId);
    void router.push(`/events/${eventId}`);
  };

  const handleCreateEventClick = () => {
    void router.push(`/create-event`);
  };

  return (
    <div>
      <Navbar />
      <main>
        <div className="mx-auto max-w-7xl px-3">
          <div className="my-2 flex flex-row justify-between">
            <div className="text-2xl font-semibold">Events</div>
            <Button
              onClick={() => handleCreateEventClick()}
              size="sm"
              className="p-2"
            >
              <StarFilledIcon className="mr-1"></StarFilledIcon>Create Event
            </Button>
          </div>
          {loadingPage ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-[400px] rounded-md" />
              <Skeleton className="h-[400px] rounded-md" />
              <Skeleton className="h-[400px] rounded-md" />
              <Skeleton className="h-[400px] rounded-md" />
              <Skeleton className="h-[400px] rounded-md" />
              <Skeleton className="h-[400px] rounded-md" />
            </div>
          ) : (
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {eventData?.map((event) => (
                <div
                  key={event.eventId}
                  onClick={() => handleEventClick(event.eventId)}
                >
                  <EventCard
                    key={event.eventId}
                    eventDetails={event as HomePageResponse}
                  />
                </div>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
