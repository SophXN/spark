import { useRouter } from 'next/router';
import Navbar from '~/components/Navbar';

const EventDetails = () => {
    const router = useRouter();
    const { eventId } = router.query; // Access the dynamic segment

    return (
        <div>
            <Navbar></Navbar>
            
        </div>
    );
};

export default EventDetails;