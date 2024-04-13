import React from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { EventCollaboratorRow } from "./EventCollaboratorRow";
import { PlusIcon } from "@radix-ui/react-icons";
import { uuid } from "uuidv4";
import { api } from "~/utils/api";
import { type EventSponsorsAndCollaboratorProps } from "~/types/types";
import { ServiceType, type Collaborator } from "@prisma/client";

export const EventCollaborators = ({
  eventId,
  isReadyToSubmit,
}: EventSponsorsAndCollaboratorProps) => {
  const [collaborators, setCollaborators] = React.useState<Collaborator[]>([]);
  const hasCollaborators = collaborators.length !== 0;
  const mutation = api.collaborators.addCollaborators.useMutation();
  const hasSubmitted = React.useRef(false);
  React.useEffect(() => {
    setTimeout(() => {
      if (isReadyToSubmit && !hasSubmitted.current && hasCollaborators) {
        const collaboratorsToSubmit = collaborators.filter(
          (collaborator) =>
            collaborator.collaboratorsRequired !== 0 &&
            collaborator.description.trim().length > 0,
        );
        try {
          mutation.mutate(collaboratorsToSubmit);
          hasSubmitted.current = true;
        } catch (error) {
          console.error("Error creating new sponsors", error);
        }
      }
    }, 3000);
  }, [isReadyToSubmit, mutation, collaborators, hasCollaborators, eventId]);

  const removeCollaborator = (collaboratorId: string) => {
    const newCollaborators = collaborators.filter(
      (c: Collaborator) => c.id !== collaboratorId,
    );
    setCollaborators(newCollaborators);
  };

  const addCollaborators = () => {
    const newCollaborator: Collaborator = {
      id: uuid(),
      eventRequestId: eventId,
      serviceType: ServiceType.FOOD,
      description: "",
      collaboratorsRequired: 1,
    };
    setCollaborators([...collaborators, newCollaborator]);
  };

  const updateCollaborator = (collaborator: Collaborator) => {
    const newCollaborators = collaborators.map((c) => {
      if (c.id === collaborator.id) {
        return collaborator;
      }
      return c;
    });
    setCollaborators(newCollaborators);
  };

  return (
    <div className="grid w-full items-center gap-3">
      <Label>Collaborators</Label>
      <Label className="text-xs font-normal text-gray-600">
        Select as many types of collaborators needed for this event{" "}
      </Label>

      <div className="flex max-w-screen-md flex-col space-y-3 rounded-lg border border-gray-300 p-4">
        {hasCollaborators
          ? collaborators.map((collaborator) => {
              return (
                <EventCollaboratorRow
                  id={collaborator.id}
                  key={collaborator.id}
                  collaborator={collaborator}
                  removeCollaborator={removeCollaborator}
                  updateCollaborator={updateCollaborator}
                />
              );
            })
          : "No collaborators added, tap below to add a one"}
        <Button
          type="button"
          onClick={addCollaborators}
          id="submit-collaborators"
          className="w-40"
        >
          <div className="mr-1">
            <PlusIcon />
          </div>
          New Collaborator
        </Button>
      </div>
    </div>
  );
};
