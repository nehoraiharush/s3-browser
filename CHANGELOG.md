# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.2.0] - 2026-02-12

### Added

- **Local S3 Support**: Added a local S3 server (`s3rver`) with a custom Proxy to handle CORS and development testing without an AWS account.
- **Data Seeding**: The local S3 server now automatically seeds test data (images, logs, configs) on startup.
- **Auto-Load Search**: File Search now automatically loads files when a bucket is opened.
- **Download UX**: Improved file downloads to be instant and seamless (no new tab flicker) using pre-signed URLs with `ResponseContentDisposition`.
- **Docs**: Added `LOCAL_S3_SETUP.md` guide for running the local environment.

## [0.1.0] - 2026-02-12

### Added

- **File Search**: Efficiently search for files in S3 buckets using prefix matching.
- **File Download**: Added ability to download files directly from search results using presigned URLs.
- **UI Improvements**:
  - Display file size and last modified date.
  - specialized icons for search and download actions.
