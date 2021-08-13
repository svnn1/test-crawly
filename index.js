const axios = require("axios");
const cheerio = require("cheerio");

const urlCrawly = "http://applicant-test.us-east-1.elasticbeanstalk.com";

const replaceToken = (token) => {
  let replacements = {
      'a': '\x7a',
      'b': '\x79',
      'c': '\x78',
      'd': '\x77',
      'e': '\x76',
      'f': '\x75',
      'g': '\x74',
      'h': '\x73',
      'i': '\x72',
      'j': '\x71',
      'k': '\x70',
      'l': '\x6f',
      'm': '\x6e',
      'n': '\x6d',
      'o': '\x6c',
      'p': '\x6b',
      'q': '\x6a',
      'r': '\x69',
      's': '\x68',
      't': '\x67',
      'u': '\x66',
      'v': '\x65',
      'w': '\x64',
      'x': '\x63',
      'y': '\x62',
      'z': '\x61',
      '0': '\x39',
      '1': '\x38',
      '2': '\x37',
      '3': '\x36',
      '4': '\x35',
      '5': '\x34',
      '6': '\x33',
      '7': '\x32',
      '8': '\x31',
      '9': '\x30'
  };
  
  let newToken = token.split("");
  
  for (let t = 0; t < newToken.length; t++) {
    newToken[t] = replacements.hasOwnProperty(newToken[t]) ? replacements[newToken[t]] : newToken[t];
  }

  return newToken.join("");
};

const getAnswerResult = async (url, { cookie, token }) =>  {
  const response = await axios({
    url: url,
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "cookie": cookie,
      "Referer": "http://applicant-test.us-east-1.elasticbeanstalk.com/",
    },
    data: `token=${token}`,
  });

  const $ = cheerio.load(response.data);
  
  const answer = $("#answer").text();

  if (!answer) {
    return "Resposta não encontrada!";
  }

  return answer;
};

const getResult = async (url) => {
  const response = await axios({
    url: url,
    method: "GET",
  });

  const cookie = response.headers['set-cookie'][0].slice(0, 36);

  const $ = cheerio.load(response.data)

  const oldToken = $("#token").val();

  const token = replaceToken(oldToken);

  return { token, cookie };
};

getResult(urlCrawly)
  .then((token) => getAnswerResult(urlCrawly, token))
  .then((answer) => console.log(`A resposta é: ${answer}`))
  .catch((error) => console.error(error));
