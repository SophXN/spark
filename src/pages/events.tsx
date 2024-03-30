import * as React from "react";
import { EventCollaborators } from "~/components/EventCollaborators";
import { EventSponsors } from "~/components/EventSponsors";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function Events() {
  return (
    <>
      <div className="relative mt-6 flex-1 space-y-4 px-4 sm:px-6 ">
        <div className="grid w-full max-w-screen-sm items-center gap-3">
          <Label htmlFor="event-title">Event Title</Label>
          <Input type="text" id="event-title" placeholder="Name your event" />
        </div>
        <div className="grid w-full max-w-screen-sm items-center gap-3">
          <Label htmlFor="description">Description</Label>
          <Input
            type="text"
            id="event-description"
            placeholder="We plan to bring the community together..."
          />
        </div>
        <div className="grid w-full max-w-screen-sm items-center gap-3">
          <Label htmlFor="upload">Upload</Label>
          <Label
            htmlFor="description"
            className="text-xs font-normal text-gray-600"
          >
            This will appear at the top of your event page and on the home page
            across our platform
          </Label>
          <Button id="event-description" variant="outline" className="w-24">
            Upload
          </Button>
        </div>
        <EventSponsors />
        <EventCollaborators />
      </div>
      <div className="h-25 absolute bottom-0 flex w-screen justify-end gap-3 border-t p-5">
        <Button variant="outline" onClick={() => console.log("yay")}>
          Cancel
        </Button>
        <Button onClick={() => console.log("yay")}>Create Event</Button>
      </div>
    </>
  );
}
