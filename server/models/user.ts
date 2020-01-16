import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';
const moment = require('moment-timezone');

const userSchema = new mongoose.Schema({
  username: String,
  password: {type: String, required: true, default: '123456'},
  firstName: String,
  lastName: String,
  address: String,
  state: String,
  classLevel:String,
  region:String,
  level:Object,
  showFields:{
    username:{type:Boolean,default:false},
    firstName:{type:Boolean,default:false},
    lastName:{type:Boolean,default:false},
    address:{type:Boolean,default:false},
    state:{type:Boolean,default:false},
    birthDate:{type:Boolean,default:false},
    avatar:{type:Boolean,default:false},
    schoolName:{type:Boolean,default:false},
    email:{type:Boolean,default:false},
    phone:{type:Boolean,default:false},
    schoolLevel:{type:Boolean,default:false},
    educationField:{type:Boolean,default:false}
  },
  birthDate:{ type: String },
  city: String,
  rank: String,
  schoolName: String,
  avatar: String,
  activationCode: String,
  friends:[],
  role:{type:String,enum:['user','admin','moderator'],default:'user'},
  email: {type: String, unique: true, lowercase: true, trim: true, required: true},
  phone: {type: String, unique: true, trim: true, required: true},
  gender: {type: String, enum: ['man', 'woman'], default: 'man'},
  schoolLevel: String,
  educationField: String,
  deleted: {type: Boolean, default: false},
  is_active: {type: Boolean,  default: false},
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});
userSchema.virtual('cityData', {
  ref: 'City',
  localField: 'city',
  foreignField: '_id',
  justOne: true
});

// Before saving the user, hash the password
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }
    console.log(user.password);
    bcrypt.hash(user.password, salt, function (error, hash) {
      if (error) {
        return next(error);
      }
      console.log(hash);
      user.password = hash;
      next();
    });
  });
});


userSchema.pre('findOneAndUpdate', function (next) {
  const user = this;
  if (!user._update.password) {
    return next();
  }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user._update.password, salt, function (error, hash) {
      if (error) {
        return next(error);
      }
      user._update.password = hash;
      next();
    });
  });
});



userSchema.methods.comparePassword = function (candidatePassword, callback) {
  console.log(candidatePassword, this.password)
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// Omit the password when returning a user
userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;
