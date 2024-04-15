import { useRouter } from "next/router";
import React from "react";
import Navbar from "~/components/Navbar";
import { BreadcrumbManageCollaborators } from "~/components/ManageCollaborators/BreadcrumbManageCollaborators";
import Tabs from "~/components/ManageCollaborators/Tabs";
import { type RequestCardInfo, RequestStatus } from "~/types/types";
import { CollaboratorResponse, ServiceType } from "@prisma/client";
import { api } from "~/utils/api";

const requests: RequestCardInfo[] = [
  {
    organizerAddress: "3294 Berkin st",
    organizerName: "Landon Co",
    helpingCategory: ServiceType.FOOD,
    message:
      "A lovely message from the collaborator about how much they want to help",
    requestId: "123123",
    status: RequestStatus.denied,
  },
  {
    organizerAddress: "499 francis grove",
    organizerName: "Landon Co",
    helpingCategory: ServiceType.ART,
    message:
      "A lovely message from the collaborator about how much they want to help",
    requestId: "123653",
    status: RequestStatus.pending,
  },
  {
    organizerAddress: "CTown markets",
    organizerName: "Landon Co",
    helpingCategory: ServiceType.SPACE,
    message:
      "A lovely message from the collaborator about how much they want to help",
    requestId: "198823",
    status: RequestStatus.pending,
  },
  {
    organizerEmail: "landonvagohughes@gmail.com",
    organizerAddress: "CTown markets",
    organizerName: "Landon Co",
    helpingCategory: ServiceType.OTHER,
    message:
      "A lovely message from the collaborator about how much they want to help",
    requestId: "198823",
    status: RequestStatus.accepted,
  },
];

const ManageEvent: React.FC = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const { data: eventData } = api.events.getEventById.useQuery(
    eventId as string,
  );

  const { data: allCollaboratorsResponses } =
    api.collaboratorResponse.getAllCollaboratorResponses.useQuery(
      eventId as string,
    );

  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-5xl px-3">
        <div className="mt-3">
          <BreadcrumbManageCollaborators
            name={eventData?.title ?? "Your Event"}
            id={eventId as string}
          />
        </div>
        <div className="mt-2 text-3xl font-semibold">Manage Collaborators</div>
        <Tabs collaboratorResponses={allCollaboratorsResponses!} />
      </div>
    </div>
  );
};

export default ManageEvent;
