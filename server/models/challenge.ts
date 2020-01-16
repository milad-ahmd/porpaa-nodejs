import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const challengSchema = new mongoose.Schema({
  title:String,
  description:String,
  apNeed:Number,
  hoursLimitation:Number,
  icon:String,
  questionNumber:Number,
  questionCondition:Object,
  answerCondition:Object,
  deleted:{type:Boolean, default:false},
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

// questionSchema.virtual('tagsData', {
//     ref: 'Tags',
//     localField: 'tags',
//     foreignField: '_id',
//     justOne: true
// });

const Challenge = mongoose.model('Challenge', challengSchema);

export default Challenge;
