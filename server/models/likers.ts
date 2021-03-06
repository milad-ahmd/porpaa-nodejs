import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const likersSchema = new mongoose.Schema({
    liker_user:String,
    liked_user:String,
    question:String,
    playlist:String,
    type:{type:String,enum:['question','playlist']},
    deleted:{type:Boolean, default:false},
    created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
    updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const Likers = mongoose.model('Likers', likersSchema);

export default Likers;
