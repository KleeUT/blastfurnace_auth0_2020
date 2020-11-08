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

function LoginDisplay(): JSX.Element {
  const { loginWithRedirect, user, isAuthenticated, error } = useAuth0();

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
    </div>
  );
}

function App(): JSX.Element {
  return (
    <Auth0Provider
      domain="kleeut-blastfurnace.au.auth0.com"
      clientId="zf8tN3Q290OkKxakrABrxeDpWTjks1Rp"
      redirectUri={window.location.origin}
    >
      {/* Render the login display */}
      <LoginDisplay />
    </Auth0Provider>
  );
}

export default App;
