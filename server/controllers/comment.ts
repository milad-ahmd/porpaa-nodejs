import { ResponseContent } from '../base/responseContent'
import { LimitationType } from '../helpers/limitationType'
import { NotificationClass } from '../helpers/notificationClass'
import RateLimitations from '../helpers/rate-limitations'
import Answer from '../models/answer'
import Question from '../models/question'
import BaseCtrl from './base'
import Comment from '../models/comment'
import NotificationCtrl from './notification'

const notifCtrl = new NotificationCtrl()

export default class CommentCtrl extends BaseCtrl {
  model = Comment
  response:ResponseContent;
  notif:NotificationClass;

  insertComment = (req, res) => {
    var comment = req.body
    comment.user = req.payload.user._id
    comment.type=req.params.type;
    if(comment[comment.type]){
      if(comment.type=='question'){
        Question.findById(comment[comment.type]).exec((err,question)=>{
          if(err){
            return res.send(err)
          }
          if(question){
            let self=this;
            const obj = new this.model(comment);
            obj.save(async function(err, item){
              if (err && err.code === 11000) {
                res.sendStatus(400);
              }
              if (err) {
                return res.send(err);
              }
              question=await Question.findOneAndUpdate({_id:comment[comment.type]},{"$push": {"comments": item._id}})
              self.notif=new NotificationClass(question.user,`${req.payload.user.username} commented on your ${comment.type}`,'Get-comment-of-my-question')
              notifCtrl.saveNotification(self.notif).then(notifRes=>{
                if(notifRes){
                  return res.status(200).json({isSuccessful:true,data:item,question:question})
                }
              }).catch(err=>{

              })
            });
          }else{
            return res.status(200).json({isSuccessful:false,message:'question not found',statusCode:404})
          }
        })
      }
      else if(comment.type=='answer'){
        Answer.findById(comment[comment.type]).exec((err,answer)=>{
          if(err){
            return res.send(err)
          }
          if(answer){
            let self=this;
            const obj = new this.model(comment);
            obj.save(async function(err, item){
              if (err && err.code === 11000) {
                res.sendStatus(400);
              }
              if (err) {
                return res.send(err);
              }
              answer=await Answer.findOneAndUpdate({_id:comment[comment.type]},{"$push": {"comments": item._id}})
              self.notif=new NotificationClass(answer.user,`${req.payload.user.username} commented on your ${comment.type}`,'Get-comment-of-my-question')
              notifCtrl.saveNotification(self.notif).then(notifRes=>{
                if(notifRes){
                  return res.status(200).json({isSuccessful:true,data:item,answer:answer})
                }
              }).catch(err=>{

              })
            });
          }else{
            return res.status(200).json({isSuccessful:false,message:'answer not found',statusCode:404})
          }
        })
      }
      else{
        const obj = new this.model(comment)
        obj.save((err, item) => {
          if (err && err.code === 11000) {
            res.sendStatus(400)
          }
          if (err) {
            return res.send(err)
          }
          this.response = new ResponseContent(true, item)

          return res.status(200).json(this.response)
        })
      }

    }else{
      return res.status(400).json({
        isSuccessful: false,
        message: `${comment.type} id is not exist`
      })
    }



  }
}
