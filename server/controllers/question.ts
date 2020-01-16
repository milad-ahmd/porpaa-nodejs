import { LimitationType } from '../helpers/limitationType'
import { NotificationClass } from '../helpers/notificationClass'
import RateLimitations from '../helpers/rate-limitations'
import { XpLog } from '../helpers/xp'
import { XpLogType } from '../helpers/xpLogType'
import Config from '../models/config'
import BaseCtrl from './base'
import Question from '../models/question'
import { ResponseContent } from '../base/responseContent'
import NotificationCtrl from './notification'
import moment = require('moment-timezone')
import XpLogCtrl from './xpLog'


const xpConfig = require('../helpers/xpConfig')
const xpCtrl = new XpLogCtrl()
const notifCtrl = new NotificationCtrl()

export default class QuestionCtrl extends BaseCtrl {
  model = Question
  response: ResponseContent
  xp: XpLog
  notif: NotificationClass

  options = {
    page: 1,
    limit: 10
  }
  getQuestions = (req, res) => {
    var question_finder = { deleted: false }

    if (req.query.userId) {
      question_finder['user'] = req.query.userId
    }
    if (req.query.subjectId) {
      question_finder['subject'] = req.query.subjectId
    }

    var question_populator = [
      { path: 'subject', model: 'Subject' },
      { path: 'user', model: 'User' },
      { path: 'tags', model: 'Tags' }
    ]
    this.model.find(question_finder).populate(question_populator).sort({ created_at: -1 }).exec((err, questions) => {
      if (err) {
        return res.send(404)
      }
      this.response = new ResponseContent(true, questions)
      if (questions) {
        return res.status(200).json(this.response)
      }
    })
  }

  insertQuestion = (req, res) => {
    Config.find().exec((err, configs) => {
      if (err) {
        return res.status(200).json({ isSuccessful: false, message: 'config not found', statusCode: 600 })
      }
      if (configs.length > 0) {
        var config = configs[0]
        var question = req.body
        question.user = req.payload.user._id
        let checkLimitation = [
          { field: 'tagsLimitation', type: LimitationType.lte, value: question.tags.length }
        ]
        var checkResult = RateLimitations.limitation(config, checkLimitation)
        if (checkResult.isSuccess) {
          const obj = new this.model(question)
          obj.save((err, item) => {
            if (err && err.code === 11000) {
              res.sendStatus(400)
            }
            if (err) {
              return res.send(err)
            }
            this.response = new ResponseContent(true, item)
            this.xp = new XpLog(question.user, xpConfig.write, 'write')
            xpCtrl.saveXpLog(this.xp).then(xpRes => {
              if (xpRes) {
                res.status(200).json(this.response)
              }
            }).catch(err => {

            })
          })
        } else {
          return res.status(200).json({
            isSuccessful: false,
            message: `${checkResult.field} is not valid`,
            statusCode: 601
          })

        }
      } else {
        return res.status(200).json({ isSuccessful: false, message: 'config not found', statusCode: 600 })
      }
    })
  }

  likeQuestion = (req, res) => {
    let userId = req.payload.user._id
    this.model.findById(req.params.id).exec((err, question) => {
      if (err) {
        return res.send(err)
      }
      if (question) {
        if (question.likers.indexOf(userId) > -1) {
          // question.likers=question.likers.splice(question.likers.indexOf(userId),1)
          // this.model.findOneAndUpdate({_id:req.params.id},{"$set": {"likers":question.likers },"$inc":{likes:-1}},(err)=>{
          //   if(err){
          //     return res.send(err)
          //   }else{
          return res.status(200).json({ isSuccessful: true, like: false })
          //   }
          // })
        } else {
          this.model.findOneAndUpdate({ _id: req.params.id }, {
            '$push': { 'likers': userId },
            '$inc': { likes: 1 }
          }, (err) => {
            if (err) {
              return res.send(err)
            } else {
              this.xp = new XpLog(question.user, xpConfig.thank, 'thank')
              xpCtrl.saveXpLog(this.xp).then(xpRes => {
                if (xpRes) {

                  this.notif = new NotificationClass(question.user, `${req.payload.user.username} like your question`, 'Anyone-that-Like-my-Answer')
                  notifCtrl.saveNotification(this.notif).then(notifRes => {
                    if (notifRes) {
                      return res.status(200).json({ isSuccessful: true, like: true })
                    }
                  }).catch(err => {

                  })

                }
              }).catch(err => {

              })

            }
          })
        }
      } else {
        return res.status(200).json({ isSuccessful: false, message: 'question not found', statusCode: 404 })
      }
    })
  }

  getOne = (req, res) => {
    var question_finder = { _id: req.params.id }

    var question_populator = [
      { path: 'subject', model: 'Subject' },
      { path: 'user', model: 'User' },
      {
        path: 'answers',
        model: 'Answer',
        populate: [{ path: 'user', model: 'User' }, {
          path: 'comments',
          model: 'Comment',
          populate: [{ path: 'user', model: 'User' }]
        }]
      },
      { path: 'comments', model: 'Comment' },
      { path: 'tags', model: 'Tags' }
    ]
    this.model.findById(question_finder).populate(question_populator).sort({ created_at: -1 }).exec((err, questions) => {
      if (err) {
        return res.send(404)
      }
      this.response = new ResponseContent(true, questions)
      if (questions) {
        return res.status(200).json(this.response)
      }
    })
  }
  getQuestionByFilterPagination = (req, res) => {
    let query = req.query
    let query2
    if (!query['deleted']) {
      query['deleted'] = false
    } else if (query['deleted'] == 'none') {
      delete query['deleted']
    }
    var question_populator = [
      { path: 'subject', model: 'Subject' },
      { path: 'user', model: 'User' },
      { path: 'tags', model: 'Tags' }
    ]
    // ,
    // { path: 'tagsData', model: 'Tags' }
    let timestampNow = moment().tz('Asia/Tehran').unix()
    query2 = Object.assign({}, query)

    query['lifecycle'] = { $gte: timestampNow }
    query2['lifecycle'] = null
    this.model.countDocuments({ $or: [query, query2] }, (err, docs) => {
      if (err) {
        return res.send(err)
      }
      this.options.page = parseInt(req.params.page)
      this.options.limit = parseInt(req.params.limit)
      this.model.find({ $or: [query, query2] }, {}, {
        skip: (parseInt(req.params.page) - 1) * parseInt(req.params.limit),
        limit: parseInt(req.params.limit)
      }).populate(question_populator).exec((err, docs1) => {
        if (err) {
          return res.send(err)
        }
        return res.status(200).json({ isSuccessful: true, questions: docs1, count: docs, page: req.params.page })
      })
    })
  }

  updateQuestion = (req, res) => {
    let tags=req.body.tags;
    let difficulty=req.body.difficulty;
    let subject=req.body.subject;
    let title=req.body.title;
    let description=req.body.description;
    var question_setter = {};
    var question_finder = {"_id": req.body._id};

    if(tags){
      question_setter['tags']=tags
    }if(difficulty){
      question_setter['difficulty']=difficulty
    }if(subject){
      question_setter['subject']=subject
    }if(title){
      question_setter['title']=title
    }if(description){
      question_setter['description']=description
    }
    this.model.update(question_finder, {"$set": question_setter}, (err) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(200).json({isSuccessful:true})
    })


  }
}
