import { type ServiceType, type EventRequest, type Collaborator, type Sponsor, type Company, type CollaboratorResponse } from "@prisma/client";

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
  denied = "DENIED"
}

export interface RequestCardInfo {
  organizerName: string,
  organizerAddress: string,
  organizerEmail?: string,
  helpingCategory: ServiceType,
  message: string,
  requestId: string
  status: RequestStatus
}

export interface RequestCardInfoArray {
  infoCards: RequestCardInfo[]
}

export type HomePageResponse = EventRequest & {
  _count?: {
    collaboratorsResponses: number
  },
  collaborators: Collaborator[],
  collaboratorsResponses?: CollaboratorResponse[],
  sponsors: Sponsor[],
  requester: Company
}