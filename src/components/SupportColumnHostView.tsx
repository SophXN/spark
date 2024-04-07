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
import { useRouter } from 'next/router';

interface ManageEventProps {
    eventId: string
}

const SupportColumnHostView: React.FC<ManageEventProps> = ({eventId}) => {

    const router = useRouter();

    const handleEventClick = (eventId: string) => {
      // Potentially some logic here
      console.log(eventId)
      router.push(`/manage/${eventId}`);
    };

    return (
        <div>
            <Card className='mt-2'>
                <CardHeader>
                    <CardTitle className='text-xl font-bold mb-1'>Sponsors</CardTitle>
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
                    <CardTitle className='text-xl font-bold mb-1'>Collaborators</CardTitle>
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
                    <Button  onClick={() => handleEventClick(eventId)} className='w-full'>Manage Collaborators</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SupportColumnHostView