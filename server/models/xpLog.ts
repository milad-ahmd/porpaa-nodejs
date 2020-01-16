import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const xpLogSchema = new mongoose.Schema({
  user:String,
  point:Number,
  type:{type:String,enum:['thank','write','answer_status','report','request_to_edit','request_to_others','bookmark','register','verify_phone','verify_email']},
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});


const XpLog = mongoose.model('XpLog', xpLogSchema);

export default XpLog;
