<p align="center">
  <img src="public/logo.svg" alt="Capo Logo" width="400" />
</p>

<p align="center">
  <strong>A modern web app for creating and sharing song setlists with ChordPro support</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#chordpro-support">ChordPro Support</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#usage">Usage</a>
</p>

---

## Features

### Core Features
- 🎵 **Drag-and-Drop Setlists** - Easily organize your favorite songs and build setlists for events or jam sessions
- 👥 **Real-time Collaboration** - Share your library and playlists with friends
- 🔍 **Search & Filter** - Quickly find songs by title or artist
- 📱 **PWA Support** - Install as a native app on any device

### ChordPro Features
- 📝 **ChordPro Format Support** - Add lyrics with embedded chords using the standard ChordPro notation
- 🎸 **Chord Rendering** - Chords are beautifully displayed above the corresponding lyrics
- 🔄 **Key Transposition** - Transpose songs to any key with a single click
- 🎯 **Capo Support** - Adjust chord display based on capo position

---

## ChordPro Support

Capo supports the [ChordPro](https://www.chordpro.org/) format for lyrics with embedded chords. This allows you to:

### Adding Chords to Lyrics
Simply wrap chord names in square brackets within your lyrics:

```
[G]Amazing [D]grace, how [Em]sweet the [C]sound
That [G]saved a [D]wretch like [G]me
```

### Key Transposition
When viewing a song, use the settings popover to:
- **Transpose to a different key** - Select your target key and all chords update automatically
- **Set capo position** - Adjust the display to account for capo placement

### Example
```
Original Key: G
Target Key: A (transpose up 2 semitones)

Before: [G]Amazing [D]grace
After:  [A]Amazing [E]grace
```

---

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

---

## Usage

### Creating a Song with ChordPro Content

1. Click **Add Song** to open the song form
2. Enter the song title, artist, and key
3. In the **Lyrics (ChordPro format)** field, enter your lyrics with chords:
   ```
   [G]Here is the [C]first line
   [Am]Second line with [D]chords
   ```
4. Click **Save changes**

### Viewing and Transposing Songs

1. Songs with ChordPro content display an **eye icon** (👁)
2. Click the eye icon to open the song preview
3. Use the **Settings** button to:
   - Select a target key for transposition
   - Set capo position
4. Chords update in real-time as you adjust settings

### Creating Setlists

1. Select songs from your library using the checkboxes
2. Click **Create Playlist** to add them to a new setlist
3. Drag and drop to reorder songs within the setlist
4. Share setlists with others using the share feature

---

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **ChordPro Parsing**: [chordsheetjs](https://github.com/martijnversluis/ChordSheetJS)
- **UI Components**: Radix UI, Lucide Icons

---

## License

This project is open source and available under the [MIT License](LICENSE).
