import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
/* import { TwitchButton, TwitchIcon, twitchPurple } from '../lib/components'
import { getUserData, useTwitchOAuth } from '../lib/twitch' */
import { TwitchSignIn } from '../lib/main'

const clientId = "YOUR_TWITCH_CLIENT_ID"
const redirectURI = "https://localhost:3000/twitch-callback"

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <TwitchSignIn clientId={clientId} redirectURI={redirectURI} scope="user:read" onSignIn={setIsSignedIn} />
        {isSignedIn && <p>Thanks for signing in</p>}
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
