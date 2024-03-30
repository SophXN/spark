import React from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { EventSponsorRow } from "./EventSponsorRow";
import { PlusIcon } from "@radix-ui/react-icons";

export const EventSponsors = () => {
  const [sponsors, setSponsors] = React.useState<string[]>([]);
  const hasSponsors = sponsors.length !== 0;

  const removeSponsor = (sponsor: string) => {
    setSponsors((prevSponsors) => prevSponsors.filter((s) => s !== sponsor));
  };

  return (
    <div className="grid w-full items-center gap-3">
      <Label htmlFor="sponsors">Sponsors</Label>
      <Label
        htmlFor="description"
        className="text-xs font-normal text-gray-600"
      >
        Describe your tiers and how much each tier should pay
      </Label>

      <div className="flex max-w-screen-md flex-col space-y-3 rounded-lg border border-gray-300 p-4">
        {hasSponsors
          ? sponsors.map((sponsor) => {
              return (
                <EventSponsorRow
                  key={sponsor}
                  id={sponsor}
                  removeSponsor={removeSponsor}
                />
              );
            })
          : "No tiers added, tap below to add one"}
        <Button
          onClick={() => setSponsors(["hi", ...sponsors])}
          id="event-description"
          disabled={sponsors.length >= 3}
          className="w-24"
        >
          <div className="mr-1">
            <PlusIcon />
          </div>
          Add Tier
        </Button>
      </div>
    </div>
  );
};
