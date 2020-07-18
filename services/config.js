'use strict';

require('dotenv').config();

const ENV_VARS = [
  'VERIFY_TOKEN',
]

module.exports = {
  mPlatformDomain: 'https://graph.facebook.com',
  mPlatformVersion: 'v3.2',
  
  pageId: process.env.PAGE_ID,
  appId: process.env.APP_ID,
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
  appSecret: process.env.APP_SECRET,
  verifyToken: process.env.VERIFY_TOKEN,

  appUrl: process.env.APP_URL,

  port: process.env.PORT || 3000,

  get mPlatform() {
    return this.mPlatformDomain+'/'+this.mPlatformVersion;
  },

  get webhookUrl() {
    return this.appUrl+'/webhook';
  }
}