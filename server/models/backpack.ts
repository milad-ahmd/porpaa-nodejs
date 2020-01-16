import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const backpackSchema = new mongoose.Schema({
    user:String,//user id
    question:String,//question id
    deleted:{type:Boolean, default:false},
    created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
    updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

backpackSchema.virtual('userData', {
    ref: 'User',
    localField: 'user',
    foreignField: '_id',
    justOne: true
});
backpackSchema.virtual('questionData', {
    ref: 'Question',
    localField: 'question',
    foreignField: '_id',
    justOne: true
});
const Backpack = mongoose.model('Backpack', backpackSchema);

export default Backpack;
