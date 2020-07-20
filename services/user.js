'use strict';

module.exports = class User {
  constructor(psid) {
    this.psid = psid;
    this.firstName = '';
    this.lastName = '';
  }
  setProfile(profile) {
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
  }
}