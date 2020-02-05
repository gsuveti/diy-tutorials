import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {Change, EventContext} from 'firebase-functions';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const scrape = require('html-metadata');


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
      return res.send('Sent');
    });
  });
});


exports.getMetadata = functions.https.onRequest((req: any, res: any) => {
  const {url} = req.query;
  cors(req, res, () => {
    scrape(url, function (error: any, metadata: any) {
      console.log(metadata);
      res.send(metadata);
    });

  });
});

exports.setMetadata = functions.firestore
  .document('products/{productId}')
  .onWrite((change: Change<DocumentSnapshot>, context: EventContext) => {
    const data: any = change.after.data();

    console.log(context.eventType);

    if (data) {
      console.log(data.url);
      return scrape(data.url)
        .then((metadata: any) => {
          console.log(metadata);

          return change.after.ref.set({
            metadata: metadata,
            id: context.params.productId
          }, {merge: true});
        });
    }

    return 'ok';
  });

