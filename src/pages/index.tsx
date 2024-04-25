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

  // const yourEventsData = { data: [] };
  // const homePageEventData = { data: [] };

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
        <div className="mx-auto max-w-7xl px-3">
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
          <div className="hide-scrollbar w-full max-w-7xl overflow-x-auto whitespace-nowrap">
            {loadingYourEventData ? (
              <div className="flex gap-2">
                <Skeleton className="h-[400px] w-1/3 rounded-md" />
                <Skeleton className="h-[400px] w-1/3 rounded-md" />
                <Skeleton className="h-[400px] w-1/3 rounded-md" />
              </div>
            ) : (
              <div className="flex">
                {(yourEventsData.data ?? []).length > 0 ? (
                  <div className="w-1/3">
                    {(yourEventsData.data ?? []).map((event) => (
                      <div
                        key={event.eventId}
                        onClick={() => handleEventClick(event.eventId)}
                        className="inline-block mr-3"
                      >
                        <EventCard
                          key={event.eventId}
                          eventDetails={event as unknown as HomePageResponse}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 w-full h-[400px]">
                    <div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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
              {homePageEventData.data?.map((event) => (
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
