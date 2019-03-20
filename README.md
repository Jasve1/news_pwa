# news_pwa
An example of a progressive web app using the api newsapi.org


Create index.js with the following:

const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json())


//Type "./node_modules/.bin/web-push generate-vapid-keys" in terminal to generate public and private keys
const publicVapidKey = '';
const privateVapidKey = '';

webpush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

app.post('/subscribe', (req, res) => {
    const subscribtion = req.body;

    res.status(201).json({});

    const payload = JSON.stringify({ title: 'push test' });

    webpush.sendNotification(subscribtion, payload).catch(error => console.error(error));
});

const port = 5000;
app.listen(port, () => console.log(`Server started on port:${port}`));
