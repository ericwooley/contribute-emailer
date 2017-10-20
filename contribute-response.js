'use latest';
import fetch from 'isomorphic-fetch'
import marked from 'marked'
import mailgun from 'mailgun-js'
const config = {
  from: 'Eric Wooley <ericwooley@gmail.com>',
}


module.exports = function(context, cb) {
  try {
    const payload = JSON.parse(context.body.payload)
    const repoName = payload.repository.full_name
    const mailer = mailgun(({apiKey: context.secrets.MAILGUN_API_KEY, domain: context.secrets.MAILGUN_DOMAIN}))
    const userApi = payload.sender.url + '?access_token=' + context.secrets.GITHUB_ACCESS_TOKEN
    return Promise.all([
      getContent(repoName),
      getUserEmail(userApi)
    ])
    .then(values => {
      return ({email: values[1], text: values[0].text, html: values[0].html})
    })
    .then((values) => console.log('made it to here', values) || values)
    .then((values) => sendEmail(mailer, values.email, values.text, values.html, repoName))
    .then((body) => cb(null, body))
    .catch(e =>{
      console.log('catch error', e, e.stack)
      cb(null, e.message || "unknown error")
    })
  } catch (e) {
    console.log('startup error', e, e.stack)
    cb(null, e.message || 'unknown error');  
  }
};

const getUserEmail = (userUrl) => 
  fetch(userUrl).then(response => response.json()).then(body => body.email)
  
const getContent = (repoName) => 
  fetch(`https://raw.githubusercontent.com/${repoName}/master/CONTRIBUTING.md`)
    .then(response => response.text())
    .then((text) => ({text: text, html: marked(text)}))
    
const sendEmail = (mailSender, to, text, html, repoName) => {
    console.log('sending mail', config.from, to, config.subject, text, html, repoName)
    mailSender.messages().send({ 
      from: config.from,
      to: to,
      subject: `Thanks for contributing to ${repoName}! Just a couple guidelines`,
      // text: text, // breaks when you do both? Maybe becuase this version of mailgun-js is very old?
      html: html
    })
}
  