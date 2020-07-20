'use strict';

const request = require('request');
const camelCase = require('camelcase');
const config = require('./config');

module.exports = class GraphAPi {

  static callSendAPI(requestBody) {
    request(
      {
        uri: `${config.mPlatform}/me/messages`,
        qs: {
          access_token: config.pageAccessToken
        },
        method: 'POST',
        json: requestBody
      },
      error => {
        if(error) {
          console.error('메시지를 보낼 수 없습니다: ', error);
        }
      }
    )
  }

  static async getUserProfile(senderPsid) {
    try {
      const userProfile = await this.callUserProfileAPI(senderPsid);

      for (const key in userProfile) {
        const camelizedKey = camelCase(key);
        const value = userProfile[key];
        delete userProfile[key];
        userProfile[camelizedKey] = value;
      }

      return userProfile;
    } catch(err) {
      console.log('가져오기 실패: ',err);
    }
  }

  static callUserProfileAPI(senderPsid) {
    return new Promise((resolve, reject) => {
      let body = [];

      request({
        uri: `${config.mPlatform}/${senderPsid}`,
        qs: {
          access_token: config.pageAccessToken,
          fields: 'first_name, last_name'
        },
        method: 'GET'
      }).on('response', (response) => {
        if (response.statusCode !== 200) {
          reject(Error(response.statusCode));
        }
      }).on('data', (chunk) => {
        body.push(chunk);
      }).on('error', (error) => {
        console.error('프로파일을 가져올 수 없습니다. 에러: '+error);
        reject(Error('Network Error'));
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log(JSON.parse(body));
        resolve(JSON.parse(body));
      })
    })
  }

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