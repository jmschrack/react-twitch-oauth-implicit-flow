import { useEffect, useState } from "react";

/**
 * Generates a URL for Twitch Implicit Auth. This saves a random string to the sessionStorage to verify on callback.
 * @returns 
 */
export function useTwitchImplicitAuthUrl({ clientId, redirectURI, scope = "user_read"}) {
    const [authState] = useState(nonce(15));
  
    sessionStorage.twitchOAuthState = authState;
    const url = 'https://id.twitch.tv/oauth2/authorize' +
		'?response_type=token' +
		'&client_id=' + clientId +
		'&redirect_uri=' + redirectURI +
		'&state=' + authState +
		'&scope=' + scope;
    return url;
}

// 
/**
 * Generates a random string of the given length
 * Source: https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
 * @param {number} length 
 * @returns 
 */
export function nonce(length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/**
 * Gets the User Data for the given login.  If login is null, it gets the user data for the authenticated user
 * @returns 
 */
export async function getUserData({twitchOAuthToken,login=null,clientId}) {
	const url = new URL('https://api.twitch.tv/helix/users');
	if(login) url.searchParams.append('login', login);
	const user=await ((await fetch(url.toString(), {
		method: 'GET',
		headers: new Headers({
			"Accept": "application/json",
			"Client-ID": clientId,
			"Authorization": "Bearer " + twitchOAuthToken
		})
	})).json())
	
    return user?.data?.[0];
}

/**
 * Set's up a listener for messages from the twitch callback page. When a message is received, it saves the twitchOAuthToken to the sessionStorage and calls the onOAuth function
 * It only listens for messages from the given pathname which defaults to "/twitch-callback"
 */
export function useTwitchOAuth({ onOAuth=(twitchOAuthToken)=>{},pathname = '/twitch-callback' }) {
    
    function messageListener(event) {
        if (event.origin !== window.origin || (!event.source?.location?.pathname) || event.source?.location?.pathname !== pathname) return;
        try {
            window.sessionStorage.setItem("twitchOAuthToken", event.data.twitchOAuthToken);
            onOAuth(event.data.twitchOAuthToken);
        } catch (err) {
          console.error("Error parsing message data", event.data);
        }
    }
    
      useEffect(() => {
        window.addEventListener("message", messageListener)
        return () => { window.removeEventListener("message", messageListener) }
      }, [])
    
}