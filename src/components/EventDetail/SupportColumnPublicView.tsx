import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Button } from '~/components/ui/button';
import RequestCollaborationDialog from "~/components/EventDetail/RequestCollaborationDialog"
import { EventPageDetails } from "~/types/types";

interface PublicEventData {
    publicData: EventPageDetails
}
const SupportColumnPublicView: React.FC<PublicEventData> = ({publicData}) => {
    return (
        <div>
            <Card className='mt-2'>
                <CardHeader>
                    <div className='flex flex-row justify-between space-y-0'>
                        <CardTitle className='text-xl font-bold'>Sponsors</CardTitle>
                        <CardTitle className='text-xl font-medium'>{publicData.totalSponsorsRemaining} spots left</CardTitle>
                    </div>
                    <p className='text-sm'>Get your logo applied to all over our merch and on the store front.</p>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-row justify-between items-center'>
                        <p className='text-sm'>Total sponsors</p>
                        <p className='text-sm font-bold'>{publicData.totalSponsors}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className='w-full'>Become a sponsor</Button>
                </CardFooter>
            </Card>
            <Card className='mt-2'>
                <CardHeader>
                    <div className='flex flex-row justify-between space-y-0'>
                        <CardTitle className='text-xl font-bold'>Collaborators</CardTitle>
                        <CardTitle className='text-xl font-medium'>{publicData.totalCollaboratorsRemain} spots left</CardTitle>
                    </div>
                    <p className='text-sm'>Offer your services at this event. Get exposure to your brand for free.</p>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-row justify-between items-center'>
                        <p className='text-sm'>Total Collaborators</p>
                        <p className='text-sm font-bold'>{publicData.totalCollaborators}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <RequestCollaborationDialog></RequestCollaborationDialog>
                </CardFooter>
            </Card>
        </div>
        
    )
}

export default SupportColumnPublicView