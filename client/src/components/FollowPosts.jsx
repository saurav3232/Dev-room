import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Spinner from "./Spinner";

let FollowPosts = () => {
  let navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  let [user, setUser] = useState({});
  let [posts, setPosts] = useState({});
  let [loading, setLoading] = useState(true);
  let [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("devroom")) {
      navigate("/users/login");
    }
    setLoggedIn(true);
    // eslint-disable-next-line
  }, []);

  function timeDifference(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
      if (elapsed / 1000 < 30) return "Just now";

      return Math.round(elapsed / 1000) + " seconds ago";
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + " minutes ago";
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + " hours ago";
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + " days ago";
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + " months ago";
    } else {
      return Math.round(elapsed / msPerYear) + " years ago";
    }
  }

  const getUser = async () => {
    let { data } = await axios.get("https://devroom-api-pt2i.onrender.com/api/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("devroom")}`,
      },
    });
    setUser(data.user);
    // await fetchFollowing(); // Call fetchFollowing after setting the user state
    console.log(data.user);
  };

  const getPosts = async () => {
    let { data } = await axios.get("https://devroom-api-pt2i.onrender.com/api/posts/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("devroom")}`,
      },
    });
    setPosts(data.posts);
    // console.log(data.posts);
    setLoading(false);
  };
  const fetchFollowing = async () => {
    const url = `https://devroom-api-pt2i.onrender.com/api/follow-actions/getfollowinglistuserid/${user._id}`;
    const {data} = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("devroom")}`,
      },
    });
    // console.log(data.followingList);
    setFollowing(data.followingList);
  };

  useEffect(() => {
    if (loggedIn) {
      getUser().then(() => {
        getPosts();
      });
    }
  }, [loggedIn]);
  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      fetchFollowing();
    }
  }, [user]);
  let clickDeletePost = async (postId) => {
    await axios.delete(`https://devroom-api-pt2i.onrender.com/api/posts/${postId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("devroom")}`,
      },
    });
    let newArr = posts.filter((post) => {
      if (post._id === postId) return false;
      return true;
    });
    setPosts(newArr);
    Swal.fire("Post deleted successfully", "", "success");
  };

  let clickLikePost = async (postId) => {
    await axios.put(
      `https://devroom-api-pt2i.onrender.com/api/posts/like/${postId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("devroom")}`,
        },
      }
    );
    getPosts();
  };

  return (
    <>
    <h1>Posts of following Dev's:</h1>
      <section>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {posts.length > 0 && (
              <div className="container">
                <div className="row">
                  <div className="col">
                    {posts
                      .slice(0)
                      .reverse()
                      .map((post) => {
                        if (following.includes(post.user._id)) {
                        return (
                          // Render the post
                          <div className="card my-2" key={post._id}>
                            <div className="card-body bg-light-grey">
                              <div className="row">
                                <div className="col-md-2">
                                  <img
                                    src={post.user.avatar}
                                    alt=""
                                    className="rounded-circle"
                                    width="50"
                                    height="50"
                                  />
                                  <br />
                                  <small>{post.name}</small>
                                </div>
                                <div className="col-md-8">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <img
                                        src={post.image}
                                        alt=""
                                        className="img-fluid d-block m-auto"
                                      />
                                    </div>
                                  </div>
                                  <p style={{ fontWeight: "bold" }}>
                                    {post.text}
                                  </p>
                                  <small>
                                    {timeDifference(
                                      new Date(),
                                      new Date(post.createdAt)
                                    )}
                                  </small>
                                  <br />
                                  {post.likes.includes(user._id) ? (
                                    <button
                                      className="btn btn-like btn-sm me-2"
                                      onClick={clickLikePost.bind(
                                        this,
                                        post._id
                                      )}
                                      style={{ color: "white" }}
                                    >
                                      <i
                                        className="fa fa-thumbs-up me-2"
                                        style={{ color: "white" }}
                                      />{" "}
                                      {post.likes.length}
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-primary btn-sm me-2"
                                      onClick={clickLikePost.bind(
                                        this,
                                        post._id
                                      )}
                                    >
                                      <i className="fa fa-thumbs-up me-2" />{" "}
                                      {post.likes.length}
                                    </button>
                                  )}

                                  <Link
                                    to={`/posts/${post._id}`}
                                    className="btn btn-warning btn-sm me-2"
                                  >
                                    <i className="fab fa-facebook-messenger me-2" />{" "}
                                    Discussions {post.comments.length}
                                  </Link>
                                  {post.user._id === user._id ? (
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={clickDeletePost.bind(
                                        this,
                                        post._id
                                      )}
                                    >
                                      <i className="fa fa-times-circle" />
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};
export default FollowPosts;