import { useRouter } from "next/router";
import React from "react";
import Navbar from "~/components/Navbar";
import { BreadcrumbManageCollaborators } from "~/components/ManageCollaborators/BreadcrumbManageCollaborators";
import Tabs from "~/components/ManageCollaborators/Tabs";
import {
  type RequestCardInfo,
  RequestStatus,
  type CollaboratorResponseExtended,
} from "~/types/types";
import { ServiceType } from "@prisma/client";
import { api } from "~/utils/api";

const ManageEvent: React.FC = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const { data: eventData } = api.events.getEventCollaboratorResponses.useQuery(
    eventId as string,
  );

  const { data: event } = api.events.getEventPageDetails.useQuery(eventId as string);

  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-5xl px-3">
        <div className="mt-3">
          <BreadcrumbManageCollaborators
            name={event ? event.title : "Your Event"}
            id={eventId as string}
          />
        </div>
        <div className="mt-2 text-3xl font-semibold">Manage Collaborators</div>
        {eventData ? (
          <Tabs
            eventData={eventData as unknown as CollaboratorResponseExtended}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ManageEvent;
