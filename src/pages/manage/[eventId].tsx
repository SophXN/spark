import { useRouter } from 'next/router';
import React from 'react';
import Navbar from '~/components/Navbar';
import { BreadcrumbManageCollaborators } from '~/components/ManageCollaborators/BreadcrumbManageCollaborators';
import Tabs from '~/components/ManageCollaborators/Tabs';
import { type RequestCardInfo, RequestStatus } from '~/types/types';
import { ServiceType } from '@prisma/client';

const arrayOfRequests: RequestCardInfo[] = [
    { organizerAddress: '3294 Berkin st', organizerName: 'Landon Co', helpingCategory: ServiceType.FOOD, message: "A lovely message from the collaborator about how much they want to help", requestId: "123123", status: RequestStatus.denied },
    { organizerAddress: '499 francis grove', organizerName: 'Landon Co', helpingCategory: ServiceType.ART, message: "A lovely message from the collaborator about how much they want to help", requestId: "123653", status: RequestStatus.pending },
    { organizerAddress: 'CTown markets', organizerName: 'Landon Co', helpingCategory: ServiceType.SPACE, message: "A lovely message from the collaborator about how much they want to help", requestId: "198823", status: RequestStatus.pending },
    { organizerEmail: "landonvagohughes@gmail.com", organizerAddress: 'CTown markets', organizerName: 'Landon Co', helpingCategory: ServiceType.OTHER, message: "A lovely message from the collaborator about how much they want to help", requestId: "198823", status: RequestStatus.accepted }
]

const ManageEvent: React.FC = () => {
    const router = useRouter();
    const { eventId } = router.query; // Access the dynamic segment
    const eventName = "Larry's Event";

    return (
        <div>
            <Navbar/>
            <div className="mx-auto max-w-5xl px-3">
                <div className='mt-3'>
                    <BreadcrumbManageCollaborators name={eventName} id={eventId as string}/>
                </div>
                <div className="mt-2 text-3xl font-semibold">Manage Collaborators</div>
                <Tabs requests={arrayOfRequests}/>
            </div>
        </div>
    )
}

export default ManageEvent