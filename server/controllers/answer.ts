import { ResponseContent } from '../base/responseContent'
import { NotificationClass } from '../helpers/notificationClass'
import { XpLog } from '../helpers/xp'
import { XpLogType } from '../helpers/xpLogType'
import Question from '../models/question'
import BaseCtrl from './base'
import Answer from '../models/answer'
import NotificationCtrl from './notification'
import XpLogCtrl from './xpLog'
const notifCtrl = new NotificationCtrl()
import moment = require("moment-timezone");


const xpConfig = require('../helpers/xpConfig')
const xpCtrl = new XpLogCtrl()

export default class AnswerCtrl extends BaseCtrl {
  model = Answer
  xp: XpLog
  notif:NotificationClass;

  insertAnswer = (req, res) => {
    let answer = req.body
    answer.user = req.payload.user._id
    Question.findById(answer.question).exec((err, question) => {
      if (err) {
        return res.send(err)
      }
      if (question) {
        let self = this
        const obj = new this.model(answer)
        obj.save(async function (err, item) {
          if (err && err.code === 11000) {
            res.sendStatus(400)
          }
          if (err) {
            return res.send(err)
          }
          question = await Question.findOneAndUpdate({ _id: answer.question }, { '$push': { 'answers': item._id } })
          self.xp = new XpLog(answer.user, xpConfig.write, 'write')
          xpCtrl.saveXpLog(self.xp).then(xpRes => {
            if (xpRes) {
              self.notif=new NotificationClass(question.user,`${req.payload.user.username} answer to your question`,'Get-answer-of-my-question')
              notifCtrl.saveNotification(self.notif).then(notifRes=>{
                if(notifRes){
                  return res.status(200).json({ isSuccessful: true, data: item, question: question })
                }
              }).catch(err=>{

              })

            }
          }).catch(err => {

          })
        })
      } else {
        return res.status(200).json({ isSuccessful: false, message: 'question not found', statusCode: 404 })
      }
    })
  }
  changeAnswerStatus = (req, res) => {
    let answer = req.body
    if (answer._id) {
      this.model.findOneAndUpdate({ _id: answer._id }, { '$set': { status: answer.status } }, (err, answer) => {
        if (err) {
          return res.send(err)
        }
        return res.status(200).json({ isSuccessful: true, data: answer })
      })
    }
  }

  likeAnswer = (req, res) => {
    let userId = req.payload.user._id
    this.model.findById(req.params.id).exec((err, answer) => {
      if (err) {
        return res.send(err)
      }
      if (answer) {
        if (answer.likers.indexOf(userId) > -1) {
          // answer.likers=answer.likers.splice(answer.likers.indexOf(userId),1)
          // this.model.findOneAndUpdate({_id:req.params.id},{"$set": {"likers":answer.likers },"$inc":{likes:-1}},(err)=>{
          //     if(err){
          //         return res.send(err)
          //     }else{
          return res.status(200).json({ isSuccessful: true, like: false })
          // }
          // })
        } else {
          this.model.findOneAndUpdate({ _id: req.params.id }, {
            '$push': { 'likers': userId },
            '$inc': { likes: 1 }
          }, (err) => {
            if (err) {
              return res.send(err)
            } else {
              this.xp = new XpLog(userId, xpConfig.thank, 'thank')
              xpCtrl.saveXpLog(this.xp).then(xpRes => {
                if (xpRes) {
                  this.notif=new NotificationClass(answer.user,`${req.payload.user.username} like your answe`,'Anyone-that-Like-my-Answer')
                  notifCtrl.saveNotification(this.notif).then(notifRes=>{
                    if(notifRes){
                      return res.status(200).json({ isSuccessful: true, like: true })
                    }
                  }).catch(err=>{

                  })
                }
              }).catch(err => {
                console.log(err)
              })
            }
          })
        }
      } else {
        return res.status(200).json({ isSuccessful: false, message: 'answer not found', statusCode: 404 })
      }
    })
  }


  getAnswerByFilterPagination = (req, res) => {
    let query = req.query
    if (!query['deleted']) {
      query['deleted'] = false
    } else if (query['deleted'] == 'none') {
      delete query['deleted']
    }
    var answers_populator = [
      { path: 'user', model: 'User' },
      { path: 'comments', model: 'Comment' }
    ]

    this.model.countDocuments(query, (err, docs) => {
      if (err) {
        return res.send(err)
      }
      this.options.page = parseInt(req.params.page)
      this.options.limit = parseInt(req.params.limit)
      this.model.find(query, {}, {
        skip: (parseInt(req.params.page) - 1) * parseInt(req.params.limit),
        limit: parseInt(req.params.limit)
      }).populate(answers_populator).exec((err, docs1) => {
        if (err) {
          return res.send(err)
        }
        return res.status(200).json({ isSuccessful: true, answers: docs1,count:docs,page:req.params.page })
      })
    })
  }


}
