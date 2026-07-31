export interface StorageObjectMetadata {
  key: string;
  size?: number;
  contentType?: string;
}

export interface SignedUrlResult {
  url: string;
  expiresInSeconds: number;
}

export interface StorageProvider {
  readonly name: "local" | "supabase";
  upload(input: {
    key: string;
    body: Buffer;
    contentType: string;
  }): Promise<void>;
  delete(key: string): Promise<void>;
  createSignedDownloadUrl(key: string, expiresInSeconds: number): Promise<SignedUrlResult>;
  exists(key: string): Promise<boolean>;
  getMetadata(key: string): Promise<StorageObjectMetadata | null>;
  /** Local streaming helper; Supabase returns null and uses signed URLs instead. */
  resolveLocalAbsolutePath?(key: string): string | null;
}
