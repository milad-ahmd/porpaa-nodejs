import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const bookmarkSchema = new mongoose.Schema({
  user:String,
  question:String,//icon url
  deleted:{type:Boolean, default:false},
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
