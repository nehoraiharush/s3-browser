# Local S3 Setup Guide

This project includes a local S3 server (`s3rver`) to help you test the application without needing a real AWS account or Docker.

## 1. Start the Local S3 Server

Open a **separate terminal** (keep your main app terminal running) and run:

```bash
npm run s3
```

You should see output indicating the **Local S3 Proxy** is running at `http://localhost:4568`.

> **Note:** This script starts two processes:
>
> 1.  An internal S3 server (s3rver) on port `4569`.
> 2.  A public Proxy server on port `4568` that handles CORS (access permissions) for your app.
>     **Always use port 4568.**

> **Note:** This server stores data in the `s3-data/` folder in your project. It automatically creates a bucket named `demo-bucket`.

## 2. Connect the App

1.  Open the S3 Browser App in your browser (usually `http://localhost:5173`).
2.  In the left sidebar, click **"Add Account"**.
3.  Fill in the details as follows:
    - **Account Name**: `Local Demo` (or anything you like)
    - **Access Key ID**: `S3RVER`
    - **Secret Access Key**: `S3RVER`
    - **Region**: `us-east-1`
    - **Endpoint URL**: `http://localhost:4568`
4.  Click **"Add Account"**.

## 3. Verify Connection

1.  Click on the **"Local Demo"** account in the sidebar to select it.
2.  You should see `demo-bucket` listed in the main view.
3.  Click on `demo-bucket` to browse its contents (it will be empty initially).

## Troubleshooting

- **Connection Refused**: Ensure `npm run s3` is still running in the background terminal.
- **CORS Errors**: Ensure the `s3-mock/cors.xml` file exists and is correctly configured (the setup script should have created this).
- **EADDRINUSE Error**: If you see an error about the address being in use, you likely have an old instance of the server running. **Stop it** (Ctrl+C in the terminal running `npm run s3`) and try again.

## 4. How to Add Files

Since `s3rver` runs locally, "uploading" files is as simple as copying them into a folder!

1.  Open the folder `s3-browser/s3-data/demo-bucket` in your file explorer.
2.  Copy and paste any files you want (images, documents, etc.) into this folder.
3.  Refresh the bucket in the S3 Browser App to see them appear.

I have already created `hello.txt` and `config.json` in this folder for you to test with.
