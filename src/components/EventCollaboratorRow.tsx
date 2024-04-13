import React from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Cross1Icon } from "@radix-ui/react-icons";
import { type Collaborator } from "@prisma/client";

interface EventCollaboratorRowProps {
  id: string;
  collaborator: Collaborator;
  removeCollaborator: (collaborator: string) => void;
  updateCollaborator: (collaborator: Collaborator) => void;
}

export const EventCollaboratorRow = ({
  id,
  collaborator,
  removeCollaborator,
  updateCollaborator,
}: EventCollaboratorRowProps) => {
  const updateCollaboratorProperty = (
    property: string,
    value: string | number,
  ) => {
    updateCollaborator({
      ...collaborator,
      [property]: value,
    });
  };

  return (
    <div className="flex items-center justify-between gap-1">
      <Input
        type="text"
        id={id}
        placeholder="Tier Description"
        className="max-w-sm"
        onChange={(e) =>
          updateCollaboratorProperty("description", e.target.value)
        }
        value={collaborator.description}
      />

      <Select>
        <SelectTrigger className="w-[180px] min-w-[30px]">
          <SelectValue
            placeholder="Category"
            defaultValue="1"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              updateCollaboratorProperty("serviceType", value);
            }}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Food</SelectItem>
          <SelectItem value="2">Music</SelectItem>
          <SelectItem value="3">Event Space</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px] min-w-[30px]">
          <SelectValue
            placeholder="Total number"
            defaultValue="1"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              updateCollaboratorProperty(
                "collaboratorsRequired",
                parseInt(value),
              );
            }}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
          <SelectItem value="4">4</SelectItem>
          <SelectItem value="5">5</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeCollaborator(collaborator.id)}
      >
        <Cross1Icon className="h-4 w-4" />
      </Button>
    </div>
  );
};
