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

interface SquareEvent {
  id: string; // Assuming id is a string, adjust type as necessary
  image: string;
}

export interface EventsListProps {
  events: SquareEvent[];
}