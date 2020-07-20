'use strict';

module.exports = class Response { 
  static genText(text) {
    let response = {
      text: text,
    }

    return response;
  }

  static genQuickReply(text, quickReplies) {
    let response = {
      text,
      quick_replies: []
    };

    for (let quickReply of quickReplies) {
      response['quick_replies'].push({
        content_type: 'text',
        title: quickReply['title'],
        payload: quickReply['payload']
      })
    }

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: 'postback',
      title,
      payload,
    };

    return response;
  }

  static genGenericTemplateSlide(items) {
    let response = {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: items.map((item) => ({
          title: item.title,
          subtitle: item.subtitle,
          image_url: item.image_url,
          buttons: item.buttons,
        }))
      }
    }
    
    return response;
  }

  
}