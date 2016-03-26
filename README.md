Starting:

heroku login



Deploying to Heroku:

git add .

git commit -m "message"

git push heroku master

heroku logs --tail



Rebasing:

git log origin/master..master

git rebase -i origin/master --> git push
