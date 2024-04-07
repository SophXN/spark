import React from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { EventSponsorRow } from "./EventSponsorRow";
import { PlusIcon } from "@radix-ui/react-icons";
import { Tier, type Sponsor } from "@prisma/client";
import { uuid } from "uuidv4";
import { api } from "~/utils/api";

interface EventSponsorsProps {
  eventId: string;
  isReadyToSubmit: boolean;
}

export const EventSponsors = ({
  eventId,
  isReadyToSubmit,
}: EventSponsorsProps) => {
  const [sponsors, setSponsors] = React.useState<Sponsor[]>([]);

  const mutation = api.sponsors.addSponsors.useMutation();

  const hasSubmitted = React.useRef(false);

  React.useEffect(() => {
    if (isReadyToSubmit && !hasSubmitted.current && sponsors.length > 0) {
      const sponsorsToSubmit = sponsors.filter(
        (sponsor) =>
          sponsor.amountPerSponsor !== 0 &&
          sponsor.description.trim().length > 0,
      );
      try {
        console.log("sending new sponsors", sponsorsToSubmit);
        mutation.mutate(sponsorsToSubmit);
        hasSubmitted.current = true;
      } catch (error) {
        console.error("Error creating new sponsors", error);
      }
    }
  }, [isReadyToSubmit, mutation, sponsors]);
  const hasSponsors = sponsors.length !== 0;

  const removeSponsor = (sponsorId: string) => {
    const newSponsors = sponsors.filter((s: Sponsor) => s.id !== sponsorId);
    setSponsors(newSponsors);
  };

  const addSponsor = () => {
    const tier = Object.keys(Tier)[sponsors.length] as Tier;

    const newSponsor: Sponsor = {
      id: uuid(),
      eventRequestId: eventId,
      tier: tier,
      description: "",
      sponsorsRequired: 1,
      amountPerSponsor: 0.0,
    };
    setSponsors([...sponsors, newSponsor]);
  };

  const updateSponsor = (sponsor: Sponsor) => {
    const newSponsors = sponsors.map((s) => {
      if (s.id === sponsor.id) {
        return sponsor;
      }
      return s;
    });
    setSponsors(newSponsors);
  };

  return (
    <div className="grid w-full items-center gap-3">
      <Label id="sponsors">Sponsors</Label>
      <Label className="text-xs font-normal text-gray-600">
        Describe your tiers and how much each tier should pay
      </Label>

      <div className="flex max-w-screen-md flex-col space-y-3 rounded-lg border border-gray-300 p-4">
        {hasSponsors
          ? sponsors.map((sponsor) => {
              return (
                <EventSponsorRow
                  id={sponsor.id}
                  key={sponsor.id}
                  sponsor={sponsor}
                  removeSponsor={removeSponsor}
                  updateSponsor={updateSponsor}
                />
              );
            })
          : "No tiers added, tap below to add up to three tiers."}
        <Button
          type="button"
          onClick={addSponsor}
          id="submit-sponsors"
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
