import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const userTypeSchema = new mongoose.Schema({
  title:String,
  userGroup:{type:String,enum:['user','admin','moderator'],default:'user'},
  permissions:[],
  deleted:{type:Boolean, default:false},
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const UserType = mongoose.model('UserType', userTypeSchema);

export default UserType;
