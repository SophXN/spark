import { api } from "~/utils/api";
import { type EventRequest } from "@prisma/client";
import Image from "next/image";

interface OrganizerCardProps {
  eventDetails: EventRequest;
}

export default function OrganizerCard({ eventDetails }: OrganizerCardProps) {
  const { data: organizerData } = api.company.getCompany.useQuery(
    eventDetails.requesterId,
  );

  if (!organizerData) return "Loading...";
  return (
    <div className="relative mt-2 flex items-center space-x-2 rounded-lg bg-slate-100 px-6 py-3">
      <div>
        {organizerData.profilePicture ? (
          <div>
            <Image
              className="h-5 w-5 object-cover rounded-full"
              src={organizerData.profilePicture}
              alt="Business Logo"
              width="100"
              height="100"
              layout="fixed"
            />
          </div>
        ) : (
          <div className="h-5 w-5">
            <span className="inline-block h-5 w-5 overflow-hidden rounded-full bg-gray-100">
              <svg
                className="h-full w-full text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
          </div>
        )}
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
