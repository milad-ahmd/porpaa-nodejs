import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const requestOtherSchema = new mongoose.Schema({
  requester:String,
  users:[],
  question:String,
  status:{type:String,enum:['accepted','rejected','requested'],default:'requested'},
  deleted:{type:Boolean, default:false},
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const RequestOther = mongoose.model('RequestOther', requestOtherSchema);

export default RequestOther;
