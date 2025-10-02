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

    PRESIGNED_URLS_LIST: 'pb/minio/initiate-presigned-url',
    COMPLETE_UPLOAD_LIST: 'pb/minio/complete',
  },
  CK: {
    FILL_TEMPLETE: 'pb/ck/html/fill',
  },
  PUPPETEER: {
    CONVERT: 'convert-html-to-pdf',
  },
};
