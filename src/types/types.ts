<<<<<<< HEAD
import {
  type ServiceType,
  type EventRequest,
  type Collaborator,
  type Sponsor,
  type Company,
  type CollaboratorResponse,
} from "@prisma/client";
=======
import { type ServiceType, type EventRequest, type Collaborator, type Sponsor, type Company, type CollaboratorResponse } from "@prisma/client";
>>>>>>> 1259f7557c0141c4563e048d0f13d51a002734f9

export interface EventSponsorsAndCollaboratorProps {
  eventId: string;
  isReadyToSubmit: boolean;
}

export enum Tier {
  ONE = "ONE",
  TWO = "TWO",
  THREE = "THREE",
}

interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User; // Assuming `User` is defined below
}

interface User {
  id: string;
  firstName?: string | null; // `null` is included because the field is optional in Prisma
  lastName?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  companyId?: string | null;
  accounts: Account[]; // Assuming you have an interface for `Account`
  sessions: Session[];
}

interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null; // `Int` in Prisma translates to `number` in TypeScript
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  user: User; // Assuming `User` is defined elsewhere as provided previously
}

export enum RequestStatus {
  accepted = "ACCEPTED",
  pending = "PENDING",
  denied = "DENIED",
}

export interface RequestCardInfo {
  organizerName: string;
  organizerAddress: string;
  organizerEmail?: string;
  helpingCategory: ServiceType;
  message: string;
  requestId: string;
  status: RequestStatus;
}

export interface RequestCardInfoArray {
  infoCards: RequestCardInfo[];
}

<<<<<<< HEAD
export interface HomePageEventDetails {
  eventId: string;
  eventBannerImage?: string;
  organizerId: string;
  organizerCompanyName: string;
  eventTitle: string;
  eventDescription: string;
  location: string;
  eventDate: string;
  totalSponsorsNeeded: number;
  totalCollaboratorsNeeded: number;
  totalSponsorsRemaining: number;
  totalCollaboratorsRemain: number;
}

export interface EventPageDetails extends HomePageEventDetails {
  totalSponsors: number;
  totalAmountRaised: number; // by sponsors
  totalCollaborators: number;
  collaboratorServiceTypesNeeded: ServiceType[];
  totalCollaboratorRequests: number;
  percentageRaised: number;
  percentageCollaborators: number;
}

export type HomePageResponse = EventRequest & {
  _count: {
    sponsors: number;
    collaborators: number;
  };
  collaborators: Collaborator[];
  sponsors: Sponsor[];
  requester: Company;
};

export type CollaboratorResponseExtended = EventRequest & {
  collaborators: Collaborator[];
  requester: Company;
  collaboratorsResponses: CollaboratorResponse[];
};
=======
export type HomePageResponse = EventRequest & {
  _count?: {
    collaboratorsResponses: number
  },
  collaborators: Collaborator[],
  collaboratorsResponses?: CollaboratorResponse[],
  sponsors: Sponsor[],
  requester: Company
}
>>>>>>> 1259f7557c0141c4563e048d0f13d51a002734f9
