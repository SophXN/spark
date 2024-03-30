import * as React from "react";
import { EventCollaborators } from "~/components/EventCollaborators";
import { EventSponsors } from "~/components/EventSponsors";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { UploadIcon } from "@radix-ui/react-icons";

export default function Events() {
  return (
    <>
      <div className="relative w-screen flex-1 space-y-8">
        <div className="flex w-full items-center  bg-gray-300 p-4">
          <h3 className="text-lg font-bold">Create an event</h3>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
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
              This will appear at the top of your event page and on the home
              page across our platform
            </Label>
            <Button id="event-description" variant="outline" className="w-24">
              <div className="mr-1">
                <UploadIcon />
              </div>
              Upload
            </Button>
            <EventSponsors />
            <EventCollaborators />
          </div>
        </div>
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
