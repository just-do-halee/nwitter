import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "myBase";
import { updateProfile } from "@firebase/auth";

function App() {
  const [initialized, setInitialized] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        if (user.displayName == null) {
          user.displayName = "Anonymous";
        }
        setUserObj({
          data: user,
          update: async function (args) {
            if (args !== undefined) {
              await updateProfile(this.data, args);
            }
            setUserObj((prev) => ({ data: authService.currentUser, ...prev }));
          },
        });
      } else {
        setUserObj(null);
      }
      setInitialized(true);
    });
  }, []);
  return (
    <>
      {initialized ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
