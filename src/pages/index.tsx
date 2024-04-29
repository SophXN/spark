import React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { EventCard } from "~/components/Home/EventCard";
import { useRouter } from "next/router";
import Navbar from "~/components/Home/Navbar";
import { Button } from "~/components/ui/button";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { api } from "~/utils/api";
import { type HomePageResponse } from "~/types/types";
import useManageCompanyAndLocations from "~/hooks/useManageCompanyAndLocations";
import EmptyState from "~/components/EmptyState";
import { Skeleton } from "~/components/ui/skeleton";
import OnboardingStatus from "~/components/Home/onboardingChecklist";
import { type OnBoardingStepData, CurrentStep } from "~/types/types";
import { useRef } from "react";

interface Props {
  logo: string;
}

const HomePage: React.FC<Props> = () => {
  const { data: sessionData, status } = useSession();

  const renderCompanyCount = useRef(0);
  const renderYourEventsCount = useRef(0);
  const renderHomePageEventsCount = useRef(0);

  const router = useRouter();
  const [loadingFutureEventData, setLoadingFutureEventData] = useState(true);
  const [loadingYourEventData, setLoadingYourEventData] = useState(true);
  const [loadingOnboardingStatus, setLoadingOnboardingStatus] = useState(true);
  const [onBoardingSteps, setOnboardingSteps] = useState<OnBoardingStepData[]>([
    { index: 1, currentStep: CurrentStep.createAccount, completeStatus: true },
    {
      index: 2,
      currentStep: CurrentStep.addProfilePicture,
      completeStatus: false,
    },
    {
      index: 3,
      currentStep: CurrentStep.createFirstEvent,
      completeStatus: false,
      link: "/create-event",
    },
    {
      index: 4,
      currentStep: CurrentStep.collaborateOnEvent,
      completeStatus: false,
    },
    {
      index: 5,
      currentStep: CurrentStep.sponsorAnEvent,
      completeStatus: false,
    },
  ]);

  // checks if merchant exists in db or not 1st
  // if merchant exists then just return the merchant
  // if no merchant, fetch merchant locations via square
  // then add the merchant + locations to Spark db

  const { company } = useManageCompanyAndLocations(
    sessionData?.user.companyId ?? "",
    sessionData?.user.id ?? "",
    { enabled: !!sessionData && renderCompanyCount.current == 0 },
  );

  console.log("home page - company", company);

  // fetches  things on the condition that a company exists:
  // 1. all future events from other merchants
  // 2. Events you are throwing

  const [homePageEventData, yourEventsData] = api.useQueries((t) => [
    t.events.getHomePageEvents("", {
      enabled: !!company && renderHomePageEventsCount.current == 0,
    }),
    t.events.getYourEvents(company?.squareMerchantId ?? "", {
      enabled: !!company && renderYourEventsCount.current == 0,
    }),
  ]);

  React.useEffect(() => {
    if (status !== "authenticated" && status !== "loading") {
      void router.push("/login");
    }

    if (!homePageEventData.isLoading && homePageEventData.data) {
      // stop page loading
      renderCompanyCount.current += 1;
      setLoadingFutureEventData(false);
    }

    if (!yourEventsData.isLoading && yourEventsData.data) {
      // stop page loading
      renderYourEventsCount.current += 1;
      setLoadingYourEventData(false);
    }
  }, [sessionData, router, status, homePageEventData, yourEventsData]);

  React.useEffect(() => {
    if (company != null) {
      // updating setup checklist
      // console.log(company, "<= company")
      renderCompanyCount.current += 1;
      updateOnboardingSteps(
        CurrentStep.addProfilePicture,
        company.squareMerchantId,
      );

      if (company.profilePicture) {
        // profile picture exists
        updateOnboardingSteps(CurrentStep.addProfilePicture);
      }

      if (company._count.collaboratorResponses > 0) {
        // has collaborated on an event
        updateOnboardingSteps(CurrentStep.collaborateOnEvent);
      }

      if (company._count.eventRequests > 0) {
        // has created an event
        updateOnboardingSteps(CurrentStep.createFirstEvent);
      }

      if (company._count.payees > 0) {
        // has sponsored an event
        updateOnboardingSteps(CurrentStep.sponsorAnEvent);
      }

      setLoadingOnboardingStatus(false);
    }
  }, [company, loadingOnboardingStatus]);

  const updateOnboardingSteps = (
    currentStep: CurrentStep,
    companyId?: string,
  ) => {
    // set step to complete on front end
    if (companyId != null) {
      // add company id meta data to setup checklist
      setOnboardingSteps((steps) => {
        return steps.map((step) => {
          if (step.currentStep === currentStep) {
            return { ...step, companyId: companyId }; // Update the companyId
          }
          return step; // Return all other items unchanged
        });
      });
    } else {
      setOnboardingSteps((steps) => {
        return steps.map((step) => {
          if (step.currentStep === currentStep) {
            return { ...step, completeStatus: true }; // Update the completeStatus
          }
          return step; // Return all other items unchanged
        });
      });
    }
  };

  const handleEventClick = (eventId: string) => {
    void router.push(`/events/${eventId}`);
  };

  const handleCreateEventClick = () => {
    void router.push(`/create-event`);
  };

  return (
    <div>
      <Navbar />
      <main>
        <div className="my-4 flex w-full items-start gap-1 px-4 sm:justify-center">
          <div className="w-full sm:w-[1000px]">
            { sessionData ? (<OnboardingStatus data={onBoardingSteps} />) : (<div></div>) }
            
            <div className="my-3 flex flex-row justify-between">
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
                <Skeleton className="h-[400px] w-1/2 rounded-md" />
                <Skeleton className="h-[400px] w-1/2 rounded-md" />
              </div>
            ) : (
              <div className="pb-3 hide-scrollbar flex w-full max-w-[1000px] overflow-x-auto whitespace-nowrap">
                {(yourEventsData.data ?? []).length > 0 ? (
                  <div>
                    {(yourEventsData.data ?? []).map((event) => (
                      <div
                        key={event.eventId}
                        onClick={() => handleEventClick(event.eventId)}
                        className="mr-3 inline-block w-[400px]"
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
                    description="Try creating one above."
                  />
                )}
              </div>
            )}
            <div className="flex flex-row justify-between">
              <div className="text-2xl font-semibold">Future Events</div>
            </div>
            {loadingFutureEventData ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2">
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
                className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2"
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
        </div>
      </main>
    </div>
  );
};

export default HomePage;
