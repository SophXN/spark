import React from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { EventCollaboratorRow } from "./EventCollaboratorRow";
import { PlusIcon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from "uuid";
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
  }, [isReadyToSubmit, mutation, collaborators, hasCollaborators, eventId]);

  const removeCollaborator = (collaboratorId: string) => {
    const newCollaborators = collaborators.filter(
      (c: Collaborator) => c.id !== collaboratorId,
    );
    setCollaborators(newCollaborators);
  };

  const addCollaborators = () => {
    const newCollaborator: Collaborator = {
      id: uuidv4(),
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
    <div className="grid w-full items-center gap-2">
      <Label>Collaborators</Label>
      <Label className="text-sm font-normal text-gray-600">
        Select as many types of collaborators needed for this event{" "}
      </Label>

      <div className="flex flex-col space-y-2 rounded-lg border border-gray-300 p-3">
        {hasCollaborators ? (
          collaborators.map((collaborator) => {
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
        ) : (
          <span className="text-sm">
            No collaborators added, tap below to add a one.
          </span>
        )}
        <Button
          type="button"
          onClick={addCollaborators}
          id="submit-collaborators"
          className="w-full sm:w-44"
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
