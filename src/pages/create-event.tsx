import * as React from "react";
import { EventCollaborators } from "~/components/EventCollaborators";
import { EventSponsors } from "~/components/EventSponsors";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { UploadIcon } from "@radix-ui/react-icons";
import { Calendar } from "~/components/ui/calendar";
import { api } from "~/utils/api";
import { uuid } from "uuidv4";
import { useRouter } from "next/router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, set } from "date-fns";
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
import { EventType } from "@prisma/client";
import Navbar from "~/components/Navbar";

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
  const router = useRouter();
  const [isReadyToSubmit, setIsReadyToSubmit] = React.useState(false);
  const mutation = api.events.createEvent.useMutation();

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

  const handleCreateEvent = (eventId: string) => {
    setIsReadyToSubmit(true);
    void router.push(`/events/${eventId}`);
  };

  return (
    <>
      <div className="relative w-screen h-screen flex-1 space-y-8">
        <Navbar />
        <div className="grid justify-items-center px-3">
          <div className="flex max-w-4xl w-full items-center">
            <h3 className="text-2xl font-bold">Create your event</h3>
          </div>
          <div className="mt-4 max-w-4xl w-full">
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
                        className="pl-2"
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
                        className="pl-2"
                        placeholder="Describe your event"
                        {...field}
                      />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row gap-2">
                  <div className="flex-1">
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
                                    "pl-2 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-2 w-2 opacity-50" />
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
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ ...field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel htmlFor="eventType">Event Type</FormLabel>
                          <Select {...field}>
                            <SelectTrigger
                              id="eventType"
                              className="w-auto pl-2"
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
                  </div>
                </div>
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
                        className="pl-2"
                      />
                    </FormItem>
                  )}
                />

                <div className="grid w-full max-w-screen-sm items-center gap-2">
                  <Label htmlFor="upload">Event Image</Label>
                  <Label className="text-sm font-normal text-gray-600">
                    This will appear at the top of your event page and on the home
                    page across our platform
                  </Label>
                  <Button id="upload" type="button" variant="outline" className="w-24">
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
              </form>
            </Form>
          </div>
        </div>
        <div className="flex gap-2 justify-end w-full sticky bottom-0 z-11 overflow-visible border-t border-gray-200 bg-white pt-2 pb-2 pr-4">
          <Button type="button" variant="outline" onClick={() => console.log("yay")}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => handleCreateEvent(form.getValues("eventId"))}
          >
            Create Event
          </Button>

        </div>
        {/* <footer className="flex items-end px-4 md:px-6 py-4 md:py-6">
          <Button size="sm">Button</Button>
        </footer> */}
      </div>
    </>
  );
}
