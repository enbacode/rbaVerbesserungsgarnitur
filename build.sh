sudo npm install -g yarn@berry &&
rm -r dist/;
yarn &&
yarn run build &&
cp -rf src/icons/* dist
