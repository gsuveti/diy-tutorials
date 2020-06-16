import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {EventContext} from 'firebase-functions';
import {productsEmailTemplate} from './templates/products.template';
import {instructionsEmailTemplate} from './templates/instructions.template';

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

interface ProductsEmailData {
    title: string;
    tutorialUrl: string;
    productQuantities: { [key: string]: number }
    products: { optional: string, [key: string]: any };
}

interface InstructionsEmailData {
    title: string;
    tutorialUrl: string;
    content: string;
    displayedSections: string;
}

function getTotal(products: any, productQuantities: any) {
    return products.reduce((total: any, product: any) => {
        const quantity = productQuantities[product.uuid];
        return total + product.price * quantity;
    }, 0)
}

function renderProductsEmailTemplate({
                                         title,
                                         products,
                                         productQuantities,
                                         tutorialUrl
                                     }: ProductsEmailData) {

    const requiredProducts = products.filter((product: any) => !product.optional);
    const optionalProducts = products.filter((product: any) => product.optional);

    const requiredProductsTotal = getTotal(requiredProducts, productQuantities);
    const optionalProductsTotal = getTotal(optionalProducts, productQuantities);

    return ejs.render(productsEmailTemplate,
        {
            title,
            tutorialUrl,
            requiredProducts,
            optionalProducts,
            requiredProductsTotal,
            optionalProductsTotal,
            productQuantities
        });
}

function renderInstructionsEmailTemplate({
                                             title,
                                             content,
                                             displayedSections,
                                             tutorialUrl
                                         }: InstructionsEmailData) {
    return ejs.render(instructionsEmailTemplate,
        {
            title,
            tutorialUrl,
            content,
            displayedSections
        });
}


exports.sendProductsEmail = functions.firestore
    .document('products-emails/{emailId}')
    .onCreate((snap: DocumentSnapshot, context: EventContext) => {
        const data: any = snap.data();

        console.log(data);

        const html = renderProductsEmailTemplate(data);
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

// TODO remove me
exports.sendEmail = functions.firestore
    .document('emails/{emailId}')
    .onCreate((snap: DocumentSnapshot, context: EventContext) => {
        const data: any = snap.data();

        console.log(data);

        const html = renderProductsEmailTemplate(data);
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

exports.sendInstructionsEmail = functions.firestore
    .document('instructions-emails/{emailId}')
    .onCreate((snap: DocumentSnapshot, context: EventContext) => {
        const data: any = snap.data();

        console.log(data);

        const html = renderInstructionsEmailTemplate(data);
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


app.post('/template/products', function (req: any, res: any) {
    const data: ProductsEmailData = req.body;
    const html = renderProductsEmailTemplate(data);
    res.send(juice(html));
});

app.post('/template/instructions', function (req: any, res: any) {
    const data: InstructionsEmailData = req.body;
    const html = renderInstructionsEmailTemplate(data);
    res.send(juice(html));
});

exports.webApp = functions.https.onRequest(app);

