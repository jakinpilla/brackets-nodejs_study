var url = require('url');

// 주소 문자열을 URL 객체로 만들기
var curlURL = url.parse('https://m.search.naver.com/search.naver?query=steve+jobs&where=m&sm=mtp_hty');

// URL 객체를 주소 문자열로 만들기
var curStr = url.format(curlURL);

console.log('주소 문자열: %s', curStr);
console.dir(curlURL);

// 요청 파라미터 구분하기
var querystring = require('querystring');
var param = querystring.parse(curlURL.query);

console.log('요청 파라미터 중 query의 값: %s', param.query);
console.log('원본 요청 파라미터: %s', querystring.stringify(param));


