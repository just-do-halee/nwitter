import React, { useState, useEffect } from "react";
import { dbService } from "myBase";
import { collection, onSnapshot, query, orderBy } from "@firebase/firestore";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  useEffect(() => {
    onSnapshot(
      query(collection(dbService, "nweets"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const nweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNweets(nweetArray);
      }
    );
  }, []);

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nw) => (
          <Nweet
            key={nw.id}
            nweetObj={nw}
            isOwner={nw.creatorId === userObj.data.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
