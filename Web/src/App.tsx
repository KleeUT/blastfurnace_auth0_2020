import React, { useEffect, useState } from "react";
import "./App.css";

import { useAuth0, Auth0Provider } from "@auth0/auth0-react";

const UserDisplay = (props: {
  user: { [name: string]: string };
  isAuthenticated: boolean;
}): JSX.Element => {
  const { isAuthenticated, user } = props;
  if (!isAuthenticated) {
    return <></>;
  }
  return (
    <div>
      <h2>User object</h2>
      <div className="userDisplay">
        <img className="avatar" src={user.picture} alt="Avatar from Gravatar" />

        <table>
          <thead>
            <tr>
              <th>key</th>
              <th>value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(user).map((key) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{user[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function AccessTokenDisplay(props: {
  getAccessTokenSilently: () => Promise<string>;
  isAuthenticated: boolean;
}): JSX.Element {
  const [fetching, setFetching] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [secretData, setSecretData] = useState<{
    secrets: string[];
    status: number;
  }>({ secrets: [], status: 0 });
  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    async function getAccessToken() {
      if (!props.isAuthenticated) {
        return;
      }
      // Get the access token from Auth0
      const token = await props.getAccessTokenSilently();
      // Store the token and trigger a re-render
      setAccessToken(token);
    }
    // Run async access token fetching function
    getAccessToken();
    // Run only when the props.isAuthenticated variable changes
  }, [props]);

  useEffect(() => {
    async function getData() {
      // Only fetch when we're not already fetching and when the Fetch Secrets button is pressed
      if (fetching || !shouldFetch) {
        return;
      }
      // Update the state so we don't fetch multiple times.
      setFetching(true);
      setShouldFetch(false);

      // request secretes from the server and wait for the response
      const response = await fetch("http://localhost:8080/private", {
        headers: {
          /* Add the Authorization header to the request
          Note the value needs to be the word "Bearer" followed by a space 
          and then the access token */
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // check the response to see if it's a 200 response
      if (response.ok) {
        // on successful response read the json payload.
        const secretResult = (await response.json()) as { secrets: string[] };
        // update the secretData with the data and response
        setSecretData({
          secrets: secretResult.secrets,
          status: response.status,
        });
      } else {
        // if the request is rejected set the status.
        setSecretData({ secrets: [], status: response.status });
      }
      // update the state to mark that fetching is complete
      setFetching(false);
    }
    // run the async function
    getData();
    // Run this only when fetching or shouldFetch changes
  }, [fetching, shouldFetch]);
  return (
    <div>
      <h2>Access Token</h2>
      <label htmlFor="accessTokenBox">Access Token:</label>
      {/* Using a text area because it's easy to copy from */}
      <textarea
        id="accessTokenBox"
        value={accessToken}
        onChange={() => {
          // Dont allow input into the textarea
          setAccessToken(accessToken);
        }}
      ></textarea>
      {/* Add a button to fetch the secrets */}
      {/* On click update the state to start fetching */}
      <button onClick={() => setShouldFetch(true)} disabled={fetching}>
        Fetch Secrets
      </button>
      {/* Display the secret result */}
      <p>
        {/* Show the status unless there is a fetch in progress */}
        {fetching ? "Loading" : `status: ${secretData.status}`}
        {/* Display a list of the secrets */}
        <ol>
          {secretData.secrets.map((secret) => (
            <li>{secret}</li>
          ))}
        </ol>
      </p>
    </div>
  );
}

function LoginDisplay(): JSX.Element {
  const {
    loginWithRedirect,
    user,
    isAuthenticated,
    error,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  return (
    <div className="App">
      <h1>React + Auth0 + Blast Furnace</h1>
      {/* Displaly if the user is logged in */}
      <p>Error: {error?.message}</p>
      <p>Is Logged In : {isAuthenticated ? "yes" : "no"}</p>
      {/* Display user data */}
      <hr />

      {/* Buttons for log in and log out functionality */}
      {isAuthenticated ? (
        <button
          onClick={() => {
            /* Add logout function here */
            logout({ returnTo: window.location.origin });
          }}
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => {
            // console.log("Login");
            loginWithRedirect();
          }}
        >
          Login
        </button>
      )}
      <hr />

      <UserDisplay user={user} isAuthenticated={isAuthenticated} />
      <AccessTokenDisplay
        getAccessTokenSilently={getAccessTokenSilently}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}

function App(): JSX.Element {
  return (
    <Auth0Provider
      domain="kleeut-blastfurnace.au.auth0.com"
      clientId="zf8tN3Q290OkKxakrABrxeDpWTjks1Rp"
      redirectUri={window.location.origin}
      audience="BlastfurnaceAPI"
    >
      {/* Render the login display */}
      <LoginDisplay />
    </Auth0Provider>
  );
}

export default App;
