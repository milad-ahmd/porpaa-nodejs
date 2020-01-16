import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const followersSchema = new mongoose.Schema({
    user:String,
    question:String,
    playlist:String,
    type:{type:String,enum:['question','playlist']},
    deleted:{type:Boolean, default:false},
    created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
    updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const Followers = mongoose.model('Followers', followersSchema);

export default Followers;
