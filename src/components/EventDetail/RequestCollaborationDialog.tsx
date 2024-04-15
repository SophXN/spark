import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import { api } from "~/utils/api";
import { HomePageResponse, RequestStatus } from "~/types/types";
import { ServiceType } from "@prisma/client";
import { useState } from "react";

const collaboratorResponseSchema = z.object({
    collaboratorId: z.string().min(1, "Collaborator ID is required"),
    eventRequestId: z.string().min(1, "Event Request ID is required"),
    responderId: z.string().min(1, "Responder ID is required"),
    status: z.nativeEnum(RequestStatus),
    responseMessage: z.string().min(1, "Message is required"),
    respondedOn: z.date(),
    serviceType: z.nativeEnum(ServiceType)
});

interface PublicEventData {
    eventDetails: HomePageResponse;
}

export default function RequestCollaborationDialog({ eventDetails }: PublicEventData) {
    const [open, setOpen] = useState(false)

    //TODO: Updated the responderID with the id of the user who is logged in

    const form = useForm<z.infer<typeof collaboratorResponseSchema>>({
        defaultValues: {
            collaboratorId: "",
            eventRequestId: eventDetails.eventId,
            responderId: "235khf8745",
            status: RequestStatus.pending,
            responseMessage: "",
            respondedOn: new Date(),
            serviceType: ServiceType.OTHER,
        },
        resolver: zodResolver(collaboratorResponseSchema),
    });

    const mutation = api.collaboratorResponse.createCollaboratorResponse.useMutation();

    const onSubmit = async (data: z.infer<typeof collaboratorResponseSchema>) => {
        const selectedCollaborator = eventDetails.collaborators.find((collaborator) => collaborator.id == data.collaboratorId)
        data.serviceType = selectedCollaborator?.serviceType as ServiceType
        try {
            // Validate the input using Zod schema
            const validatedInput = collaboratorResponseSchema.parse(data);
            // If validation is successful, proceed to mutate
            mutation.mutate(validatedInput, {
              onSuccess: (results) => {
                console.log(results, "<-- submission");
                setOpen(false)
              },
            });
          } catch (error) {
            if (error instanceof z.ZodError) {
              // Transform Zod errors to a more friendly format
              console.log(error);
            }
          }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='w-full'>Become a Collaborator</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Request to Collaborate</DialogTitle>
                    <DialogDescription>
                        Pick below how you wish to help the organizer of the event.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="grid w-full items-center gap-1" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="collaboratorId"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid w-full items-center gap-2">
                                        <Label>Select how you could help</Label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {eventDetails.collaborators.map((collaborator) => {
                                                    return <SelectItem key={collaborator.id} value={collaborator.id}>{collaborator.serviceType} - {collaborator.description}</SelectItem>
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <FormMessage />
                                </FormItem>

                            )}
                        />
                        <FormField
                            control={form.control}
                            name="responseMessage"
                            render={({ field }) => (
                                <FormItem className="mt-2">
                                    <div className="grid w-full items-center gap-2">
                                        <Label htmlFor="message">Write a message to the organizer</Label>
                                        <Input type="text" {...field} placeholder="Hey! I'd love to help..." />
                                    </div>
                                    <FormMessage />
                                </FormItem>

                            )}
                        />
                        <DialogFooter className="mt-2">
                            <Button
                                type="submit">Submit request</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}