cd ./blockchain
node ./seed-account-with-erc20/dai.js
if truffle migrate --reset ; then
    cd ../client
    npm start
else
    echo "compilation failed"
fi