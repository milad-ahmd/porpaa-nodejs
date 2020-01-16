import * as path from "path"
import { app } from '../app'
import setRoutes from '../routes'


const TAG = "[smsWorker]";
import * as mongoose from 'mongoose';
import WorkersMQ from './MQService'


var mq = new WorkersMQ();
mq.consume(mq.Q_SMS, (msg, ch) => {
  console.log('====================*******************omad*************##########################')
  let mongodbURI;
  mongodbURI = 'mongodb://localhost:27017/porpaa';

  mongoose.Promise = global.Promise;
  const mongodb = mongoose.connect(mongodbURI);

  mongodb
    .then((db) => {
      console.log('Connected to MongoDB');
      try {
        var msg_obj = JSON.parse(msg.content.toString());
        console.log(msg_obj,new Date().getTime());
        switch(msg_obj.type) {
          case "ticket_user":
            try {
              console.log('====================*******************omad*************##########################')

            } catch(err) {
              console.error(err);
            }
            break;
          case "ticket_provider":
            break;
          default:
//                      emailUtil.send(msg_obj.receivers, msg_obj.subject, msg_obj.body, msg_obj.attachments).then(result => {
//                          console.log(TAG, result);
//                      }).catch(err => {
//                          console.log(TAG, err);
//                      });
        }
      } catch(err) {
        console.error(TAG, err);
      }
    })
    .catch((err) => {
      console.error(err);
    });
  ch.ack(msg);
});

console.log(TAG, "started");
