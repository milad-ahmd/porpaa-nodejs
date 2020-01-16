import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const apLogSchema = new mongoose.Schema({
  user:String,
  point:Number,
  type:{type:String,enum:['challenge']},
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});


const ApLog = mongoose.model('ApLog', apLogSchema);

export default ApLog;
