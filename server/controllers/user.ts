import { NotificationClass } from '../helpers/notificationClass'
import SmsUtil from '../helpers/smsUtil'
import { XpLog } from '../helpers/xp'
import Level from '../models/level'
import User from '../models/user';
import BaseCtrl from './base';
import JWTctrl from './authcontroller'
import NotificationCtrl from './notification'
const smsCtrl = new SmsUtil()
const notifCtrl = new NotificationCtrl()
import * as bcrypt from 'bcryptjs';


import XpLogCtrl from './xpLog'
const xpConfig = require('../helpers/xpConfig');
const xpCtrl = new XpLogCtrl()
export default class UserCtrl extends BaseCtrl {
    model = User;
    xp: XpLog
    notif: NotificationClass;
    level = Level;

    rand(min, max) {
        var prev;
        var num = Math.floor(Math.random() * (max - min + 1) + min);
        return prev = num === prev && min !== max ? this.rand(min, max) : num;
    }

    register = (req, res) => {
        this.model.findOne({ email: req.body.email }, (err, user) => {
            const resp = { isSuccessful: true, message: 'Successfully Created a user', result: '', id: '', code: '' }
            // check if user exist with defined email
            if (user) {
                resp.result = user._id;
                resp.isSuccessful = false;
                resp.message = 'User already Exist';
                return res.json(resp);
            }
            let activationCode = this.rand(999, 10000);
            const obj = new this.model(req.body);
            obj.activationCode = activationCode
            smsCtrl.sendSmsRegisteration(obj.phone, obj.activationCode, user.username).then((smsRes) => {
                if (smsRes) {
                    this.level.find({ deleted: false }).sort({ order: 'asc' }).exec((err, docs) => {
                        if (err) {
                            return res.send(err);
                        }
                        if (docs) {
                            obj.level = docs[0]
                        }
                        obj.save((err, user) => {
                            if (err && err.code === 11000) {
                                return res.status(400).json({ isSuccessful: false, message: 'Duplicate key error' });
                            }
                            if (err) {
                                return res.json({ isSuccessful: false, message: err });
                            }
                            resp.result = user._id;
                            resp.code = activationCode;
                            resp.message = 'User Successfully Created';
                            resp.isSuccessful = true;
                            this.xp = new XpLog(user._id, xpConfig.register, 'register')
                            xpCtrl.saveXpLog(this.xp).then(xpRes => {
                                if (xpRes) {
                                    return res.json(resp);
                                }
                            }).catch(err => {
                                console.error(err);
                            })
                        });
                    })
                } else {
                    return res.status(400).json({ isSuccessful: false, message: 'cannot send sms' });

                }
            })

        });
    }
    login = (req, res) => {
        this.model.findOne({ email: req.body.username, is_active: true }, (err, user) => {
            if (!user) {
                return res.sendStatus(403);
            }
            user.comparePassword(req.body.password, (error, isMatch) => {
                if (!isMatch) {
                    return res.sendStatus(403);
                }
                // const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
                const token = JWTctrl.create({ user: user });
                const refresh_token = JWTctrl.createRefreshToken({ user: user });
                res.status(200).json({
                    access_token: token,
                    refresh_token: refresh_token,
                    user_id: user._id,
                    role: user.role
                });
            });
        });
    }
    loginAdmin = (req, res) => {
        console.log(req.body)
        this.model.findOne({ email: req.body.username }, (err, user) => {
            if (!user) {
                return res.sendStatus(403);
            }
            user.comparePassword(req.body.password, (error, isMatch) => {
                if (!isMatch) {
                    return res.sendStatus(403);
                }
                const token = JWTctrl.createAdminToken({ user: user });
                res.status(200).json({ access_token: token, user_id: user._id, role: user.role });
            });
        });
    }
    verify = (req, res) => {
        var userBody = req.body;
        this.model.findOne({ phone: userBody.phone }, (err, user) => {
            if (err) {
                return res.send(err)
            }
            if (user) {
                if (user.activationCode === userBody.activationCode) {
                    this.model.findOneAndUpdate({ phone: userBody.phone }, { "$set": { is_active: true } }, (err, result) => {
                        if (err) {

                            return res.send(err)
                        }
                        this.xp = new XpLog(user._id, xpConfig.verify_phone, 'verify_phone')
                        xpCtrl.saveXpLog(this.xp).then(xpRes => {
                            if (xpRes) {
                                return res.status(200).json({ isSuccessful: true })
                            }
                        }).catch(err => {

                        })
                    })
                } else {
                    return res.status(200).json({ isSuccessful: false, message: 'activation code is not valid' })
                }
            } else {
                return res.status(200).json({ isSuccessful: false, message: 'user not found' })
            }
        })
    }
    forgetPassword = (req, res) => {
        var userBody = req.body;
        this.model.findOne({ phone: userBody.phone }, (err, user) => {
            if (err) {
                return res.send(err)
            }
            if (user) {
                let activationCode = this.rand(999, 10000);
                smsCtrl.sendSmsRegisteration(userBody.phone, activationCode, user.username).then((smsRes) => {
                    if (smsRes) {
                        this.model.findOneAndUpdate({ phone: userBody.phone }, { "$set": { activationCode: activationCode } }, (err, result) => {
                            if (err) {
                                return res.send(err)
                            }
                            return res.status(200).json({ isSuccessful: true, activationCode: activationCode })
                        })
                    } else {
                        return res.status(400).json({ isSuccessful: false, message: 'cannot send sms' });

                    }
                })
            } else {
                return res.status(200).json({ isSuccessful: false, message: 'user not found' })
            }
        })
    }
    resetPassword = (req, res) => {
        var userBody = req.body;
        let self = this;
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return res.send(err)

            }
            bcrypt.hash(userBody.password, salt, function (error, hash) {
                if (error) {
                    return res.send(err)
                }
                userBody.password = hash;
            });
            self.model.findOneAndUpdate({ phone: userBody.phone }, { "$set": { password: userBody.password } }, (err, result) => {
                if (err) {
                    return res.send(err)
                }
                return res.status(200).json({ isSuccessful: true })
            })
        })

    }
    resendCode = (req, res) => {
        var userBody = req.body;
        this.model.findOne({ phone: userBody.phone }, (err, user) => {
            if (err) {
                return res.send(err)
            }
            if (user) {
                let activationCode = this.rand(999, 10000);
                smsCtrl.sendSmsRegisteration(userBody.phone, activationCode, user.username).then((smsRes) => {
                    if (smsRes) {
                        this.model.findOneAndUpdate({ phone: userBody.phone }, { "$set": { activationCode: activationCode } }, (err, result) => {
                            if (err) {
                                return res.send(err)
                            }
                            return res.status(200).json({ isSuccessful: true, activationCode: activationCode })
                        })
                    } else {
                        return res.status(400).json({ isSuccessful: false, message: 'cannot send sms' });

                    }
                })

            } else {
                return res.status(200).json({ isSuccessful: false, message: 'user not found' })
            }
        })
    }
    refreshToken = (req, res) => {
        this.model.findOne({ email: req.payload.user.email }, (err, user) => {
            if (!user) {
                return res.sendStatus(403);
            }
            const token = JWTctrl.create({ user: user });
            res.status(200).json({ isSuccessful: true, token: token, user_id: user._id });
        });
    };
    jwtTokenValidation = (req, res, next) => {
        try {
            const authToken = req.get("Authorization")
            if (!authToken) return res.status(401).json({ isSuccessful: false, message: 'No authorization detected' })
            const token = authToken.replace('Bearer ', '')
            const verifiedToken = JWTctrl.verify(token)
            if (verifiedToken.name == "JwtParseError") return res.status(401).json({
                isSuccessful: false,
                message: verifiedToken.message
            })
            // if (roll.indexOf(verifiedToken.user.role) === -1) return res.status(401).json({
            //     isSuccessful: false,
            //     message: 'No authorization detected'
            // })
            res.locals.accessToken = verifiedToken.token || null;
            res.locals.encryptToken = verifiedToken.encrypt_token || null;
            req.payload = verifiedToken;
            return next()
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    searchUserByEmail = (req, res) => {
        let text = req.query.text;
        var user_finder: any = {};
        if (text) {
            user_finder["$or"] = [];
            user_finder.$or.push({ "email": new RegExp(text) });
            user_finder.$or.push({ "username": new RegExp(text) });
        }
        this.model.find(user_finder).exec((err, users) => {
            if (err) {
                return res.send(err)
            }
            return res.status(200).json({ isSuccessful: true, data: users })
        })
    }
    addFriend = (req, res) => {
        let userId = req.payload.user._id
        let friendId = req.body.userId
        this.model.findById(userId).exec((err, user) => {
            if (err) {
                return res.send(err)
            }
            if (user) {
                if (user.friends.indexOf(friendId) > -1) {
                    // user.friends=user.friends.splice(user.friends.indexOf(friendId),1)
                    // this.model.findOneAndUpdate({_id:userId},{"$set": {"friends":user.friends }},(err)=>{
                    //     if(err){
                    //         return res.send(err)
                    //     }else{
                    return res.status(200).json({ isSuccessful: true, friend: false })
                    // }
                    // })
                } else {
                    this.model.findOneAndUpdate({ _id: userId }, { "$push": { "friends": friendId } }, (err) => {
                        if (err) {
                            return res.send(err)
                        } else {
                            this.notif = new NotificationClass(friendId, `${user.username} add you to her/his friend`, 'Get-friend-request')
                            notifCtrl.saveNotification(this.notif).then(notifRes => {
                                if (notifRes) {
                                    return res.status(200).json({ isSuccessful: true, friend: true })
                                }
                            }).catch(err => {

                            })
                        }
                    })
                }
            } else {
                return res.status(200).json({ isSuccessful: false, message: 'user not found', statusCode: 404 })
            }
        })
    }
    getUserInfo = (req, res) => {
        let userId = req.payload.user._id
        this.model.findById(userId).select('username firstName lastName email phone level role').exec((err, user) => {
            if (err) {
                return res.send(err)
            }
            if (user) {
                res.status(200).json({ isSuccessful: true, data: user });
            } else {
                return res.status(200).json({ isSuccessful: false, message: 'user not found', statusCode: 404 })
            }
        })
    }
    getFriends = (req, res) => {
        let userId = req.payload.user._id
        this.model.findById(userId).select('friends').exec((err, user) => {
            if (err) {
                return res.send(err)
            }
            if (user) {
                this.model.find({ "_id": { "$in": user.friends }, deleted: false }, (err, docs) => {
                    if (err) {
                        return res.send(err);
                    }
                    res.status(200).json({ isSuccessful: true, data: docs });
                });
            } else {
                return res.status(200).json({ isSuccessful: false, message: 'user not found', statusCode: 404 })
            }
        })
    }
}

