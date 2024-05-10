#!/bin/bash

echo "Build script"

# add the commands here
npm install
cd ../client
npm install
cd ../server
npm run build:full