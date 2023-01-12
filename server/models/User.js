const mongoose = require('mongoose');
const _ = require('lodash');
const generateSlug = require('../utils/slugify');
const { getEmailTemplate } = require('./EmailTemplate');
const sendEmail = require('../aws-ses');

const { Schema, model } = mongoose;
const { EMAIL_ADDRESS_FROM } = process.env;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

const mongoSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  googleToken: {
    access_token: String,
    refresh_token: String,
    token_type: String,
    expiry_date: Number,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  displayName: String,
  avatarUrl: String,
});

class UserClass {
  static publicFields() {
    return ['id', 'displayName', 'email', 'avatarUrl', 'slug', 'isAdmin'];
  }

  static async signInOrSignUp({ googleId, email, googleToken, displayName, avatarUrl }) {
    const user = await this.findOne({ googleId }).select(UserClass.publicFields().join(' '));
    if (user) {
      const modifier = {};
      const { accessToken, refreshToken } = googleToken;
      if (accessToken) {
        modifier.access_token = accessToken;
      }
      if (refreshToken) {
        modifier.refresh_token = refreshToken;
      }

      if (_.isEmpty(modifier)) {
        return user;
      }

      await this.updateOne({ googleId }, { $set: modifier });
      return user;
    }

    const slug = await generateSlug(this, displayName);
    const userCount = await this.find().countDocuments();

    const newUser = await this.create({
      createdAt: new Date(),
      googleId,
      email,
      googleToken,
      displayName,
      avatarUrl,
      slug,
      isAdmin: userCount === 0,
    });

    try {
      const template = await getEmailTemplate('Welcome', { userName: displayName });
      await sendEmail({
        from: `Daniel from easy-doc <${EMAIL_ADDRESS_FROM}>`,
        to: [email],
        subject: template.subject,
        body: template.message,
      });
    } catch (err) {
      console.error('Email sending Error: ', err);
    }

    return _.pick(newUser, UserClass.publicFields());
  }
}

mongoSchema.loadClass(UserClass);

const User = model('User', mongoSchema);

module.exports = User;
