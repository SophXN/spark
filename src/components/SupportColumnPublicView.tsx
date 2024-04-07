import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Button } from '~/components/ui/button';

export default function SupportColumnPublicView() {
    return (
        <div className="sticky mt-2 xl:mt-0 w-full xl:w-96 xl:block">
            <h2 className='scroll-m-20 text-xl font-medium tracking-tight'>Support needed</h2>
            <Card className='mt-2'>
                <CardHeader>
                    <div className='flex flex-row justify-between space-y-0'>
                        <CardTitle className='text-xl font-medium'>Sponsors</CardTitle>
                        <CardTitle className='text-xl font-medium'>3 spots left</CardTitle>
                    </div>
                    <p className='text-sm'>Get your logo applied to all over our merch and on the store front.</p>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-row justify-between items-center'>
                        <p className='text-sm'>Total sponsors</p>
                        <p className='text-sm font-bold'>3</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className='w-full'>Become a sponsor</Button>
                </CardFooter>
            </Card>
            <Card className='mt-2'>
                <CardHeader>
                    <div className='flex flex-row justify-between space-y-0'>
                        <CardTitle className='text-xl font-medium'>Collaborators</CardTitle>
                        <CardTitle className='text-xl font-medium'>2 spots left</CardTitle>
                    </div>
                    <p className='text-sm'>Offer your services at this event. Get exposure to your brand for free.</p>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-row justify-between items-center'>
                        <p className='text-sm'>Total Collaborators</p>
                        <p className='text-sm font-bold'>3</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className='w-full'>Become a Collaborator</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-4 items-center gap-2">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        defaultValue="Pedro Duarte"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-2">
                                    <Label htmlFor="username" className="text-right">
                                        Username
                                    </Label>
                                    <Input
                                        id="username"
                                        defaultValue="@peduarte"
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        </div>
    )
}