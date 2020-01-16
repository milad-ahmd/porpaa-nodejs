import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const userChallengSchema = new mongoose.Schema({
  challenge:Object,
  user:String,
  userCompleteProgress:Number,
  description:String,
  deleted:{type:Boolean, default:false},
  deadline: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});


const UserChallenge = mongoose.model('UserChallenge', userChallengSchema);

export default UserChallenge;
