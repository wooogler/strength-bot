'use strict';

const exerciseButtons = (id) => {
  return ([
    Response.genPostbackButton('시작하기', 'START_EXERCISE'+id),
    Response.genPostbackButton('관련 영상', 'SHOW_VIDEO_LIST'+id),
    Response.genPostbackButton('변경하기', 'CHANGE_EXERCISE'+id),
  ])
}

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
          buttons: exerciseButtons(item.id)
        }))
      }
    }
    
    return response;
  }

  
}