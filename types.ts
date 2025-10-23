
export interface CivitaiImage {
  url: string;
  nsfw: string; // API can return different strings, not just boolean
  width: number;
  height: number;
  hash: string;
}

export interface CivitaiModelVersion {
  id: number;
  name: string;
  images: CivitaiImage[];
}

export interface CivitaiModel {
  id: number;
  name: string;
  description: string | null;
  type: string;
  creator: {
    username: string;
  };
  modelVersions: CivitaiModelVersion[];
}

export interface CivitaiApiResponse {
  items: CivitaiModel[];
  metadata: object;
}
