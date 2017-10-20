'use latest';
import fetch from 'isomorphic-fetch'
import marked from 'marked'
import mailgun from 'mailgun-js'
const config = {
  from: 'Eric Wooley <ericwooley@gmail.com>',
  subject: 'Thanks for contributing!'
}


module.exports = function(context, cb) {
  try {
    const payload = JSON.parse(context.body.payload)
    const repoName = payload.repository.full_name
    const mailer = mailgun(({apiKey: context.secrets.MAILGUN_API_KEY, domain: context.secrets.MAILGUN_DOMAIN}))
    const userApi = payload.sender.url + '?access_token=' + context.secrets.GITHUB_ACCESS_TOKEN
    console.log('checkign api', userApi)
    return Promise.all([
      getContent(repoName),
      getUserEmail(userApi)
    ])
    .then(values => {
      console.log('got values', values)
      return ({email: values[1], text: values[0], html: values[0].html})
    })
    .then((values) => sendEmail(mailer.messages().send, values.email, values.text, values.html))
    .then(() => )
    .catch(e => cb(null, e.message || "unknown error"))
  } catch (e) {
    console.log('error', e)
    cb(null, e.message || 'unknown error');  
  }
};

const getUserEmail = (userUrl) => 
  fetch(userUrl).then(response => response.json()).then(body => body.email)
  
const getContent = (repoName) => 
  fetch(`https://raw.githubusercontent.com/${repoName}/master/CONTRIBUTING.md`)
    .then(response => response.text())
    .then((text) => ({text, html: marked(text)}))
    
const sendEmail = (mailSender, to, text, html) => 
  new Promise((resolve, reject) => 
    mailSender({
      from: config.from,
      to,
      subject: config.subject,
      text,
      html
    }, function (error, body) {
      if(error) return reject(error)
      resolve(body)
    }
  )
)
  