import { useRouter } from 'next/router';
import React from 'react';
import Navbar from '~/components/Navbar';
import { BreadcrumbManageCollaborators } from '~/components/BreadcrumbManageCollaborators';
import Tabs from '~/components/Tabs';

const ManageEvent: React.FC = () => {
    const router = useRouter();
    const { eventId } = router.query; // Access the dynamic segment
    const eventName = "Larry's Event";

    return (
        <div>
            <Navbar/>
            <div className="mx-auto max-w-7xl px-3">
                <div className='mt-3'>
                    <BreadcrumbManageCollaborators name={eventName} id={eventId as string}/>
                </div>
                <div className="mt-2 text-3xl font-semibold">Manage Collaborators</div>
                <Tabs/>
            </div>
        </div>
    )
}

export default ManageEvent