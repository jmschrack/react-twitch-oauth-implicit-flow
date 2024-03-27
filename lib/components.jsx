
import { useEffect, useState, } from "react";
import { getUserData, useTwitchImplicitAuthUrl, useTwitchOAuth } from "./twitch";


export const twitchPurple = "#9146FF"
/**
 * A button that will open a popup window to the twitch implicit auth url
 * @returns 
 */
export function TwitchButton({ clientId, redirectURI, scope, children }) {
    const url = useTwitchImplicitAuthUrl({ clientId, redirectURI, scope });
    return (
        <button onClick={() => { const w = window.open(url); w.focus(); }} style={{ backgroundColor: twitchPurple, color: "#fff" }}>


            <TwitchIcon />
            {children}
        </button>
    )
}
/**
 * A button that will sign in to twitch using the implicit auth flow.  If the user is already signed in, it will show the username and a sign out button 
 * onSignIn is called with true when the user signs in and false when the user signs out
 * @returns 
 */
export function TwitchSignIn({ clientId, redirectURI, scope, onSignIn = (state) => { } }) {
    
    const [username, setUsername] = useState(null);
    useEffect(() => {
        setUsername(sessionStorage.getItem("twitchUsername"));
    }, [])


    useTwitchOAuth({
        onOAuth: (twitchOAuthToken) => {
            getUserData({ twitchOAuthToken, clientId }).then((user) => {
                sessionStorage.setItem("twitchUsername", user.login);
                setUsername(user.login);
            });
            if (twitchOAuthToken) onSignIn(true);
        }
    });
    function logout() {
        sessionStorage.removeItem("twitchOAuthToken");
        sessionStorage.removeItem("twitchUsername");
        setUsername(null);
        onSignIn(false);
    }
    if (username)
        return <button style={{ backgroundColor: twitchPurple, color: "#fff" }} onClick={logout}><TwitchIcon /> {username} (sign out)</button>
    else
        return <TwitchButton clientId={clientId} redirectURI={redirectURI} scope={scope}>Sign Into Twitch</TwitchButton>
}
/**
 * A Twitch Icon.  Uses the current text color for the fill color.
 * @returns 
 */
export function TwitchIcon({ width = "32", height = "32", className = "" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 32 32"
            fill="currentColor"
            className={className}
        >
            <path d="M26.711 14.929l-4.284 4.284h-4.285l-3.749 3.749v-3.749h-4.82V3.146h17.138zM8.502 1.004L3.146 6.36v19.279h6.427v5.356l5.356-5.356h4.284l9.641-9.64V1.003zm12.854 5.891h2.142v6.427h-2.142zm-5.892 0h2.143v6.427h-2.144z"></path>
        </svg>
    );
}

/**
 * If the page is the twitch callback page, this hook will parse the oauth token from the url and send it to the parent window
 */
export function useTwitchCallback() {
    useEffect(() => {
        let twitchOAuthToken = null;
        if (window.location.hash.match(/access_token=(\w+)/)) {
            twitchOAuthToken = parseFragment(location.hash);
        }
        if (twitchOAuthToken) {
            //do something with the oauth token
            window.opener.postMessage({ twitchOAuthToken }, "*");

            window.close();
        }
    }, [])
}
/**
 * A premade page that can be used as the callback page for twitch implicit auth
 * @returns 
 */
export function TwitchCallbackPage({ children = <h1>Redirecting...</h1> }) {

    useTwitchCallback();

    return (
        { ...children }
    )
}

// From https://github.com/twitchdev/pubsub-javascript-sample/blob/main/main.js
function parseFragment(hash) {
    const hashMatch = function (expr) {
        const match = hash.match(expr);
        return match ? match[1] : null;
    };
    const state = hashMatch(/state=(\w+)/);
    if (sessionStorage.twitchOAuthState == state)
        return hashMatch(/access_token=(\w+)/);

};



