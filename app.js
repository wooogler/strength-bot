'use strict';

require('dotenv').config();

const express = require('express');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());
app.use(express.static(path.join(path.resolve(), 'public')))

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.get('/webhook', (req,res) => {
  let VERIFY_TOKEN = 'dltkd627';

  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  
  if(mode && token) {
    if(mode === 'subscribe' && token === VERIFY_TOKEN) {
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
    body.entry.forEach((entry) => {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);
      if(webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if(webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
})

const handleMessage = (sender_psid, received_message) => {
  let response;
  if(received_message.text) {
    response = {
      'text': `당신이 보낸 메시지: ${received_message.text}`
    }
  } else if (received_message.attachments) {
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'generic',
          'elements': [{
            'title': 'Is this the right picture?',
            'subtitle': 'Tap a button to answer.',
            'image_url': attachment_url,
            'buttons': [
              {
                'type': 'postback',
                'title': 'Yes!',
                'payload': 'yes',
              },
              {
                'type': 'postback',
                'title': 'No!',
                'payload': 'no',
              }
            ]
          }]
        }
      }
    }
  }
  callSendAPI(sender_psid, response);
}

const handlePostback = (sender_psid, received_postback) => {
  let response;
  let { payload } = received_postback;
  if(payload === 'yes') {
    response = {'text': '감사!'} 
  } else if (payload === 'no') {
    response = {'text': '앗 죄송...'}
  }
  callSendAPI(sender_psid, response);
}

const callSendAPI = (sender_psid, response) => {
  let request_body = {
    'recipient': {
      'id': sender_psid
    },
    'message': response
  }
  request({
    "uri": 'https://graph.facebook.com/v2.6/me/messages',
    'qs': {'access_token': process.env.PAGE_ACCESS_TOKEN},
    'method': 'POST',
    'json': request_body
  }, (err, res, body) => {
    if(!err) {
      console.log('message sent!')
    } else {
      console.error('Unable to send message:'+err);
    }
  })
}

