import { api } from "~/utils/api";
import { EventRequest } from "@prisma/client";

interface OrganizerCardProps {
  eventDetails: EventRequest;
}

export default function OrganizerCard({ eventDetails }: OrganizerCardProps) {
  const { data: organizerData } =
    api.company.getCompany.useQuery(eventDetails.requesterId);

  if (!organizerData) return "Loading...";
  console.log(organizerData);
  return (
    <div className="relative mt-2 flex items-center space-x-2 rounded-lg bg-slate-100 px-6 py-3">
      <div className="flex-shrink-0">
        <img
          className="h-12 w-12 rounded-full"
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
      </div>
      <div className="min-w-0 flex-1">
        <a>
          <span className="absolute inset-0" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-900">
            {organizerData.name}
          </p>
          <p className="truncate text-sm text-gray-500">
            {organizerData.address}
          </p>
        </a>
      </div>
    </div>
  );
}
