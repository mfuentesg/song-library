# Song Library

Song Library is a simple drag-and-drop application that lets you create and share song setlists with your friends. Easily organize your favorite songs, build setlists for events or jam sessions, and collaborate with others in real time.

## Getting Started

These instructions will help you set up the project for local development using Supabase as the backend.

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (comes with Node.js)
- Docker (for running Supabase locally)

### Setting up Supabase locally

1. **Clone the repository**
   ```sh
   git clone https://github.com/mfuentesg/song-library.git
   cd song-library
   ```

2. **Start Supabase locally**
   - Start Supabase using Docker (no global install needed):
     ```sh
     npx supabase@latest start
     ```
   - This will spin up a local Supabase instance at `http://localhost:54321` (API) and `http://localhost:54322` (Studio).

3. **Configure environment variables**
   - Create a `.env` file in the root directory and add the environment variables provided by Supabase:
     ```
     SUPABASE_URL=http://localhost:54321
     SUPABASE_ANON_KEY=your-local-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
     ```
   - You can find these keys in the output of `npx supabase@latest info` or in the generated `supabase/.env` file.

4. **Install dependencies**
   ```sh
   npm install
   ```

5. **Run the application**
   ```sh
   npm run dev
   ```
   The app should now be running locally, connected to your local Supabase backend.
