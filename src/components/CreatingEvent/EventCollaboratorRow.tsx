import React from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ServiceType, type Collaborator } from "@prisma/client";

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
    <div className="flex flex-row gap-2">
      <div className="flex flex-grow flex-wrap items-center gap-2">
        <div className="w-full flex-1 md:w-full">
          <Input
            type="text"
            id={id}
            placeholder="Tier Description"
            onChange={(e) =>
              updateCollaboratorProperty("description", e.target.value)
            }
            value={collaborator.description}
          />
        </div>
        <div className="w-full flex-none sm:w-64">
          <Select
            onValueChange={(value) => {
              updateCollaboratorProperty("serviceType", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" defaultValue="1" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ServiceType.FOOD}>Food</SelectItem>
              <SelectItem value={ServiceType.MUSIC}>Music</SelectItem>
              <SelectItem value={ServiceType.SPACE}>Event Space</SelectItem>
              <SelectItem value={ServiceType.ART}>Art</SelectItem>
              <SelectItem value={ServiceType.DESIGN}>Design</SelectItem>
              <SelectItem value={ServiceType.OTHER}>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex-1 sm:w-auto">
          <Select
            defaultValue="1"
            onValueChange={(value) => {
              updateCollaboratorProperty(
                "collaboratorsRequired",
                parseInt(value),
              );
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Total number" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        className="flex-none"
        variant="outline"
        size="icon"
        onClick={() => removeCollaborator(collaborator.id)}
      >
        <Cross2Icon className="h-3 w-3" />
      </Button>
    </div>
  );
};
