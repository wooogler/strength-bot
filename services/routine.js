'use strict';

const Response = require('./response');

module.exports = class Routine {
  static handlePayload(payload) {
    let response; 
    
    let exercises = [
      {
        id: 1,
        image_url : 'https://lifeasmenhome.files.wordpress.com/2019/05/kisspng-squat-barbell-exercise-weight-training-lunge-barbell-squat-5b264642e91212.6421240615292350109547.png',
        title:'바벨 스쿼트',
        subtitle: '달성 목표: 125kg * 5회'
      },
      {
        id: 2,
        image_url : 'https://i.ytimg.com/vi/XSza8hVTlmM/maxresdefault.jpg',
        title:'벤치 프레스',
        subtitle: '달성 목표: 90kg * 5회'
      }
    ]

    switch(payload) {
      case 'TODAY_EXERCISE': {
        response = [
          Response.genText('오늘 할 운동입니다.'),
          Response.genGenericTemplateSlide(
            exercises, 
            [
              Response.genPostbackButton('시작하기', 'START_EXERCISE'),
              Response.genPostbackButton('관련 영상', 'SHOW_VIDEO_LIST'),
              Response.genPostbackButton('변경하기', 'CHANGE_WORKOUT'),
            ]
          )
        ]
        break;
      }
      case 'START_EXERCISE': {

        break;
      }
      
    }
  }
}