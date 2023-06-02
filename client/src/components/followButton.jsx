import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const FollowButton = (props) => {
  const [toggleFollow, setToggleFollow] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [followings, setFollowings] = useState([]);

  const getUser = async () => {
    let { data } = await axios.get("https://devroom-api-pt2i.onrender.com/api/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("devroom")}`,
      },
    });
    setUser(data.user);
  };

  const fetchFollowing = async () => {
    const url = `https://devroom-api-pt2i.onrender.com/api/follow-actions/getfollowinglist/${user._id}`;
    const data = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("devroom")}`,
      },
    });
    setFollowings(data.data.followingList);
  };

  useEffect(() => {
    const fetchFollowData = async () => {
      if (localStorage.getItem("devroom") != null) {
        setLoggedIn(true);
        await getUser();
      }
    };
    fetchFollowData();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user) {
      fetchFollowing();
    }
    //eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (user && followings && followings.includes(props.targetDev._id)) {
      setToggleFollow(false);
    }
  }, [user, followings, props.targetDev._id]);

  const toggle = async () => {
    if (props.targetDev.user._id === user._id) {
      Swal.fire("You cannot follow yourself");
      return;
    }

    await axios.get(
      `https://devroom-api-pt2i.onrender.com/api/follow-actions/togglefollow/${props.targetDev._id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("devroom")}`,
        },
      }
    );

    if (props.setFollowerCount) {
      if (toggleFollow) {
        props.setFollowerCount((prevCount) => prevCount + 1);
      } else {
        props.setFollowerCount((prevCount) => prevCount - 1);
      }
    }

    setToggleFollow(!toggleFollow);

    if (user) {
      await fetchFollowing();
    }
  };

  return (
    <>
      {loggedIn && !(user && props.targetDev.user._id === user._id) && (
        <>
          {toggleFollow ? (
            <button className="btn btn-primary btn-sm" onClick={toggle}>
              Follow  
            </button>
          ) : (
            <button className="btn btn-danger btn-sm" onClick={toggle}>
              Unfollow
            </button>
          )}
        </>
      )}
    </>
  );
};

export default FollowButton;
