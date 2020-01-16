import ApLog from '../models/apLog'

import moment = require('moment')

import momentTime = require("moment-timezone");
export default class ApLogCtrl {
  model = ApLog
  saveXpLog = (apLog) => {
    return new Promise((resolve, reject) => {
      const obj = new this.model(apLog)
      obj.save((err, item) => {
        // 11000 is the code for duplicate key error
        if (err && err.code === 11000) {
          reject(err)
        }
        if (err) {
          reject(err)
        }
        resolve(item)
      })
    })
  }

  getByFilter = (req, res) => {
    let query = req.query
    query['user']=req.payload.user._id;
    this.model.find(query, (err, docs) => {
      if (err) {
        return res.send(err)
      }
      res.status(200).json({ isSuccessful: true, data: docs })
    })

  }
  getTotalAp=(req,res)=>{
    let query = req.query
    query['user']=req.payload.user._id;
    this.model.aggregate([
      { $match: query },
      { $group: {_id:'', total: { $sum: "$point" } } }
    ]).exec((err,docs)=>{
      if (err) {
        return res.send(err)
      }
      res.status(200).json({ isSuccessful: true, data: docs[0] })
    })
  }
  getLastLogs = (req, res) => {
    let query = req.query
    query['user']=req.payload.user._id;
    var today = momentTime().tz('Asia/Tehran').unix();
    var last = momentTime().tz('Asia/Tehran').unix() - (req.query.dayCount * 24 * 60 * 60 * 1000);
    delete query['dayCount'];
    query["created_at"]= {"$gte": last, "$lt": today}
    console.log(query)
    this.model.find(query).sort({created_at: 'desc'}).exec(function (err, docs) {
      if (err) {
        res.send(err);
        return console.error(err);
      }
      let logs = docs;
      let byday = {};

      function groupday(value, index, array) {
        var d: any;
        d = moment(new Date(value.created_at*1000)).format('MMM_DD')
        byday[d] = byday[d] || [];
        byday[d].push(value.point);
      }
      logs.map(groupday)
      res.status(200).json({isSuccessful: true, data: byday});
    });
  }
}
