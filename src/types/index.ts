export interface LocationDto {
  locationId: number;
  nameEn: string;
  nameKo: string;
  address: string;
  addressEng?: string;
  lat?: number;
  lng?: number;
  colorCode?: string;
  sortOrder?: number;
  rating?: number;
  reviewCount?: number;
}

export interface PerformanceDto {
  performanceId: number;
  organizer?: number;
  title: string;
  songList?: string;
  promoUrl?: string;
  performanceDatetime: string;
  requiredPositions?: string;
  status?: string;
  chatUrl?: string;
  locationId?: number;
  participants?: PerformanceParticipantDto[];
}

export interface PerformanceParticipantDto {
  participantId: number;
  performanceId: number;
  userId: number;
  position: string;
  status: string;
}

export interface PostDto {
  postId: number;
  userId?: number;
  authorName?: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export type PostCategory = 'GENERAL' | 'RECRUIT' | 'REVIEW';
