#!/bin/bash

echo "Invoice App build script"

echo "Installing server dependencies"
npm install && npm run build &&

echo "Installing client dependencies"
cd ../client && npm install && npm run build &&

echo "Copying client/dist to server/dist"
cp -r dist ../server/dist
