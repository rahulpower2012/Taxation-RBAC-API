const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'tax-p',
    enum: ["tax-p", "tax-ac", "admin"]
  },
  accessToken: {
    type: String
  },
  tax: {
    income: {
      salary: {
        type: Number,
        default: 0
      },
      stocks: {
        type: Number,
        default: 0
      },
      other: {
        type: Number,
        default: 0
      }
    },
      taxFiled: {
      type: Boolean,
      default: false
    },
    taxCalculated: {
      type: Boolean,
      default: false
    },
    taxPaid: {
      type: Boolean,
      default: false
    },
    taxAmount:{
      type: Number,
      default: 0
    },
    taxDueDate: {
      type: Date,
      default: null
    }
}
})

const User = mongoose.model('user', UserSchema)

module.exports = User;