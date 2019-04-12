require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json())

const publicVapidKey = 'BMUACjClEvgSrJCs_TOagOb7Jafi_jl9CfiowWl_4wTGcoWs_y8Dmhe5N8eVIrNhkQYl2P3QyIa2Smrgml7Mwmo';
const privateVapidKey = process.env.PRIVATE_VAPID;

webpush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

app.post('/subscribe', (req, res) => {
    const subscription = req.body;

    res.status(201).json({});

    const payload = JSON.stringify({ title: 'push test' });

    webpush.sendNotification(subscription, payload).catch(error => console.error(error));
});

const port = 5000;
app.listen(port, () => console.log(`Server started on port:${port}`));