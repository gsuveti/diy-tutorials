import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {EventContext} from 'firebase-functions';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const email = functions.config().common.email;
const sendgridApiKey = functions.config().sendgrid.api_key;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendgridApiKey);

admin.initializeApp();

/**
 * Here we're using Gmail to send
 */

exports.useWildcard = functions.firestore
  .document('emails/{emailId}')
  .onCreate((snap: DocumentSnapshot, context: EventContext) => {
    const data: any = snap.data();

    console.log(data);

    const msg = {
      to: data.email,
      from: email,
      subject: 'DIY tutorial - instructions',
      html: data.html
    };

    sgMail.send(msg).then((response: any) => {
      console.log('mail sent!');
    });

  });


exports.sendMail = functions.https.onRequest((req: any, res: any) => {
  cors(req, res, () => {

    // getting dest email by query string
    const dest = req.query.dest;
    const html = req.body;


    const msg = {
      to: dest,
      from: email,
      subject: 'Sending with Twilio SendGrid is Fun',
      html: html
    };

    sgMail.send(msg).then((response: any) => {
      return res.send('Sended');
    });
  });
});

