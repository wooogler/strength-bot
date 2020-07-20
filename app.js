'use strict';

require('dotenv').config();

const express = require('express');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
const config = require('./services/config');
const GraphAPi = require('./services/graph-api');
const Receive = require('./services/receive');
const User = require('./services/User')
const app = express().use(bodyParser.json());

let users = {};

app.use(express.static(path.join(path.resolve(), 'public')))

app.get('/webhook', (req,res) => {

  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  
  if(mode && token) {
    if(mode === 'subscribe' && token === config.verifyToken) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    }
  } else {
    res.sendStatus(403);
  }
})

app.post('/webhook', (req,res) => {
  let body = req.body;
  if(body.object === 'page') {
    res.status(200).send('EVENT_RECEIVED');

    body.entry.forEach((entry) => {
      let webhookEvent = entry.messaging[0];
      console.log(webhookEvent);
      let senderPsid = webhookEvent.sender.id;
      if(!(senderPsid in users)) {
        let user = new User(senderPsid);

        GraphAPi.getUserProfile(senderPsid)
          .then(userProfile => {
            user.setProfile(userProfile);
          }).catch(error => {
            console.log('Profile is unavailable: ', error);
          }).finally(() => {
            users[senderPsid] = user;
            console.log('새로운 프로필 PSID: '+ senderPsid);
            let receiveMessage = new Receive(users[senderPsid], webhookEvent);
            return receiveMessage.handleMessage();
          })
      } else {
        console.log('기존 프로필 PSID: '+senderPsid);
        let receiveMessage = new Receive(users[senderPsid], webhookEvent);
        return receiveMessage.handleMessage();
      }
    });
  } else {
    res.sendStatus(404);
  }
})

let listener = app.listen(config.port, function() {
  console.log("Your app is listening on port " + listener.address().port);
})