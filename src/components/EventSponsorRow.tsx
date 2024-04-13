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
import { type Sponsor } from "@prisma/client";

interface EventSponsorRowProps {
  id: string;
  sponsor: Sponsor;
  removeSponsor: (sponsor: string) => void;
  updateSponsor: (sponsor: Sponsor) => void;
}

export const EventSponsorRow = ({
  id,
  sponsor,
  removeSponsor,
  updateSponsor,
}: EventSponsorRowProps) => {
  const updateSponsorProperty = (property: string, value: string | number) => {
    updateSponsor({
      ...sponsor,
      [property]: value,
    });
  };

  return (
    <div className="flex items-center justify-between gap-1" id={id}>
      <Input
        type="text"
        id={`tier-description${id}`}
        placeholder="Tier Description"
        className="max-w-sm"
        onChange={(e) => updateSponsorProperty("description", e.target.value)}
        value={sponsor.description}
      />
      <Input
        type="number"
        id={`amount-per-sponsor${id}`}
        placeholder="$0.00"
        className="w-24"
        onChange={(e) =>
          updateSponsorProperty("amountPerSponsor", parseInt(e.target.value))
        }
        value={sponsor.amountPerSponsor}
      />
      <Select>
        <SelectTrigger className="w-[180px] min-w-[30px]">
          <SelectValue
            placeholder="Total number"
            defaultValue="1"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (!isNaN(parseInt(value))) {
                updateSponsorProperty("sponsorsRequired", parseInt(value));
              }
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
        onClick={() => removeSponsor(sponsor.id)}
      >
        <Cross1Icon className="h-4 w-4" />
      </Button>
    </div>
  );
};
