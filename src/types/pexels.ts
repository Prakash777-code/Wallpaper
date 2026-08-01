export interface PexelsPhoto {
  id: number;
  photographer: string;
  src: {
    large: string;
    portrait: string;
    original: string;
  };
}

export interface PexelsResponse {
  photos: PexelsPhoto[];
}

export interface PexelsBackendResponse{
  wallpaperId:number,
  imageUrl:string,
  photographer:string
}