import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const missionCardSchema = new mongoose.Schema({
  levelId:String,
  questionCondition:Object,
  pointsRecieved:Number,
  pointsMax:Number,
  icon:String,
  title:String,
  deleted:{type:Boolean, default:false},
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const MissionCard = mongoose.model('MissionCard', missionCardSchema);

export default MissionCard;
