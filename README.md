# Modern React Login with Auth0

A beautiful, modern login page built with React, TypeScript, Tailwind CSS, and Auth0 authentication.

## Features

- Modern, responsive UI with gradient designs
- Secure authentication powered by Auth0
- TypeScript for type safety
- Tailwind CSS for styling
- Protected routes
- User profile dashboard
- Fast development with Vite

## Prerequisites

- Node.js (v18 or higher)
- An Auth0 account (free tier available at [auth0.com](https://auth0.com))

## Auth0 Setup

1. Go to [Auth0](https://auth0.com) and create a free account
2. Create a new application:
   - Click "Applications" in the sidebar
   - Click "Create Application"
   - Choose "Single Page Web Applications"
   - Select "React" as the technology
3. Configure your application settings:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
4. Save your changes
5. Note down your:
   - Domain (e.g., `your-domain.auth0.com`)
   - Client ID

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

3. Update the `.env` file with your Auth0 credentials:

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_CALLBACK_URL=http://localhost:5173
```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
login/
├── src/
│   ├── auth/
│   │   ├── auth0-config.ts       # Auth0 configuration
│   │   └── ProtectedRoute.tsx    # Route protection component
│   ├── pages/
│   │   ├── Login.tsx             # Login page
│   │   └── Dashboard.tsx         # Protected dashboard
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   ├── index.css                 # Global styles
│   └── vite-env.d.ts            # TypeScript declarations
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── .env                          # Environment variables (create this)
```

## How It Works

1. **Login Flow**:
   - User visits the login page
   - Clicks "Sign in with Auth0"
   - Redirected to Auth0's Universal Login
   - After authentication, redirected back to the app
   - Automatically navigated to the dashboard

2. **Protected Routes**:
   - Dashboard is wrapped in `ProtectedRoute`
   - Unauthenticated users are redirected to login
   - Authentication state is managed by Auth0 React SDK

3. **Logout**:
   - Click "Logout" in the dashboard
   - Cleared from Auth0 session
   - Redirected back to login page

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Auth0 React SDK** - Authentication
- **React Router** - Client-side routing

## Customization

### Styling

The app uses Tailwind CSS. You can customize:
- Colors in [tailwind.config.js](tailwind.config.js)
- Global styles in [src/index.css](src/index.css)
- Component styles in their respective files

### Auth0 Features

You can add more Auth0 features:
- Social login providers (Google, Facebook, etc.)
- Multi-factor authentication (MFA)
- Password reset flows
- User roles and permissions

## Troubleshooting

### "Invalid state" error
- Check that your callback URLs match exactly in Auth0 dashboard
- Make sure `.env` file has correct values

### Redirect loop
- Verify Auth0 domain and client ID are correct
- Check browser console for errors

### Build errors
- Delete `node_modules` and run `npm install` again
- Clear Vite cache: `rm -rf node_modules/.vite`

## License

MIT

## Support

For Auth0 documentation, visit: [auth0.com/docs](https://auth0.com/docs)

For Vite documentation, visit: [vitejs.dev](https://vitejs.dev)
