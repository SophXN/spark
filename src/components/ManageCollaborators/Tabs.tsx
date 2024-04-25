import React from "react";
import { useState } from "react";
import { Requests } from "~/components/ManageCollaborators/Requests";
import {
  type CollaboratorResponseExtended,
  type EventRequestExtended,
} from "~/types/types";
import {
  type CollaboratorResponse,
  CollaboratorResponseStatus,
} from "@prisma/client";
import { AcceptedCollaborators } from "./AcceptedCollaborators";
import { DeniedCollaborators } from "./DeniedCollaborators";
import { api } from "~/utils/api";
import { Skeleton } from "../ui/skeleton";
import EmptyState from "../EmptyState";

const defaultTabs: Tab[] = [
  { name: "Requests", href: "#requests", current: true },
  { name: "Accepted", href: "#accepted", current: false },
  { name: "Denied", href: "#denied", current: false },
];

interface Tab {
  name: string;
  href: string;
  current: boolean;
}

function classNames(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}

interface TabsProps {
  eventId: string;
}

const Tabs: React.FC<TabsProps> = ({ eventId }) => {
  const [tabs, setTabs] = useState<Tab[]>(defaultTabs);
  const activeTab = tabs.find((tab) => tab.current)?.name;

  const collaboratorResponses: CollaboratorResponseExtended[] = [];

  let eventResponse = api.events.getEventCollaboratorResponses.useQuery(
    eventId as string, {enabled : !!eventId}
  )

  const eventData = eventResponse.data as EventRequestExtended[] ?? [];

  eventData.forEach((event) => {
    event.collaboratorsResponses.forEach((response) => {
      collaboratorResponses.push(response as CollaboratorResponseExtended);
    });
  });

  const handleTabClick = (clickedTab: Tab) => {
    if (tabs.find((tab) => tab.current)?.name === clickedTab.name) {
      // clicked the active tab
      return;
    }
    const updatedTabs = tabs.map((tab) =>
      tab.name === clickedTab.name
        ? { ...tab, current: true }
        : { ...tab, current: false },
    );
    //unselected we load the data from the new tab
    setTabs(updatedTabs);
  };

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="my-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-slate-500 sm:text-sm"
          defaultValue={tabs.find((tab) => tab.current)?.name ?? ""}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                onClick={() => handleTabClick(tab)}
                className={classNames(
                  tab.current
                    ? "border-slate-600 text-slate-700"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "mt-1 whitespace-nowrap border-b-2 py-2 text-sm font-medium",
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="mt-2">
        {
          eventResponse.isLoading ? (
            <div>
              <Skeleton className="mt-4 w-full h-[300px] rounded-md" />
              <Skeleton className="mt-4 w-full h-[300px] rounded-md" />
              <Skeleton className="mt-4 w-full h-[300px] rounded-md" />
            </div>
          ) : (

            <div>
              {
                collaboratorResponses.length > 0 ? (
                  <div>
                    {activeTab === "Requests" && (
                      <Requests
                        collaboratorResponses={collaboratorResponses.filter(
                          (item) => item.status === CollaboratorResponseStatus.PENDING,
                        )}
                      />
                    )}
                    {activeTab === "Accepted" && (
                      <AcceptedCollaborators
                        acceptedCollaborators={collaboratorResponses.filter(
                          (item) => item.status === CollaboratorResponseStatus.ACCEPTED,
                        )}
                      />
                    )}
                    {activeTab === "Denied" && (
                      <DeniedCollaborators
                        deniedCollaborators={collaboratorResponses.filter(
                          (item) => item.status === CollaboratorResponseStatus.DENIED,
                        )}
                      />
                    )}
                  </div>
                ) : (
                  <EmptyState title="No requests have been made yet." description="Try to "></EmptyState>
                )
              }
            </div>
          )
        }

      </div>
    </div>
  );
};

export default Tabs;
