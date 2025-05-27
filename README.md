# Purr Planning Poker

A cat-themed planning poker app built with React, Vite, Firebase, and Tailwind CSS.

Demo: [https://purr-planning.netlify.app/](https://purr-planning.netlify.app/)

## Features

- Real-time voting and chat using Firebase Firestore
- Anonymous authentication
- Emoji reactions and custom avatars
- Sound effects (toggleable)
- Responsive UI with dark mode
- Room-based sessions (shareable URLs)

## Getting Started

### 1. Fork & Clone

```sh
git clone https://github.com/YOUR_USERNAME/purr-planning.git
cd purr-planning
```

### 2. Install Dependencies

```sh
npm install
```
or
```sh
yarn
```

### 3. Firebase Setup

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
- Enable **Firestore** and **Anonymous Authentication**.
- Copy your Firebase config values.

#### Add a `.env` file in the project root:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Do not commit your `.env` file.**

### 4. Run Locally

```sh
npm run dev
```
or
```sh
yarn dev
```

Visit [http://localhost:5173](http://localhost:5173) (or the port Vite shows).

### 5. Build for Production

```sh
npm run build
```
or
```sh
yarn build
```

### 6. Deploying (Netlify Recommended)

- Set the **build command** to `npm run build`
- Set the **publish directory** to `dist`
- Add all your `.env` variables in Netlify's environment variables settings
- Add a `public/_redirects` file with:
  ```
  /*    /index.html   200
  ```

## Folder Structure

```
src/
  components/      # React components
  context/         # React context providers (Game, Theme, Sound)
  utils/           # Utility functions
  firebaseConfig.ts# Firebase initialization
  App.tsx          # Main app
public/
  _redirects       # Netlify redirects for SPA routing
```

## Notes

- All users in a room see real-time updates.
- If you visit a room directly, you'll be prompted for a username.
- Sound is off by default; toggle it in the header.
- For customizations, see the `src/context` and `src/components` folders.

## License

MIT

---

**Happy herding! 🐾**