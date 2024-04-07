export type ServiceType =
  | "FOOD"
  | "MUSIC"
  | "ART"
  | "DESIGN"
  | "SPACE"
  | "OTHER";

export enum EventType {
  POPUP = "POPUP",
  CONFERENCE = "CONFERENCE",
  CONCERT = "CONCERT",
  DINNER = "DINNER",
  GALA = "GALA",
  FAIR = "FAIR",
  COMPETITION = "COMPETITION",
  CHARITY = "CHARITY",
  NETWORKING = "NETWORKING",
  CELEBRATION = "CELEBRATION",
  OTHER = "OTHER",
}

export interface SquareEvent {
  id: string;
  image: string;
  eventId: string;
  requester: Company; // Assuming you have an interface for `Company`
  requesterId: string;
  title: string;
  description: string;
  eventDate: Date; // In TypeScript, dates are represented with the `Date` type
  eventLocation: string;
  createdOn: Date;
  eventType: EventType; // Assuming you have an enum or type for `EventType`
  sponsors: Sponsor[]; // Assuming you have an interface for `Sponsor`
  collaborators: Collaborator[]; // Assuming you have an interface for `Collaborator`
}

// You would also need to define the other interfaces/enums if they are not defined yet.

export interface Company {
  id: string;
  name: string;
  industry: string;
  eventRequests: SquareEvent[]; // Assuming you have an interface for `EventRequest`
  sponsorships: Sponsor[]; // Assuming you have an interface for `Sponsor`
  collaboratorResponses: CollaboratorResponse[]; // Assuming you have an interface for `CollaboratorResponse`
}

export enum Tier {
  ONE = "ONE",
  TWO = "TWO",
  THREE = "THREE"
}

export interface Sponsor {
  id: string;
  eventRequest: SquareEvent; // Assuming `EventRequest` is defined elsewhere as provided previously
  eventRequestId: string;
  tier: Tier;
  description: string;
  sponsorsRequired: number;
  amountPerSponsor: number;
  responders: Company[]; // Assuming you have an interface for `Company`
}

export interface Collaborator {
  id: string;
  eventRequest: SquareEvent; // Assuming `EventRequest` is defined elsewhere as provided previously
  eventRequestId: string;
  serviceType: ServiceType;
  description: string;
  collaboratorsRequired: number;
  responses: CollaboratorResponse[]; // Assuming you will define `CollaboratorResponse` as below
}

export interface CollaboratorResponse {
  id: string;
  collaborator: Collaborator; // Assuming `Collaborator` is defined above
  collaboratorId: string;
  responder: Company; // Assuming you have an interface for `Company`
  responderId: string;
  isAccepted: boolean;
  responseMessage?: string; // The question mark indicates that this field is optional
  respondedOn: Date;
}


export interface EventsListProps {
  events: SquareEvent[];
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