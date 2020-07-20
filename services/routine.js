'use strict';

const Response = require('./response');

module.exports = class Routine {

  static handlePayload(payload) {
    let response; 
    
    let exercises_dummy = [
      {
        id: 1,
        image_url : 'https://lifeasmenhome.files.wordpress.com/2019/05/kisspng-squat-barbell-exercise-weight-training-lunge-barbell-squat-5b264642e91212.6421240615292350109547.png',
        title:'바벨 스쿼트',
        subtitle: '달성 목표: 125kg * 5회',
      },
      {
        id: 2,
        image_url : 'https://i.ytimg.com/vi/XSza8hVTlmM/maxresdefault.jpg',
        title:'벤치 프레스',
        subtitle: '달성 목표: 90kg * 5회'
      }
    ]


    if (payload.includes('TODAY_EXERCISE')) {
      //button 추가
      const exerciseButtons = (id) => {
        return ([
          Response.genPostbackButton('시작하기', 'START_EXERCISE'+id),
          Response.genPostbackButton('관련 영상', 'SHOW_VIDEO_LIST'+id),
          Response.genPostbackButton('변경하기', 'CHANGE_EXERCISE'+id),
        ])
      }

      let exercises = exercises_dummy.map((item) => {
        return ({...item, buttons: exerciseButtons(item.id)});
      })

      console.log(exercises);

      response = [
        Response.genText('오늘 할 운동입니다.'),
        Response.genGenericTemplateSlide(exercises)
      ]
    } else if (payload.includes('START_EXERCISE')) {
      const exercise_id = parseInt(payload.charAt(payload.length-1));
      response = [
        Response.genText(
          `${exercises.filter(item => item.id === exercise_id)[0].title} 시작`
        )
      ]
    } else {
      response = [
        Response.genText('아직 준비가 안되었습니다.')
      ]
    }

    return response;
  }
}