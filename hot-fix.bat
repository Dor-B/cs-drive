ECHO OFF
git branch | find "* master" > NUL & IF ERRORLEVEL 1 (
    ECHO Go to master branch first!
) ELSE (
    git add -A
    git commit -m %1
    git push
    git checkout stable
    git merge master
    git push
    npm run build
    firebase deploy --only hosting -m %1
    git checkout master
)
