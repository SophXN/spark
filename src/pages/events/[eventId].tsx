import { useRouter } from 'next/router';
import Navbar from '~/components/Navbar';
import React from 'react';
import WhenAndWhere from '~/components/WhenAndWhere'
import OrganizerCard from '~/components/OrganizerCard';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import Image from "next/image";

const EventDetails: React.FC = () => {
    const router = useRouter();
    const { eventId } = router.query; // Access the dynamic segment

    return (
        <div>
            <Navbar></Navbar>
            <div className='py-3 px-3'>
                <Image
                    src={"https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt="Event"
                    className="h-[500px] w-full rounded object-cover"
                    width={1000}
                    height={1000}
                />

                <div className='flex min-h-full flex-col py-3'>
                    <div className="mx-auto flex flex-wrap w-full max-w-7xl items-start gap-x-3">
                        <main className="flex-grow bg-black-200">
                            <h1 className="text-4xl font-extrabold">Taxing Laughter: The Joke Tax Chronicles</h1>
                            <p className='pt-1 text-sm text-muted-foreground'>Some description of the event</p>
                            <h2 className='scroll-m-20 text-xl font-medium tracking-tight mt-2'>When and where</h2>
                            <WhenAndWhere></WhenAndWhere>
                            <h2 className='scroll-m-20 text-xl font-medium tracking-tight mt-2'>Organized by</h2>
                            <OrganizerCard></OrganizerCard>
                        </main>
                        <div className="sticky top-8 w-96 xl:block">
                            <h2 className='scroll-m-20 text-xl font-medium tracking-tight'>Support</h2>
                            <Card className='mt-2'>
                                <CardHeader>
                                    <div className='flex flex-row justify-between space-y-0'>
                                        <CardTitle className='text-xl font-medium'>Sponsorships</CardTitle>
                                        <CardTitle className='text-xl font-medium'>3 left</CardTitle>
                                    </div>
                                    <p className='text-sm'>345 Brettly Way Brooklyn, NY 12311</p>
                                </CardHeader>
                                <CardContent className=''>
                                    <p className='text-sm'>345 Brettly Way Brooklyn, NY 12311</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;