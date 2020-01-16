import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const schoolLevelSchema = new mongoose.Schema({
  title:String,
  deleted:{type:Boolean, default:false},
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const SchoolLevel = mongoose.model('SchoolLevel', schoolLevelSchema);

export default SchoolLevel;
