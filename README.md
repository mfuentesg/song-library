# Song Library

## Overview

Song Library is a simple drag-and-drop application designed for sharing songs and setlists with friends. It allows users to easily organize their favorite music and collaborate on playlists in a user-friendly interface.

## Tech Stack

The project is built with the following technologies:

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Supabase
- **Styling:** Tailwind CSS, Shadcn/ui
- **Deployment:** Cloudflare Pages (inferred from `@cloudflare/next-on-pages` dependency)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** (Latest LTS version recommended, unless a specific version is noted in a `.node-version` file)
- **npm** or **yarn**
- **Supabase CLI**

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd <project-directory>
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
    or if you are using yarn:
    ```bash
    yarn install
    ```

## Supabase Setup

This project uses Supabase for its backend services.

1.  **Install Supabase CLI:**
    If you haven't already, install the Supabase CLI globally:
    ```bash
    npm install -g supabase
    ```
    For more detailed instructions, refer to the [official Supabase documentation](https://supabase.com/docs/guides/cli).

2.  **Login to Supabase:**
    ```bash
    supabase login
    ```
    This will open a browser window for you to authenticate with your Supabase account.

3.  **Link to an existing Supabase project or initialize a new one:**

    *   **Link existing project:** If you have already created a project on the [Supabase dashboard](https://supabase.com/dashboard), link it by running:
        ```bash
        supabase link --project-ref <your-project-id>
        ```
        Replace `<your-project-id>` with your actual Supabase project ID.

    *   **Initialize new project (if starting from scratch locally):**
        ```bash
        supabase init
        ```
        This will create a new `supabase` directory in your project.

4.  **Start Supabase services:**
    To start the local Supabase stack (Postgres database, Kong gateway, GoTrue auth, etc.):
    ```bash
    supabase start
    ```
    Upon successful startup, the CLI will output your local Supabase URL, anon key, and other relevant information.

5.  **Environment Variables:**

    *   Create a new file named `.env.local` in the root of your project by copying the example file:
        ```bash
        cp .env.example .env.local
        ```
    *   Update `.env.local` with the credentials from the `supabase start` output:
        *   `NEXT_PUBLIC_SUPABASE_URL`: Your local Supabase URL (e.g., `http://localhost:54321` or as provided in the `supabase start` output).
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your local Supabase anon key.
    *   **Google OAuth Configuration:**
        The variables `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are required for Google OAuth authentication.
        1.  Obtain these credentials from the [Google Cloud Console](https://console.cloud.google.com/) by setting up an OAuth 2.0 client ID.
        2.  When configuring your Google OAuth client, you'll need to add a redirect URI. This URI should point to your Supabase authentication callback. For local development, it's typically `http://localhost:54321/auth/v1/callback`. For production, it will be `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`.
        3.  Ensure you enable the Google People API for your project in the Google Cloud Console.

6.  **Database Migrations:**

    *   **To apply all migrations and reset your local database (Warning: This will erase all data in your local Supabase database):**
        ```bash
        supabase db reset
        ```
    *   **To apply new migrations (if any have been added since your last update):**
        If new migration files have been added to the `supabase/migrations` directory, apply them by running:
        ```bash
        supabase migration up
        ```
        This command is generally safer for existing data than `db reset`.

7.  **Generate Supabase Types:**
    After any changes to your database schema (e.g., creating tables, adding columns), you should regenerate TypeScript types for Supabase to ensure type safety in your application.
    ```bash
    npm run gen-types
    ```

## Running the Development Server

Once Supabase is set up and your environment variables are configured:

1.  **Start the Next.js development server:**
    ```bash
    npm run dev
    ```
    Or, to run with HTTPS (useful for testing features that require a secure context):
    ```bash
    npm run dev:https
    ```
2.  **Access the application:**
    Open your browser and navigate to `http://localhost:3000` (or `https://localhost:3000` if using HTTPS).

## Available Scripts

This project includes several npm scripts defined in `package.json`:

-   `npm run build`: Builds the application for production deployment. The output will be in the `.next` directory.
-   `npm run start`: Starts a Next.js production server (requires `npm run build` to be run first).
-   `npm run lint`: Runs ESLint to check for code quality and style issues.
-   `npm run gen-types`: Generates TypeScript types from your Supabase schema.

## Deployment

This project appears to be configured for deployment using Cloudflare Pages, as indicated by the `@cloudflare/next-on-pages` dependency in `package.json`.

To deploy, you would typically:
1.  Push your code to a Git repository (e.g., GitHub, GitLab).
2.  Connect your Git repository to Cloudflare Pages.
3.  Configure the build settings in Cloudflare Pages (usually auto-detected for Next.js).
4.  Set up your production environment variables in the Cloudflare Pages dashboard, similar to your `.env.local` file, but pointing to your production Supabase instance. This includes:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `GOOGLE_CLIENT_ID`
    *   `GOOGLE_CLIENT_SECRET`
5.  Remember to update your Google OAuth client's redirect URI in Google Cloud Console to match your production Supabase auth callback URL (e.g., `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`).

Refer to the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/) and the [`@cloudflare/next-on-pages` documentation](https://github.com/cloudflare/next-on-pages) for more detailed deployment instructions.
