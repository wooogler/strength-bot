'use strict';

const request = require('request');
const config = require('./config');

module.exports = class GraphAPi {
  //Facebook 활동기록 api
  static callFBAEventsAPI(senderPsid, eventName) {
    let requestBody = {
      event: 'CUSTOM_APP_EVENTS',
      custom_events: JSON.stringify([
        {
          _eventName: 'postback_payload',
          _value: eventName,
          _origin: 'strength_bot',
        }
      ]),
      advertiser_tracking_enabled: 1,
      application_tracking_enabled: 1,
      extinfo: JSON.stringify(['mb1']),
      page_id: config.pageId,
      page_scoped_user_id: senderPsid,
    }

    request(
      {
        uri: `${config.mPlatform}/${config.appId}/activities`,
        method: 'POST',
        form: requestBody,
      },
      error => {
        if(!error) {
          console.log(`FBA 이벤트 '${eventName}'`);
        } else {
          console.error(`FBA 이벤트 '${eventName}'를 보낼 수 없습니다. 에러 : ${error}`)
        }
      }
    )
  }
}