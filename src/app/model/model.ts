export interface FileObjectDto {
  fileName: string;
  contentType: string;
  countPart: number;
  sizeBytes: number;
}

export interface UploadSessionDto {
  sessionId: string | null;
  fileList: FileObjectDto[];
}

export interface PresignedUrlDto {
  partNumber: number;
  presignedUrl: string;
}

export interface InitiateUploadDto {
  fileId: string | null;
  uploadId: string;
  objectName: string;
  presignedUrlList: PresignedUrlDto[];
}

export interface UploadSessionResponse {
  sessionId: string;
  initiateUploadList: InitiateUploadDto[];
}

export interface PartInfo {
  partNumber: number;
  etag: string;
}

export interface CompleteUploadRequest {
  fileId: string | null;
  objectName: string;
  uploadId: string;
  parts: PartInfo[];
}

export interface CompleteUploadListRequest {
  sessionId: string;
  uploadList: CompleteUploadRequest[];
}
