'use latest';
import fetch from 'isomorphic-fetch'
import marked from 'marked'
module.exports = function(context, cb) {
  try {
    const payload = JSON.parse(context.body.payload)
    const repoName = payload.repository.full_name
    const userApi = payload.sender.url + '?access_token=' + context.secrets.GITHUB_ACCESS_TOKEN
    return Promise.all([
      getContent(repoName),
      getUserEmail(userApi)
    ]).then((values) => cb(null, {content: values[0], user: values[1]}))
    .catch(e => cb(null, e))
  } catch (e) {
    console.log('error', e)
    cb(null, new Error('could not parse payload'));  
  }
};

const getUserEmail = (userUrl) => 
  fetch(userUrl).then(response => response.json().email)
const getContent = (repoName) => 
  fetch(`https://raw.githubusercontent.com/${repoName}/master/CONTRIBUTING.md`)
    .then(response => response.text())
    .then(marked)
