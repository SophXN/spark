import { CalendarIcon, Globe } from "lucide-react";

interface EventLocationAndDateProps {
  eventDate: string;
  eventLocation: string;
}

export default function EventLocationAndDate({
  eventDate,
  eventLocation,
}: EventLocationAndDateProps) {
  return (
    <div className="pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="mb-2 flex items-center space-x-2 sm:mb-0 sm:mr-10">
          <CalendarIcon className="text-slate-800" />
          <div className="text-left">
            <h3 className="text-md font-semibold">Date and time</h3>
            <p className="text-sm text-gray-600 text-muted-foreground">
              {eventDate}
            </p>
          </div>
        </div>
        <div className="h-2 w-full self-center border-t border-gray-200 sm:w-10 sm:border-0 sm:border-l" />
        <div className="flex items-center space-x-2">
          <Globe className="text-slate-800" />
          <div className="text-left">
            <h3 className="text-md font-semibold">Location</h3>
            <p className="text-sm text-gray-600 text-muted-foreground">
              {eventLocation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
