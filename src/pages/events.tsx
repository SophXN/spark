import * as React from "react";
import { EventCollaborators } from "~/components/EventCollaborators";
import { EventSponsors } from "~/components/EventSponsors";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { UploadIcon } from "@radix-ui/react-icons";
import { Calendar } from "~/components/ui/calendar";
import { EventType } from "../types/types"; // Import the enum from types.ts

import {
  Form,
  FormControl,
  FormDescription,
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
  title: z.string(),
  description: z.string(),
  eventDate: z.date({
    required_error: "An event date is required.",
  }),
  eventType: z.nativeEnum(EventType),
  eventLocation: z.string(),
});

export default function Events() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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
                    <FormLabel>Event Title</FormLabel>
                    <Input
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
                    <FormLabel>Event Description</FormLabel>
                    <Input
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
                      <FormLabel>Event Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
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
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {/* <FormDescription>
                      Your date of birth is used to calculate your age.
                    </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="eventType" // Add a name for the field
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Type</FormLabel>
                    <Select>
                      <SelectTrigger className="w-[180px] min-w-[30px]">
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
                    <FormLabel>Event Location</FormLabel>
                    <Input
                      type="text"
                      placeholder="Address of event"
                      {...field}
                    />
                  </FormItem>
                )}
              />

              <div className="grid w-full max-w-screen-sm items-center gap-3">
                <Label htmlFor="upload">Event Image</Label>
                <Label
                  htmlFor="description"
                  className="text-xs font-normal text-gray-600"
                >
                  This will appear at the top of your event page and on the home
                  page across our platform
                </Label>
                <Button
                  id="event-description"
                  variant="outline"
                  className="w-24"
                >
                  <div className="mr-1">
                    <UploadIcon />
                  </div>
                  Upload
                </Button>
                <EventSponsors />
                <EventCollaborators />
              </div>
            </form>
          </Form>
        </div>{" "}
        {/* This is the closing tag for the div opened at line 38 */}
        <div className=" gap-3 border-t p-5">
          <Button variant="outline" onClick={() => console.log("yay")}>
            Cancel
          </Button>
          <Button type="submit" onClick={() => console.log("yay")}>
            Create Event
          </Button>
        </div>
      </div>
    </>
  );
}
