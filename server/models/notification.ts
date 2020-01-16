import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const notificationSchema = new mongoose.Schema({
  user:String,
  message:String,
  meta:Object,
  type:{type:String,enum:['Get-friend-request','Request-other','Approved-Friend-request','Approve-my-report-request','Reject-my-report-request','Get-answer-of-my-question','Get-comment-of-my-question','Anyone-that-Like-my-question','Anyone-that-Like-my-Answer','Request-to-me-for-answering-a-question','Con’t-complete-my-challenge','Complete-my-challenge','Approved-my-edit-of-a-question','Rejected-my-edit-of-a-question','Approved-report-for-my-comment','Approved-report-for-my-question','Approved-report-for-my-answer','Get-AP','Get-XP','Complete-A-mission-of-my-mission-card','Improve-my-level','Accepet-my-answer','Verify-my-answer','Others-edit-my-question','Get-a-badge']},
  deleted:{type:Boolean, default:false},
  seen:{type:Boolean, default:false},
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
