const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema(
  {
    userId:{type:String,required:true},
    following: { type: Array, required: true, default: [] },
    followers: { type: Array, required: true, default: [] },
    followerCount: { type: Number, required: true, default: 0 },
    followingCount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const FollowTable = mongoose.model("follow-table", FollowSchema);
module.exports = FollowTable;
