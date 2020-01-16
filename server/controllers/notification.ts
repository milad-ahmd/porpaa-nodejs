import Notification from '../models/notification'


export default class NotificationCtrl {
  model = Notification


  saveNotification = (xpLog) => {
    return new Promise((resolve, reject) => {
      const obj = new this.model(xpLog)
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
}
