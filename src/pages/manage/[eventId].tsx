import { useRouter } from 'next/router';
import React from 'react';

const ManageEvent: React.FC = () => {
    const router = useRouter();
    const { eventId } = router.query; // Access the dynamic segment

    return (
        <div>Managing this event: {eventId}</div>
    )
}

export default ManageEvent