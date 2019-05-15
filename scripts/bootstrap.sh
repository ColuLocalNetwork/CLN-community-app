npm run lerna:bootstrap

for D in `find ../contracts -type d -d 1`
do
    (cd $D && npm run build)
done
