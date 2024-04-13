// agg mult tprc calls for FE and return 
/*
export interface EventPageDetails {
  eventId: string,
  eventBannerImage?: string,
  organizerId: string,
  organizerCompanyName: string,
  eventTitle: string,
  eventDescription: string,
  location: string,
  time: string,
  collaboratorServiceTypesNeeded: ServiceType[],
  totalSponsors?: number,
  totalSponsorsRemaining?: number,
  totalAmountRaised?: number,
  totalCollaborators?: number,
  totalCollaboratorsRemain?: number,
  totalCollaboratorRequests?: number,
  percentageRaised?: number,
  percentageCollaborators?: number,
  isHost: boolean
}
*/

// export const getEventPageDetails = async (eventId: string): Promise<EventPageDetails> => {
//     const event = await getEvent(eventId);
//     const totalSponsors = await getTotalSponsors(eventId);
//     const totalSponsorsRemaining = await getTotalSponsorsRemaining(eventId);
//     const totalAmountRaised = await getTotalAmountRaised(eventId);
//     const totalCollaborators = await getTotalCollaborators(eventId);
//     const totalCollaboratorsRemain = await getTotalCollaboratorsRemain(eventId);
//     const totalCollaboratorRequests = await getTotalCollaboratorRequests(eventId);
//     const percentageRaised = await getPercentageRaised(eventId);
//     const percentageCollaborators = await getPercentageCollaborators(eventId);
    
//     return {
//         eventId: event.eventId,
//         eventBannerImage: event.eventBannerImage,
//         organizerId: event.organizerId,
//         organizerCompanyName: event.organizerCompanyName,
//         eventTitle: event.eventTitle,
//         eventDescription: event.eventDescription,
//         location: event.location,
//         time: event.time,
//         collaboratorServiceTypesNeeded: event.collaboratorServiceTypesNeeded,
//         totalSponsors,
//         totalSponsorsRemaining,
//         totalAmountRaised,
//         totalCollaborators,
//         totalCollaboratorsRemain,
//         totalCollaboratorRequests,
//         percentageRaised,
//         percentageCollaborators,
//         isHost: event.isHost
//     };
//     }
