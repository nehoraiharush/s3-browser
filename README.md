
# S3 Browser

A fast, modern desktop application for browsing and searching AWS S3 buckets.

## Why this exists

Searching for files in S3 buckets with millions of objects can be slow and cumbersome. Standard tools often try to list everything or have clunky interfaces. 

**S3 Browser** solves this by:
*   **Prefix-based Search**: Leveraging S3's efficient prefix search to find files instantly without listing the entire bucket.
*   **On-demand Loading**: Only fetching what you need.
*   **Modern UI**: Built with React and Material UI for a smooth, responsive experience.

## Features

*   **Fast Search**: Quickly find files by their prefix (folder structure/filename start).
*   **Secure Downloads**: Download files directly to your machine using secure presigned URLs.
*   **Multiple Accounts**: (In progress) Manage multiple AWS accounts/profiles.

## technologies

*   **Frontend**: React 19, Vite, TypeScript
*   **UI Framework**: Material UI (MUI) v5
*   **AWS Integration**: AWS SDK for JavaScript v3

## Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
