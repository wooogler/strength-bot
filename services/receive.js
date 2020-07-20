'use strict';

const Response = require('./response');
const GraphAPi = require('./graph-api');
const Routine = require('./routine');

module.exports = class Receive {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handleMessage() {
    let event = this.webhookEvent;

    let responses;

    try {
      if(event.message) {
        let message = event.message;
        if(message.quick_reply) {
          responses = this.handleQuickReply();
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        } else if (message.text) {
          responses = this.handleTextMessage();
        }
      } else if (event.postback) {
        responses = this.handlePostback();
      } else if (event.referral) {
        responses = this.handleReferral();
      }
    } catch(error) {
      console.error(error);
      responses =  {
        text: `에러 발생: ${error} 다음 이메일로 에러 메시지를 보내세요. leesang627@gmail.com`
      }
    }
    
    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 1000);
        delay++;
      }
    } else {
      this.sendMessage(responses);
    }
  }

  handleTextMessage() {
    console.log(`${this.user.psid} 유저에게 온 텍스트: ${this.webhookEvent.message.text}`);

    //let message = this.webhookEvent.message.text.trim().toLowerCase();
    let response;

    response = [
      Response.genText(`입력 값: ${this.webhookEvent.message.text}`),
      Response.genText('처음부터 다시 시작합니다.'),
      Response.genQuickReply('무엇을 보시겠습니까?',[
        {
          title: '오늘의 운동 루틴',
          payload: 'TODAY_ROUTINE'
        },
        {
          title: '지금까지 운동 기록',
          payload: 'WORKOUT_RECORD'
        }
      ])
    ]

    return response;
  }

  handleAttachmentMessage() {
    let response;

    let attachment = this.webhookEvent.message.attachments[0];

    response = [
      console.log(`${this.user.psid} 유저에게 온 첨부 데이터: ${attachment}`),
      Response.genText('처음부터 다시 시작합니다.'),
      Response.genQuickReply('무엇을 하시겠습니까?',[
        {
          title: '오늘의 운동',
          payload: 'TODAY_EXERCISE'
        },
        {
          title: '지금까지 운동 기록',
          payload: 'WORKOUT_RECORD'
        }
      ])
    ]

    return response;
  }

  handleQuickReply() {
    let payload = this.webhookEvent.message.quick_reply.payload;
    return this.handlePayload(payload);
  }

  handlePayload(payload) {
    console.log(`${this.user.psid} 유저에게 온 Payload: ${payload}`);

    // FBA에 Custom App Event 로깅
    GraphAPi.callFBAEventsAPI(this.user.psid, payload);
    let response;

    if(payload.includes('TODAY_EXERCISE')) {
      response = Routine.handlePayload(payload);
    } else {
      response = {
        text: `기본 포스트백 메시지입니다. payload: ${payload}`
      }
    }

    return response;
  }
  
  sendMessage(response,delay = 0) {
    if('delay' in response) {
      delay = response['delay'];
      delete response['delay'];
    }

    let requestBody = {
      recipient: {
        id: this.user.psid
      },
      message: response
    }

    setTimeout(() => GraphAPi.callSendAPI(requestBody), delay);
  }

  


}