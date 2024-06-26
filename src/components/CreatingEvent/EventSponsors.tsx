import React from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { EventSponsorRow } from "./EventSponsorRow";
import { PlusIcon } from "@radix-ui/react-icons";
import { Tier, type Sponsor } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { api } from "~/utils/api";
import { type EventSponsorsAndCollaboratorProps } from "~/types/types";
import { useSession } from "next-auth/react";

export const EventSponsors = ({
  eventId,
  isReadyToSubmit,
}: EventSponsorsAndCollaboratorProps) => {
  const [sponsors, setSponsors] = React.useState<Sponsor[]>([]);
  const hasSponsors = sponsors.length !== 0;
  const mutation = api.sponsors.addSponsors.useMutation();
  const hasSubmitted = React.useRef(false);
  const { data: sessionData } = useSession();

  React.useEffect(() => {
    if (
      isReadyToSubmit &&
      !hasSubmitted.current &&
      hasSponsors &&
      sessionData?.user.id &&
      sessionData?.user.companyId
    ) {
      const sponsorsToSubmit = sponsors.filter(
        (sponsor) =>
          sponsor.amountPerSponsor !== 0 &&
          sponsor.description.trim().length > 0,
      );
      try {
        mutation.mutate({
          userId: sessionData?.user.id,
          merchantId: sessionData?.user.companyId,
          sponsors: sponsorsToSubmit,
        });
        hasSubmitted.current = true;
      } catch (error) {
        console.error("Error creating new sponsors", error);
      }
    }
  }, [
    hasSponsors,
    isReadyToSubmit,
    mutation,
    sessionData?.user.companyId,
    sessionData?.user.id,
    sponsors,
  ]);

  const removeSponsor = (sponsorId: string) => {
    const newSponsors = sponsors.filter((s: Sponsor) => s.id !== sponsorId);
    setSponsors(newSponsors);
  };

  const addSponsor = () => {
    const tier = Object.keys(Tier)[sponsors.length] as Tier;

    const newSponsor: Sponsor = {
      id: uuidv4(),
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
    <div className="grid w-full items-center gap-2">
      <Label id="sponsors">Sponsors</Label>
      <Label className="text-sm font-normal text-gray-600">
        Describe your tiers and how much each tier should pay
      </Label>

      <div className="flex flex-col space-y-2 rounded-lg border border-gray-300 p-3">
        {hasSponsors ? (
          sponsors.map((sponsor, index) => {
            return (
              <EventSponsorRow
                id={sponsor.id}
                key={sponsor.id}
                sponsor={sponsor}
                removeSponsor={removeSponsor}
                updateSponsor={updateSponsor}
                index={index + 1}
              />
            );
          })
        ) : (
          <span className="text-sm">
            No tiers added, tap below to add up to three tiers.
          </span>
        )}
        <Button
          type="button"
          onClick={addSponsor}
          id="submit-sponsors"
          disabled={sponsors.length >= 3}
          size="sm"
          className="w-full sm:w-28"
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
