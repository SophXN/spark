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
import EmptyState from "~/components/EmptyState";
import { Skeleton } from "~/components/ui/skeleton";

interface Props {
  logo: string;
}

const HomePage: React.FC<Props> = () => {
  const { data: sessionData, status } = useSession();
  console.log(sessionData);
  const router = useRouter();
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingFutureEventData, setLoadingFutureEventData] = useState(true);
  const [loadingYourEventData, setLoadingYourEventData] = useState(true);
  useManageCompanyAndLocations(
    sessionData?.user.companyId!,
    sessionData?.user.id!,
    { enabled: !!sessionData },
  );

  const [homePageEventData, yourEventsData] = api.useQueries((t) => [
    t.events.getHomePageEvents("", { enabled: !!sessionData }),
    t.events.getYourEvents(sessionData?.user.companyId!, {
      enabled: !!sessionData,
    }),
  ]);

  React.useEffect(() => {
    if (status !== "authenticated" && status !== "loading") {
      void router.push("/login");
    }

    if (!homePageEventData.isLoading && homePageEventData.data) {
      // stop page loading
      setLoadingFutureEventData(false);
    }

    if (!yourEventsData.isLoading && yourEventsData.data) {
      // stop page loading
      setLoadingYourEventData(false);
    }
  }, [sessionData, router, status, homePageEventData, yourEventsData]);

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
        <div className="mx-auto max-w-7xl px-3 pb-3">
          <div className="my-2 flex flex-row justify-between">
            <div className="text-2xl font-semibold">Your Events</div>
            <Button
              onClick={() => handleCreateEventClick()}
              size="sm"
              className="p-2"
            >
              <StarFilledIcon className="mr-1"></StarFilledIcon>Create Event
            </Button>
          </div>
          {loadingYourEventData ? (
              <div className="flex w-full gap-2">
                <Skeleton className="h-[400px] w-1/3 rounded-md" />
                <Skeleton className="h-[400px] w-1/3 rounded-md" />
                <Skeleton className="h-[400px] w-1/3 rounded-md" />
              </div>
            ) : (
              <div className="flex hide-scrollbar w-full max-w-7xl overflow-x-auto whitespace-nowrap">
                {(yourEventsData.data ?? []).length > 0 ? (
                  <div>
                    {(yourEventsData.data ?? []).map((event) => (
                      <div
                        key={event.eventId}
                        onClick={() => handleEventClick(event.eventId)}
                        className="inline-block mr-3 w-[400px]"
                      >
                        <EventCard
                          key={event.eventId}
                          eventDetails={event as unknown as HomePageResponse}
                          yourEvent={true}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="You are not hosting any events." 
                    description="Try creating one above."/>
                )}
              </div>
            )}
          <div className="my-2 flex flex-row justify-between">
            <div className="text-2xl font-semibold">Future Events</div>
          </div>
          {loadingFutureEventData ? (
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
              {(homePageEventData.data ?? []).map((event) => (
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
