import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const badgeSchema = new mongoose.Schema({
    title:String,
    icon:String,//icon url
    category:{type:String,enum:['personal','social','presence','supervision','content']},

    deleted:{type:Boolean, default:false},
    created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
    updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const Badge = mongoose.model('Badge', badgeSchema);

export default Badge;
