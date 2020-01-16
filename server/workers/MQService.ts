//import amqp from 'amqplib/callback_api';
//
//
//const CONN_URL = 'amqp://admin:74626731@localhost:15672';
//
//
//let ch = null;
//amqp.connect(CONN_URL, function (err, conn) {
//  conn.createChannel(function (err, channel) {
//    ch = channel;
//  });
//});
//
//
//export const publishToQueue = async (queueName, data) => {
//  ch.sendToQueue(queueName, new Buffer(data));
//}
//process.on('exit', (code) => {
//  ch.close();
//  console.log(`Closing rabbitmq channel`);
//});



"use strict";

const TAG = "[AMQP]";


export default class WorkersMQ {
  private open: any
  private amqp: any
  private q_sms: string
  private q_notif: string
  private q_email: string
  private q_challenge: string

  constructor() {
    this.amqp = require('amqplib');
    this.q_sms = 'sms';
    this.q_notif = 'notif';
    this.q_email = 'email';
    this.q_challenge = 'challenge';
    this.open = this.amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  }

  get Q_SMS() {
    return "sms";
  }

  get Q_NOTIF() {
    return "notif";
  }

  get Q_EMAIL() {
    return "email";
  }

  get Q_EXEC() {
    return "executor";
  }

  get Q_CHALLENGE() {
    return "challenge";
  }

  bail(err) {
    console.error(err);
    process.exit(1);
  }

  publish(q, message) {

    return new Promise((resolve, reject) => {
      this.open.then(function(conn) {
        return conn.createChannel();
      }).then(function(ch) {
        return ch.assertQueue(q).then((ok) => {

          var ok2 = ch.sendToQueue(q, Buffer.from(JSON.stringify(message)), {persistent: false});
          resolve(true);
        }).catch(err=>{
          reject(err)
        });
      }).catch(err=>{
        reject(err)
      });
    });
  }

  consume(q, callback) {
    console.log('====================*******************omad*************##########################')

    this.open.then(function(conn) {
      return conn.createChannel();
    }).then(function(ch) {
      return ch.assertQueue(q).then((ok) => {
        return ch.consume(q, (msg) => {
          callback(msg, ch);
        });
      });
    }).catch(console.warn);
  }
}
