import * as React from "react";
import { EventCollaborators } from "~/components/EventCollaborators";
import { EventSponsors } from "~/components/EventSponsors";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { UploadIcon } from "@radix-ui/react-icons";
import { Calendar } from "~/components/ui/calendar";
import { EventType } from "../types/types"; // Import the enum from types.ts
import { api } from "~/utils/api";
import { uuid } from "uuidv4";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const FormSchema = z.object({
  eventId: z.string(),
  requesterId: z.string(),
  title: z.string(),
  description: z.string(),
  eventDate: z.date({
    required_error: "An event date is required.",
  }),
  eventType: z.nativeEnum(EventType),
  eventLocation: z.string(),
});

export default function Events() {
  const [isReadyToSubmit, setIsReadyToSubmit] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      eventId: uuid(),
      requesterId: "235khf8745",
      title: "",
      description: "",
      eventDate: new Date(),
      eventLocation: "",
      eventType: EventType.CONFERENCE,
    },
    resolver: zodResolver(FormSchema),
  });

  const mutation = api.events.createEvent.useMutation();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const params = {
      eventId: form.getValues("eventId"),
      requesterId: "235khf8745",
      title: data.title,
      description: data.description,
      eventDate: data.eventDate,
      eventLocation: data.eventLocation,
      createdOn: new Date(),
      eventType: data.eventType,
    };
    try {
      mutation.mutate(params);
    } catch (error) {
      console.error("Error submitting event form", error);
    }
  };

  return (
    <>
      <div className="relative w-screen flex-1 space-y-8">
        <div className="flex w-full items-center p-4">
          <h3 className="text-lg ">Create an event</h3>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor="eventTitle">Event Title</FormLabel>
                    <Input
                      id="eventTitle"
                      type="text"
                      placeholder="Name your event"
                      {...field}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor="eventDescription">
                      Event Description
                    </FormLabel>
                    <Input
                      id="eventDescription"
                      type="text"
                      placeholder="Describe your event"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <div className="grid w-full max-w-screen-sm items-center gap-3">
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel htmlFor="eventDate">Event Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl id="eventDate">
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="eventType"
                render={({ ...field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor="eventType">Event Type</FormLabel>
                    <Select {...field}>
                      <SelectTrigger
                        id="eventType"
                        className="w-[180px] min-w-[30px]"
                      >
                        <SelectValue placeholder="Select an event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EventType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventLocation"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor="eventLocation">
                      Event Location
                    </FormLabel>
                    <Input
                      id="eventLocation"
                      type="text"
                      placeholder="Address of event"
                      {...field}
                    />
                  </FormItem>
                )}
              />

              <div className="grid w-full max-w-screen-sm items-center gap-3">
                <Label htmlFor="upload">Event Image</Label>
                <Label className="text-xs font-normal text-gray-600">
                  This will appear at the top of your event page and on the home
                  page across our platform
                </Label>
                <Button id="upload" variant="outline" className="w-24">
                  <div className="mr-1">
                    <UploadIcon />
                  </div>
                  Upload
                </Button>
              </div>
              <EventSponsors
                eventId={form.getValues("eventId")}
                isReadyToSubmit={isReadyToSubmit}
              />
              <EventCollaborators
                eventId={form.getValues("eventId")}
                isReadyToSubmit={isReadyToSubmit}
              />
              <div className=" gap-3 border-t p-5">
                <Button variant="outline" onClick={() => console.log("yay")}>
                  Cancel
                </Button>
              </div>

              <Button type="submit" onClick={() => setIsReadyToSubmit(true)}>
                Create Event
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
