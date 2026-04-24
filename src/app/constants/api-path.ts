// src/app/constants/api-path.ts
export const API_PATH = {
  MINIO: {
    INITIATE_UPLOAD_ID: 'minio/presigned-multipart/initiate',
    PRESIGNED_URLS: 'minio/presigned-multipart/presigned-urls',
    COMPLETE_MULTIPART_UPLOAD: 'minio/presigned-multipart/complete',
    ABORT_MULTIPART_UPLOAD: 'minio/presigned-multipart/abort',
    INFO_MULTIPART_UPLOAD: 'minio/presigned-multipart/info',
    LIST_ACTIVE_UPLOAD: 'minio/presigned-multipart/active',

    PRESIGNED_URLS_LIST: 'pb/minio/initiate-presigned-url',
    COMPLETE_UPLOAD_LIST: 'pb/minio/complete',
    COMPLETE_UPLOAD_LIST_ASYN: 'pb/minio/complete-async',
    LIST: 'pb/minio/get-list',
    STEAM_DOWNLOAD: 'pb/minio/presignd-url/download-steam-file-by-id',
    DOWNLOAD_BY_ID: 'pb/minio/presignd-url/download-by-id',
  },
  CK: {
    FILL_TEMPLETE: 'pb/ck/html/fill',
  },
  PUPPETEER: {
    CONVERT: 'convert-html-to-pdf',
  },
};
