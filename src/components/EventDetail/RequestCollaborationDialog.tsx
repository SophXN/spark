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

import Link from "next/link"
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
import { EventRequest } from "@prisma/client";


const FormSchema = z.object({
    email: z
        .string({
            required_error: "Please select an email to display.",
        })
        .email(),
})

interface PublicEventData {
    eventDetails: EventRequest;
  }

export default function RequestCollaborationDialog({eventDetails}: PublicEventData) {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        // toast({
        //     title: "You submitted the following values:",
        //     description: (
        //         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //             <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //         </pre>
        //     ),
        // })
    }

    console.log(eventDetails, "become");

    return (
        <Dialog>
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid w-full items-center gap-2">
                                        <Label htmlFor="email">Select how you could help</Label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {eventDetails.collaborators.map((collaborator) => {
                                                    return <SelectItem value={collaborator.serviceType}>{collaborator.serviceType} - {collaborator.description}</SelectItem>
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
                            name="email"
                            render={({ field }) => (
                                <FormItem className="mt-2">
                                    <div className="grid w-full items-center gap-2">
                                        <Label htmlFor="message">Write a message to the organizer</Label>
                                        <Input type="text" id="message" placeholder="Hey! I'd love to help..." />
                                    </div>
                                    <FormMessage />
                                </FormItem>

                            )}
                        />
                        <DialogFooter className="mt-2">
                            <Button type="submit">Submit request</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}