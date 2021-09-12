const { create, globSource } = require('ipfs-http-client')
const assetsJson = require('./asset_config.json')
const ipfs = create({host: '127.0.0.1', port: 5001, protocol: 'http'})
fs = require('fs');
const {pinFileToIPFS, testAuthentication, pinJSONToIPFS} = require('./pinata.services.js')
const axios = require('axios')

function randomIntFromInterval(min, max) { // min and max included 
    return Math.random() * (max - min) + min
}

async function insertData(asset) {
    var files = fs.readdirSync(`${asset.path}/Run/`);
    Promise.all(files.map(file => {
        return pinFileToIPFS(`${asset.path}/Run/${file}`)
    })).then(async result => {
        const data = {
            name: asset.name,
            run_action: result,
            base_speed: 100,
            red_barricade: randomIntFromInterval(0.8, 1.5),
            green_barricade: randomIntFromInterval(0.8, 1.5),
            yellow_barricade: randomIntFromInterval(0.8, 1.5),
            blue_barricade: randomIntFromInterval(0.8, 1.5),
            ping_barricade: randomIntFromInterval(0.8, 1.5),
            black_barricade: randomIntFromInterval(0.8, 1.5),
        }
        const res = await pinJSONToIPFS(JSON.stringify(data))
        fs.writeFile(`assets_info/${asset.name}.json`, JSON.stringify({metadata: data, pindataMetadata: res}), function (err) {
            if (err) return console.log(err);
            console.log(`${asset.name} > ${asset.name}.json`);
        });
    })
} 


assetsJson.assets.forEach(async (asset, index) => {
    setTimeout(function(){
        insertData(asset)
   },1000 * 60 * 2 * index); //delay is in 2 minutes 
})
