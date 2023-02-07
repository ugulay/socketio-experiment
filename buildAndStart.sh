#!/bin/bash

#echo "Installing NPM Packages"
#npm install

echo "Run npm run build"
npm run build

echo "Run npm run start:gui"
npm run start:gui

echo "Run npm run start:server"
npm run start:server