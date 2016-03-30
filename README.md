Establishing:
Heroku login

Deploying to Development Site:
git add .
git commit -m "message"
git push development master
heroku logs --tail

Deploying to Production:
git push heroku master

Rebasing:
git log origin/master..master
git rebase -i origin/master --> git push origin master
git push -f heroku master
