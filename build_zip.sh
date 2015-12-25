#hautomatic extension
cp ./plugin.pem ./src/key.pem
cp ./manifest.json ./src/manifest.json
cd src
rm ~/tmp/parag-plugin.zip
zip -r ~/tmp/parag-plugin.zip *
cd ..
rm ./src/key.pem

#cleaning up

rm ./src/manifest.json