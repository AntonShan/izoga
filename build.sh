yarn run build

node --experimental-sea-config sea-config.json

node -e "require('fs').copyFileSync(process.execPath, 'dist/izoga.exe')"

signtool remove //s dist/izoga.exe

npx postject dist/izoga.exe NODE_SEA_BLOB dist/sea-prep.blob \
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

signtool sign //fd SHA256 dist/izoga.exe
