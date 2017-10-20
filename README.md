# contribute-emailer

## Installation
Create a [webtask.io](webtask.io) with the code from `./contribute-response.js`

1. You need to get a [personal access token](https://github.com/settings/tokens/) with the `user:email` scope.
  * Set a secret with a key `GITHUB_ACCESS_TOKEN` to that token
1. You need a api key and a domain (sandbox works for me) from [Mailgun](https://app.mailgun.com)
  * Set a secret with a key `MAILGUN_API_KEY` to the api key
  * Set a secret with a key `MAILGUN_DOMAIN` to the domain
1. Add a webhook to your repo `https://github.com/<your username>/<your repo>/settings/hooks`
  * Add a webhook to the url from your webhook.io function url.
  * Under `Which events would you like to trigger this webhook?` Select `Issues` and `Pull Requests`
  
That should be it! Create an issue and give it a shot.

If you want to just test it out, you can use my webhook. `https://wt-958a2aa25d83ea42bd92806c5a3a4c7e-0.run.webtask.io/contribute-response` instead of creating your own. I am just using the mailgun sandbox account, so I can't say that it will always work (in the event that someone starts abusing it, it will probably hit the mailgun quota). 
