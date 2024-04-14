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
import { Cross1Icon, Cross2Icon } from "@radix-ui/react-icons";
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
    <div className="flex flex-row gap-2" id={id}>
      <div className="flex flex-grow flex-wrap items-center gap-2">
        <div className="w-full flex-1 md:w-full">
          <Input
            type="text"
            id={`tier-description${id}`}
            placeholder="Tier Description"
            onChange={(e) => updateSponsorProperty("description", e.target.value)}
            value={sponsor.description}
          />
        </div>
        <div className="w-full flex-none sm:w-auto">
          <Input
            type="number"
            id={`amount-per-sponsor${id}`}
            placeholder="$0.00"
            onChange={(e) =>
              updateSponsorProperty("amountPerSponsor", parseInt(e.target.value))
            }
            value={sponsor.amountPerSponsor}
          />
        </div>
        <div className="w-full flex-1 sm:w-auto">
          <Select>
            <SelectTrigger>
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
        </div>
      </div>

      <Button className="flex-none"
        variant="outline"
        size="icon"
        onClick={() => removeSponsor(sponsor.id)}
      >
        <Cross2Icon className="w-3 h-3" />
      </Button>
    </div>
  );
};
