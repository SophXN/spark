import React from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { EventCollaboratorRow } from "./EventCollaboratorRow";
import { PlusIcon } from "@radix-ui/react-icons";

export const EventCollaborators = () => {
  const [collaborators, setCollaborators] = React.useState<string[]>([]);
  const hasCollaborators = collaborators.length !== 0;

  const removeCollaborator = (sponsor: string) => {
    setCollaborators((prevSponsors) =>
      prevSponsors.filter((s) => s !== sponsor),
    );
  };

  return (
    <div className="grid w-full items-center gap-3">
      <Label>Collaborators</Label>
      <Label className="text-xs font-normal text-gray-600">
        Select as many types of collaborators needed for this event{" "}
      </Label>

      <div className="flex max-w-screen-md flex-col space-y-3 rounded-lg border border-gray-300 p-4">
        {hasCollaborators
          ? collaborators.map((collaborators) => {
              return (
                <EventCollaboratorRow
                  key={collaborators}
                  id={collaborators}
                  removeCollaborator={removeCollaborator}
                />
              );
            })
          : "No collaborators added, tap below to add a one"}
        <Button
          onClick={() => setCollaborators(["hi", ...collaborators])}
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
