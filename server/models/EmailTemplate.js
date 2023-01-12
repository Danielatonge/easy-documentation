const mongoose = require('mongoose');
const _ = require('lodash');

const { Schema, model } = mongoose;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

const mongoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const EmailTemplate = model('EmailTemplate', mongoSchema);

async function insertTemplates() {
  const templates = [
    {
      name: 'Welcome',
      subject: 'Welcome to easy-doc',
      message: `<%= userName %>,
                <p> Thanks for signing up!</p>
                <p> You will receive short notice of upcoming updates </p>
                Daniel Atonge`,
    },
  ];

  templates.forEach(async (t) => {
    const message = t.message.replace(/\n/g, '').replace(/[ ]+/g, ' ').trim();
    const et = await EmailTemplate.findOne({ name: t.name });

    if (!et) {
      await EmailTemplate.create({ name: t.name, subject: t.subject, message });
    } else if (et.subject !== t.subject || et.message !== message) {
      await EmailTemplate.updateOne(
        { _id: et._id },
        { $set: { message, subject: t.subject } },
      ).exec();
    }
  });
}

async function getEmailTemplate(name, params) {
  const et = await EmailTemplate.findOne({ name });

  if (!et) throw new Error(`EmailTemplate "${name}" does not exist`);
  return {
    message: _.template(et.message)(params),
    subject: _.template(et.subject)(params),
  };
}
exports.insertTemplates = insertTemplates;
exports.getEmailTemplate = getEmailTemplate;
