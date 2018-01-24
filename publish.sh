#!/bin/sh
rm -rf demo/$3
rm -rf log.txt

wait

cd demo

echo "git clone -o $1 $2" >> ../log.txt

git clone -o $1 $2

cd $3

echo "cnpm install" >> ../../log.txt

cnpm install

npm run build >> ../../log.txt

cp -rf './dist' '../../project'

cd ../../project

pm2 delete all

pm2 start prod.server.js --name project