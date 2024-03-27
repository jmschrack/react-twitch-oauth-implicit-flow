This works by opening the twitch OAuth page in a new window.  Which then redirects to your twitch-callback page.  This passes the Implicit OAuth token back to the original page.
The url generated has a random string passed as the state, and the Twitch Callback checks the session storage to make sure this matches before calling back.

# Quick Setup

Create a new page with the URL  `/twitch-callback`  and add the `<TwitchCallbackPage />` component to it.  

For example, if you are using react-router-dom, it might look something like this:

```
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { TwitchCallbackPage } from '../lib/components.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/twitch-callback",
    element: <TwitchCallbackPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

```

On your main page (or whever you want the login button), add the `<TwitchSignIn />` component with your clientID and redirectURI. There is an optional `onSignIn` callback that will be passed true when the user signs in, and false when they sign out.   The twitchOAuth token will be saved to sessionStorage  along with the twitchUsername  

# Custom setup

To have more control over the process, use the `<TwitchButton />`  component instead in conjunction with the `useTwitchOAuth` hook with its `onOAuth` callback which will receive the token  as the parameter. The token still gets saved to sessionStorage.  To handle signing out, just clear the sessionStorage.  

To customize the redirect page, just make your own, and call the `useTwitchCallback`  hook.  This will automatically grab the OAuth token from the URL, and post a message back to the opening window, and then attempt to close itself.

