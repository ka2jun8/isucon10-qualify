#!/bin/sh

cd webapp/nodejs/
npm i --no-save
npm run build
sudo systemctl restart isuumo.nodejs.service
cd ../../bench
./bench

