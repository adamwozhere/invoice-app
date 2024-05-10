#!/bin/bash

echo "Build script"

# add the commands here
echo "Installing server dependencies"
npm install
npm run build

echo "Installing client dependencies"
cd ../client
npm install
npm run build

echo "Copying client/dist to server/dist"
cp -r dist ../server/dist
