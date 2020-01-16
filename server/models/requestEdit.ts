import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const requestEditSchema = new mongoose.Schema({
  user:String,
  question:String,
  text:String,
  status:{type:String,enum:['accepted','rejected','requested'],default:'requested'},
  deleted:{type:Boolean, default:false},
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const RequestEdit = mongoose.model('RequestEdit', requestEditSchema);

export default RequestEdit;
