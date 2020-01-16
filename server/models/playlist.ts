import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const playlistSchema = new mongoose.Schema({
  user:String,
  questions:[],
  title:String,
  deleted:{type:Boolean, default:false},
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;
