import * as React from "react";
import { EventCollaborators } from "~/components/CreatingEvent/EventCollaborators";
import { EventSponsors } from "~/components/CreatingEvent/EventSponsors";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { UploadIcon } from "@radix-ui/react-icons";
import { Calendar } from "~/components/ui/calendar";
import { api } from "~/utils/api";
import { v4 as uuidv4 } from "uuid";
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
import { CalendarIcon, Loader2 } from "lucide-react";
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
import { useSession } from "next-auth/react";

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

enum EventCreationProgress {
  IDLE = "IDLE",
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESS = "SUCCESS",
}

export default function Events() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  console.log("sessionData", sessionData, status);
  const [isReadyToSubmit, setIsReadyToSubmit] = React.useState(false);
  const [eventCreationProgress, setEventCreationProgress] =
    React.useState<EventCreationProgress>(EventCreationProgress.IDLE);
  const mutation = api.events.createEvent.useMutation({
    onSuccess: () => {
      setEventCreationProgress(EventCreationProgress.SUCCESS);
    },
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      eventId: uuidv4(),
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
      setEventCreationProgress(EventCreationProgress.IN_PROGRESS);
      mutation.mutate(params);
    } catch (error) {
      console.error("Error submitting event form", error);
    }
  };

  React.useEffect(() => {
    if (eventCreationProgress === EventCreationProgress.SUCCESS) {
      setIsReadyToSubmit(true);
      setTimeout(() => {
        void router.push(`/events/${form.getValues("eventId")}`);
      }, 3000);
    }
  }, [eventCreationProgress, form, router]);

  const handleCancelEvent = () => {
    void router.push("/");
  };

  return (
    <>
      <div>
        <Navbar />
        <div className="relative mb-4 w-screen flex-1 space-y-8">
          <div className="mx-3 mt-4 grid justify-items-center">
            <div className="w-full items-center sm:max-w-4xl">
              <h3 className="text-2xl font-bold">Create your event</h3>
            </div>
            <div className="mt-4 w-full max-w-4xl">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
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
                            <FormLabel htmlFor="eventDate">
                              Event Date
                            </FormLabel>
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
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
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
                            <FormLabel htmlFor="eventType">
                              Event Type
                            </FormLabel>
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
                      This will appear at the top of your event page and on the
                      home page across our platform
                    </Label>
                    <Button
                      id="upload"
                      type="button"
                      variant="outline"
                      className="w-24"
                    >
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
        </div>
        <div className="z-11 sticky bottom-0 flex w-full justify-end gap-2 overflow-visible border-t border-gray-200 bg-white pb-2 pr-4 pt-2">
          <Button
            type="button"
            onClick={() => handleCancelEvent()}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={eventCreationProgress !== EventCreationProgress.IDLE}
          >
            {eventCreationProgress === EventCreationProgress.IDLE ? (
              "Create Event"
            ) : (
              <>
                <Loader2 className="mr-1 h-2 w-2 animate-spin" />
                Creating Event
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
