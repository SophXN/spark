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
import { type Sponsor } from "@prisma/client";

interface EventSponsorRowProps {
  id: string;
  sponsor: Sponsor;
  removeSponsor: (sponsor: string) => void;
  updateSponsor: (sponsor: Sponsor) => void;
  index: number
}

export const EventSponsorRow = ({
  id,
  sponsor,
  removeSponsor,
  updateSponsor,
  index,
}: EventSponsorRowProps) => {
  const updateSponsorProperty = (property: string, value: string | number) => {
    updateSponsor({
      ...sponsor,
      [property]: value,
    });
  };

  return (
    <div className="flex flex-col gap-1" id={id}>
      <div className="text-sm">
        {"Tier " + index.toString()}
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex flex-grow flex-wrap items-center gap-2">
          <div className="w-full flex-1 md:w-full">
            <Input
              type="text"
              id={`tier-description${id}`}
              placeholder="Describe the sponsors benefits..."
              onChange={(e) =>
                updateSponsorProperty("description", e.target.value)
              }
              value={sponsor.description}
            />
          </div>
          <div className="w-full flex-none sm:w-auto">
            <Input
              prefix="$"
              type="number"
              id={`amount-per-sponsor${id}`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSponsorProperty(
                  "amountPerSponsor",
                  parseInt(e.target.value),
                )
              }
              value={sponsor.amountPerSponsor}
            />
          </div>
          <div className="w-full flex-1 sm:w-auto">
            <Select
              defaultValue="1"
              onValueChange={(value) =>
                updateSponsorProperty("sponsorsRequired", parseInt(value))
              }
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
          onClick={() => removeSponsor(sponsor.id)}
        >
          <Cross2Icon className="h-3 w-3" />
        </Button>
      </div>

    </div>
  );
};
