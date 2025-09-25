export interface middlewareShape {
  _id: string;
  role: "listner" | "artist" | "admin";
  iat: number;
  exp: number;
}

export interface ICourseImage {
  public_id: string;
  url: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "listner" | "artist" | "admin";
  profilePicture?: ICourseImage;
  gooleavatar?: string;
  faceBookavatar?: string;
  isVerified: boolean;
  isDeleted: boolean;
  subscription: Subscription;
  subscriptionStatus: "Free" | "Standard" | "Pro" | "Premium";
  subscribed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  _id: string;
  title: string;
  artistName: string;
  imageUrl: {
    publicId: string;
    url: string;
  };
  songs: string[];
  artistId: string;
  isPublished: boolean;
  isDeleted: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Song {
  _id: string;
  title: string;
  imageUrl: {
    publicId: string;
    url: string;
  };
  audioUrl: {
    publicId: string;
    url: string;
  };
  duration: number;
  albumId: string;
  artistId: string;
  artist: User;
  liked: string[];
  listners: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SingleAlbum {
  _id: string;
  title: string;
  artistName: string;
  imageUrl: {
    publicId: string;
    url: string;
  };
  songs: Song[];
  artistId: User;
  isPublished: boolean;
  isDeleted: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface LikeSong {
  _id: string;
  songId: string;
  userId: string;
  song: Song;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  _id: string;
  title: string;
  userId: string;
  imageUrl: {
    publicId: string;
    url: string;
  };
  songs: Song[];
  isDeleted: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubscriptionPlan {
  _id: string;
  planName: string;
  price: number;
  duration: string;
  features: string[];
  isDeleted: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Subscription {
  _id: string;
  plan: "Standard" | "Pro" | "Premium";
  price: 199 | 399 | 499;
  duration: "3 months" | "6 months" | "12 months";
  expitreDate: Date;
  status: "pending" | "success" | "failed" | "expired";
  createdAt: string;
  updatedAt: string;
}

export interface Dashboard {
  totalAlbums: number;
  totalSongs: number;
  totalListensCount: number;
  totalLikedSongCount: number;
}
