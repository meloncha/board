// public/js/script.js

$( () => {
  const get2digits = (num) => {
    return `0${num}`.slice(-2);
  }

  const getDate = (dateObj) => {
    if(dateObj instanceof Date)
      return `${dateObj.getFullYear()}-${get2digits(dateObj.getMonth()+1)}-${get2digits(dateObj.getDate())}`;
  }

  const getTime = (dateObj) => {
    if(dateObj instanceof Date)
      return `${get2digits(dateObj.getHours())}:${get2digits(dateObj.getMinutes())}:${get2digits(dateObj.getSeconds())}`;
  }

  const convertDate = () => {
    $('[data-date]').each((index,element) => {
      let dateString = $(element).data('date');
      if(dateString){
        let date = new Date(dateString);
        $(element).html(getDate(date));
      }
    });
  }

  const convertDateTime = () => {
    $('[data-date-time]').each((index,element) => {
      let dateString = $(element).data('date-time');
      if(dateString){
        let date = new Date(dateString);
        $(element).html(`${getDate(date)} ${getTime(date)}`);
      }
    });
  }

  convertDate();
  convertDateTime();
});



/*
    node.js 서버에서 사용하는 코드가 아니고, client의 브라우저에서 사용하게 될 JavaScript
    그래서 public 폴더에 들어 있으며, head.ejs 파일에 이 파일을 불러오는 코드가 작성된다
    
    convertDate 함수 : html element 중에 data-date가 있는 것을 찾는다
    data-date에 날짜 데이터가 들어 있으면, 해당 데이터를 '년-월-일'의 형태로 변환해서
    element의 텍스트 데이터로 넣는다

    converDateTime 함수 : data-date-time을 찾아서 '년-월-일 시:분:초'의 형태로 변환해서 출력
    이유는 JavaScript에서 날짜/시간을 원하는 형태(format)으로 만들기 위해서이다.

    이 script는 jQuery를 사용하여 작성되었습니다.
*/
