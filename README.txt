VERSIONS

Distro: Ubuntu 18.04.2 LTS (via WSL)
nodejs: v10.18.1
npm:    6.13.4

BUILDING

Step 1: Install yarn

npm install -g yarn@berry

Step 2: Delete dist/ directory if existent

rm -r dist/

Step 3: Install all dependencies via npm:

yarn

Step 4: Build & bundle with webpack:

yarn run build

Step 5: Manually copy icons:

cp -r src/icons/* dist

This should reproduce the exact same output as provided in the uploaded extension zip file.