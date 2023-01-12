const aws = require('aws-sdk');

const { AWS_REGION, AWS_ACCESSKEYID, AWS_SECRETACCESSKEY } = process.env;

const ses = new aws.SES({
  apiVersion: 'latest',
  region: AWS_REGION,
  accessKeyId: AWS_ACCESSKEYID,
  secretAccessKey: AWS_SECRETACCESSKEY,
});

const sendEmail = (options) => {
  return new Promise((resolve, reject) => {
    ses.sendEmail(
      {
        Source: options.from,
        Destination: {
          ToAddresses: options.to,
        },
        Message: {
          Subject: {
            Data: options.subject,
          },
          Body: {
            Html: {
              Data: options.body,
            },
          },
        },
        ReplyToAddresses: options.replyTo,
      },
      (err, info) => {
        if (err) reject(err);
        resolve(info);
      },
    );
  });
};

module.exports = sendEmail;
