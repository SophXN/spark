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

interface EventCollaboratorRowProps {
  id: string;
  removeCollaborator: (sponsor: string) => void;
}

export const EventCollaboratorRow = ({
  id,
  removeCollaborator,
}: EventCollaboratorRowProps) => {
  return (
    <div className="flex items-center justify-between gap-1">
      <Input
        type="text"
        id="tier-description"
        placeholder="Tier Description"
        className="max-w-sm"
      />

      <Select>
        <SelectTrigger className="w-[180px] min-w-[30px]">
          {" "}
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Food</SelectItem>
          <SelectItem value="2">Music</SelectItem>
          <SelectItem value="3">Event Space</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px] min-w-[30px]">
          {" "}
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
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeCollaborator(id)}
      >
        <Cross1Icon className="h-4 w-4" />
      </Button>
    </div>
  );
};
