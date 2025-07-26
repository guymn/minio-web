// src/app/constants/api-path.ts
export const API_PATH = {
  MINIO: {
    UPLOAD: 'minio/upload',
    PRESIGNED_DOWNLOAD: 'minio/presigned-download',
    INITIATE_UPLOAD_ID: 'minio/presigned-multipart/initiate',
    PRESIGNED_URLS: 'minio/presigned-multipart/presigned-urls',
    PRESIGNED_URL: 'minio/presigned-multipart/presigned-url',
    COMPLETE_MULTIPART_UPLOAD: 'minio/presigned-multipart/complete',
    ABORT_MULTIPART_UPLOAD: 'minio/presigned-multipart/abort',
    INFO_MULTIPART_UPLOAD: 'minio/presigned-multipart/info',
    LIST_ACTIVE_UPLOAD: 'minio/presigned-multipart/active',
  },
};
