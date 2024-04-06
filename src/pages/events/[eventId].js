import { useRouter } from 'next/router';

const EventDetails = () => {
  const router = useRouter();
  const { eventId } = router.query; // Access the dynamic segment

  return (
    <div>
      <h1>Event Details</h1>
      <p>You are viewing details for event ID: {eventId}</p>
    </div>
  );
};

export default EventDetails;