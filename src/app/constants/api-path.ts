// src/app/constants/api-path.ts
export const API_PATH = {
  MINIO: {
    PRESIGNED_DOWNLOAD: 'minio/presignd-url/download',
    LIST: 'minio/list',
    INITIATE_UPLOAD_ID: 'minio/presigned-multipart/initiate',
    PRESIGNED_URLS: 'minio/presigned-multipart/presigned-urls',
    COMPLETE_MULTIPART_UPLOAD: 'minio/presigned-multipart/complete',
    ABORT_MULTIPART_UPLOAD: 'minio/presigned-multipart/abort',
    INFO_MULTIPART_UPLOAD: 'minio/presigned-multipart/info',
    LIST_ACTIVE_UPLOAD: 'minio/presigned-multipart/active',
  },
  PUPPETEER: {
    CONVERT: 'convert-html-to-pdf'
  }
};
