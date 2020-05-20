import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {EventContext} from 'firebase-functions';
import {template} from './template';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const juice = require('juice');


const email = functions.config().common.email;
const sendgridApiKey = functions.config().sendgrid.api_key;
const sgMail = require('@sendgrid/mail');
const express = require("express");
const ejs = require('ejs');

const app = express();

sgMail.setApiKey(sendgridApiKey);

admin.initializeApp();

/**
 * Here we're using Gmail to send
 */

interface Data {
    title: string;
    tutorialUrl: string;
    content: string;
    displayedSections: string;
    productQuantities: { [key: string]: number }
    products: { optional: string, [key: string]: any };
}

const emailStyle = `
<style>
    .content{
        max-width: 600px;
        margin:auto;
    }
    img{
        width: 100%;
    }    
</style>
`;


function getTotal(products: any, productQuantities: any) {
    return products.reduce((total: any, product: any) => {
        const quantity = productQuantities[product.uuid];
        return total + product.price * quantity;
    }, 0)
}

function renderTemplate({
                            title,
                            content,
                            displayedSections,
                            products,
                            productQuantities,
                            tutorialUrl
                        }: Data) {

    const requiredProducts = products.filter((product: any) => !product.optional);
    const optionalProducts = products.filter((product: any) => product.optional);

    const requiredProductsTotal = getTotal(requiredProducts, productQuantities);
    const optionalProductsTotal = getTotal(optionalProducts, productQuantities);

    return ejs.render(template,
        {
            title,
            tutorialUrl,
            displayedSections,
            content,
            requiredProducts,
            optionalProducts,
            requiredProductsTotal,
            optionalProductsTotal,
            productQuantities
        });
    ;
}


exports.sendEmail = functions.firestore
    .document('emails/{emailId}')
    .onCreate((snap: DocumentSnapshot, context: EventContext) => {
        const data: any = snap.data();

        console.log(data);

        const html = data.html ? (emailStyle + data.html) : renderTemplate(data);
        const title = data.title;

        const msg = {
            to: data.email,
            from: email,
            subject: `Lucrare DIY${title ? " - " + title : ""}`,
            html: juice(html)
        };

        sgMail.send(msg).then((response: any) => {
            console.log('mail sent!');
        });
    });


app.post('/getTemplate', function (req: any, res: any) {
    const data: Data = req.body;
    const html = renderTemplate(data);
    res.send(juice(html));

});

exports.webApp = functions.https.onRequest(app);

