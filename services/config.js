'use strict';

require('dotenv').config();

const ENV_VARS = [
  'VERIFY_TOKEN',
]

module.exports = {
  mPlatformDomain: 'https://graph.facebook.com',
  mPlatformVersion: 'v3.2',
  
  pageId: process.env.PAGE_ID,
  
}