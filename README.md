# Contribute Emailer
Automatically email your contributing guidelines to a contributers public email when they open an issue or pull request.

### [test repo](https://github.com/ericwooley/webtask-test)

## Installation
Create a [webtask.io](webtask.io) with the code from `./contribute-response.js`

1. Put `CONTRIBUTING.md` file at the root of your repo. Github is [encouraging maintainers to add one](https://github.com/blog/1184-contributing-guidelines). This file will be used as the html to send in the body of the email.
1. Get a [personal access token](https://github.com/settings/tokens/) with the `user:email` scope.
  * Set a secret with a key `GITHUB_ACCESS_TOKEN` to that token in webtask
1. Get an api key and a domain (sandbox works for me) from [Mailgun](https://app.mailgun.com)
  * Set a secret with a key `MAILGUN_API_KEY` to the api key in webtask
  * Set a secret with a key `MAILGUN_DOMAIN` to the domain in webtask
1. Add a webhook to your repo `https://github.com/<your username>/<your repo>/settings/hooks`
  * Add a webhook to the url from your webhook.io function url.
  * Set the content type `application/x-www-form-urlencoded`
  * Under `Which events would you like to trigger this webhook?` Select `Issues` and `Pull Requests`
  
That should be it! Create an issue and give it a shot.

If you want to just test it out, you can use my webhook. `https://wt-958a2aa25d83ea42bd92806c5a3a4c7e-0.run.webtask.io/contribute-response` instead of creating your own. I am just using the mailgun sandbox account, so I can't say that it will always work (in the event that someone starts abusing it, it will probably hit the mailgun quota). 


## Testing it out
If you just want to test it out. Head over to my [test repo](https://github.com/ericwooley/webtask-test) and open an issue.

## A few things to keep in mind
This was quickly put together in a few hours. It's not super well tested, its not very polished, and it doesn't have great error checking. All it does is send down an error.message. If you want to make this a staple of your workflow, you might have to put some love into the script.
