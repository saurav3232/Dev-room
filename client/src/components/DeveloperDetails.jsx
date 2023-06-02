import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "./Spinner";
import axios from "axios";
import FollowButton from "./followButton";
import { ExternalLink } from "react-external-link";

let DeveloperDetails = () => {
  const [selectedProfile, setSelectedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  let developerId = useParams().developerId;

  const fetchDeveloper = async () => {
    const { data } = await axios.get(`https://devroom-api-pt2i.onrender.com/api/profiles/${developerId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    setSelectedProfile(data.profile);
    setLoading(false);
  };

  const getFollowerFollowingCount = async () => {
    const developerId = selectedProfile.user._id;
    const { data } = await axios.get(
      `https://devroom-api-pt2i.onrender.com/api/follow-actions/getfollowerfollowingcount/${developerId}`
    );
    setFollowerCount(data.followerCount);
    setFollowingCount(data.followingCount);
    console.log(data);
  };

  useEffect(() => {
    fetchDeveloper(developerId);
    //eslint-disable-next-line
  }, [developerId]);

  useEffect(() => {
    if (Object.keys(selectedProfile).length > 0) {
      getFollowerFollowingCount();
    }
    //eslint-disable-next-line
  }, [selectedProfile]);
  return (
    <React.Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          {Object.keys(selectedProfile).length > 0 && (
            <React.Fragment>
              <section className="p-3">
                <div className="container">
                  <div className="row animated zoomIn">
                    <div className="col">
                      <p className="h3 text-teal text-center">
                        <i className="fa fa-user-tie" />{" "}
                        {selectedProfile.user.name}'s Profile{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <div className="container bg-success text-white text-center p-3">
                  <div className="row">
                    <div className="col">
                      <img
                        src={selectedProfile.user.avatar}
                        alt=""
                        width="200"
                        height="200"
                        className="rounded-circle profile-img"
                      />
                      <p className="h2">{selectedProfile.user.name}</p>
                      <p className="h6">{selectedProfile.website}</p>
                      <p className="h6">{selectedProfile.designation}</p>
                      <p className="h6">{selectedProfile.company}</p>
                      <p>{selectedProfile.location}</p>
                      <FollowButton
                        targetDev={selectedProfile}
                        followerCount={followerCount}
                        setFollowerCount={setFollowerCount}
                      />
                      <div className="d-flex flex-row justify-content-center">
                        <div className="p-2">Followers:{followerCount}</div>
                        <div className="p-2">Followings:{followingCount}</div>
                      </div>
                      <div className="d-flex flex-row justify-content-center">
                        <div className="p-2">
                          <ExternalLink
                            href={selectedProfile.social.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-facebook" />
                          </ExternalLink>
                        </div>

                        <div className="p-2">
                          <ExternalLink
                            href={selectedProfile.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-twitter" />
                          </ExternalLink>
                        </div>
                        <div className="p-2">
                          <ExternalLink
                            href={selectedProfile.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-linkedin" />
                          </ExternalLink>
                        </div>
                        <div className="p-2">
                          <ExternalLink
                            href={selectedProfile.githubUserName}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-github" />
                          </ExternalLink>
                        </div>
                        <div className="p-2">
                          <ExternalLink
                            href={selectedProfile.social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-instagram" />
                          </ExternalLink>
                        </div>
                        <div className="p-2">
                          <ExternalLink
                            href={selectedProfile.social.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-youtube" />
                          </ExternalLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container ">
                  <div className="row">
                    <div className="col text-center">
                      <div className="card my-2">
                        <div className="card-body bg-comment text-black">
                          <p className="h3">
                            {selectedProfile.user.name}'s Biography
                          </p>
                          <p>{selectedProfile.bio}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col text-center">
                      <div className="card my-2">
                        <div className="card-body bg-light-grey text-teal">
                          <p className="h3">
                            {selectedProfile.user.name}'s Skills
                          </p>
                          {selectedProfile.skills.map((skill) => {
                            return (
                              <span className="badge badge-dark p-2 m-2">
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col-md-6">
                      {selectedProfile.experience.length > 0 ? (
                        <React.Fragment>
                          <div className="card">
                            <div className="card-body bg-primary text-white">
                              <p className="h3">Experience</p>
                              <ul className="list-group">
                                {selectedProfile.experience.map((exp) => {
                                  return (
                                    <li
                                      className="list-group-item my-2"
                                      key={exp._id}
                                    >
                                      <span style={{ fontWeight: "bold" }}>
                                        Title : {exp.title}
                                      </span>
                                      <br />
                                      <span style={{ fontWeight: "bold" }}>
                                        Company : {exp.company}
                                      </span>
                                      <br />
                                      <span style={{ fontWeight: "bold" }}>
                                        Location : {exp.location}
                                      </span>
                                      <br />
                                      <span style={{ fontWeight: "bold" }}>
                                        From : {exp.from}
                                      </span>
                                      <br />
                                      <span style={{ fontWeight: "bold" }}>
                                        To :{" "}
                                        {exp.to !== " " ? exp.to : "Current"}
                                      </span>
                                      <br />
                                      <span style={{ fontWeight: "bold" }}>
                                        Description : {exp.description}
                                      </span>
                                      <br />
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        </React.Fragment>
                      ) : null}
                    </div>
                    <div className="col-md-6">
                      {selectedProfile.experience.length > 0 ? (
                        <React.Fragment>
                          <div className="card">
                            <div className="card-body bg-warning text-white">
                              <p className="h3">Education</p>
                              <ul className="list-group">
                                {selectedProfile.education.map((edu) => {
                                  return (
                                    <li
                                      className="list-group-item my-2"
                                      key={edu._id}
                                    >
                                      <span style={{ fontWeight: "bold" }}>
                                        School : {edu.school}
                                      </span>
                                      <br />
                                      <span style={{ fontWeight: "bold" }}>
                                        Degree : {edu.degree}
                                      </span>
                                      <br />
                                      <span style={{ fontWeight: "bold" }}>
                                        Field of Study : {edu.fieldOfStudy}
                                      </span>
                                      <br />
                                      <span style={{ fontWeight: "bold" }}>
                                        From : {edu.from}
                                      </span>
                                      <br />
                                      <span style={{ fontWeight: "bold" }}>
                                        To :{" "}
                                        {edu.to !== " " ? edu.to : "Current"}
                                      </span>
                                      <br />
                                      <span style={{ fontWeight: "bold" }}>
                                        Description : {edu.description}
                                      </span>
                                      <br />
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        </React.Fragment>
                      ) : null}
                    </div>
                  </div>
                </div>
              </section>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      <div style={{ marginBottom: "150px" }} />
    </React.Fragment>
  );
};
export default DeveloperDetails;
