#!/bin/bash
cp ./manifest.json ./src/manifest.json
echo "generating extension on mac"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --pack-extension=./src --pack-extension-key=./plugin.pem --no-message-box
mv src.crx plugin.crx
echo "new plugin is in plugin.crx"

#cleaning up
rm ./src/manifest.json
echo "done"
