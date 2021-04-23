#!/usr/bin/bash

apt-get update
apt-get upgrade
apt-get install nodejs
apt-get install wget
npm audit fix
npm i imgbb-uploader
npm cache clean -f
npm install --also=dev
npm i got
npm install utf8

echo "[*] All dependencies have been installed, please run the command \"npm start\" to immediately start the script"
echo "Updates : fix Bugs"
