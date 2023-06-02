const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const Profile = require("../models/Profile");
const FollowTable = require("../models/FollowUnfollowModel");

const addToFollowers = async (followeeId, followerId) => {
  const data = await FollowTable.findOne({ userId: followeeId });
  if (!data) {
    let modFollowers = [followerId];
    let followEl = new FollowTable({
      userId: followeeId,
      following: [],
      followingCount: 0,
      followers: modFollowers,
      followerCount: 1,
    });
    followEl = await followEl.save();
  } else {
    let modFollowers;
    if (data.followers.includes(followerId)) {
      modFollowers = data.followers.filter((item) => item !== followerId);
      data.followerCount -= 1;
    } else {
      modFollowers = [...data.followers, followerId];
      data.followerCount += 1;
    }
    data.followers = modFollowers;
    const updatedData = await data.save(); // Save the updated document
  }
};

router.get("/togglefollow/:devId", authenticate, async (request, response) => {
  try {
    console.log(request.user.id);
    const data = await FollowTable.findOne({ userId: request.user.id });
    console.log(data);
    if (!data) {
      let modFollowing = [request.params.devId];
      let followEl = new FollowTable({
        userId: request.user.id,
        following: modFollowing,
        followingCount: 1,
        followers: [],
        followerCount: 0,
      });
      followEl = await followEl.save();
    } else {
      let modFollowing;
      if (data.following.includes(request.params.devId)) {
        modFollowing = data.following.filter(
          (item) => item !== request.params.devId
        );
        data.followingCount -= 1;
      } else {
        modFollowing = [...data.following, request.params.devId];
        data.followingCount += 1;
      }
      data.following = modFollowing;
      const updatedData = await data.save(); // Save the updated document
    }
    const profiledata = await Profile.findById(request.params.devId);
    await addToFollowers(profiledata.user._id, request.user.id);
    response.status(200).json({ msg: "updated Follow table" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});

router.get("/getfollowinglist/:userId", authenticate, async (req, res) => {
  console.log(req.params.userId);
  const data = await FollowTable.findOne({ userId: req.params.userId });
  if (data) {
    // console.log(data.following);
    res.status(200).json({ followingList: data.following });
  } else {
    res.status(200).json({ followingList: null });
  }
});
router.get(
  "/getfollowinglistuserid/:userId",
  authenticate,
  async (req, res) => {
    // console.log(req.params.userId)
    const data = await FollowTable.findOne({ userId: req.params.userId });
    let followingIdArr = [];

    // Use map to create an array of promises
    if (data) {
      const promises = data.following.map(async (devId) => {
        let profile = await Profile.findOne({ _id: devId });
        // console.log(profile.user._id);
        return profile.user._id;
      });

      // Wait for all promises to resolve using Promise.all
      const resolvedIds = await Promise.all(promises);

      followingIdArr = resolvedIds.filter((id) => id !== null);
    }

    if (data) {
      // console.log("hello", followingIdArr);
      res.status(200).json({ followingList: followingIdArr });
    } else {
      res.status(200).json({ followingList: null });
    }
  }
);

router.get("/getfollowerfollowingcount/:devUserId", async (req, res) => {
  const data = await FollowTable.findOne({ userId: req.params.devUserId });
  // console.log(data);
  if (data) {
    res.status(200).json({
      followingCount: data.followingCount,
      followerCount: data.followerCount,
    });
  } else {
    res.status(201).json({ followingCount: 0, followerCount: 0 });
  }
});

module.exports = router;
