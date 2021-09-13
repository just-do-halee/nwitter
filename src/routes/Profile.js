import React, { useState } from "react";
import { authService, dbService } from "myBase";
import {
  collection,
  where,
  query,
  onSnapshot,
  orderBy,
} from "@firebase/firestore";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import Nweet from "components/Nweet";

const Profile = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.data.uid),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, [userObj.data.uid]);

  const [newDisplayName, setNewDisplayName] = useState(
    userObj.data.displayName
  );
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.data.displayName !== newDisplayName) {
      userObj.update({ displayName: newDisplayName });
    }
  };
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          autoFocus
          value={newDisplayName}
          onChange={onChange}
          placeholder="Display name"
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      {nweets.map((nw) => (
        <Nweet
          key={nw.id}
          nweetObj={nw}
          isOwner={nw.creatorId === userObj.data.uid}
        />
      ))}
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
