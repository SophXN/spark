import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Progress } from "./ui/progress";
import { Button } from '~/components/ui/button';

export default function SupportColumnHostView() {
    return (
        <div className="sticky mt-2 xl:mt-0 w-full xl:w-96 xl:block">
            <h2 className='scroll-m-20 text-xl font-medium tracking-tight'>Support needed</h2>
            <Card className='mt-2'>
                <CardHeader>
                    <CardTitle className='text-xl font-medium mb-1'>Sponsors</CardTitle>
                    <Progress className="h-1" value={22}></Progress>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-row justify-between items-center'>
                        <p className='text-sm'>Amount raised for event</p>
                        <p className='text-sm font-bold'>$3000</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className='w-full'>View Sponsors</Button>
                </CardFooter>
            </Card>
            <Card className='mt-2'>
                <CardHeader>
                    <CardTitle className='text-xl font-medium mb-1'>Collaborators</CardTitle>
                    <Progress className="h-1" value={54}></Progress>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-row justify-between items-center'>
                        <p className='text-sm'>Total Collaborators</p>
                        <p className='text-sm font-bold'>3/5</p>
                    </div>
                    <div className='mt-2 flex flex-row justify-between items-center'>
                        <p className='text-sm'>Total requests</p>
                        <p className='text-sm font-bold'>10</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className='w-full'>Manage Collaborators</Button>
                </CardFooter>
            </Card>
        </div>
    )
}