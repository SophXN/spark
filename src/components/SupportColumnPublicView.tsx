import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
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
                <Button className='w-full'>Become a Collaborator</Button>
            </CardFooter>
        </Card>
    </div>
    )
}