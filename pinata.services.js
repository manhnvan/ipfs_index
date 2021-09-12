const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const pinataApiKey = '245cb606236d94884a04'
const pinataSecretApiKey = 'c8f446f2ca3a61dedbb3878990689daaf4ad59cc93287cd11601758e1b257b29'

const pinFileToIPFS = async (filePath) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let data = new FormData();
    data.append('file', fs.createReadStream(filePath));
    return axios
        .post(url, data, {
            maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey
            }
        }).then(function (response) {
            return response.data
        }).catch(function (error) {
            return false
        });
};

const testAuthentication = () => {
    const url = `https://api.pinata.cloud/data/testAuthentication`;
    return axios
        .get(url, {
            headers: {
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey
            }
        }).then(function (response) {
            //handle response here
            return response.data
        })
        .catch(function (error) {
            //handle error here
            console.log(error.data)
            return false
        });
};

const pinJSONToIPFS = (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, JSONBody, {
            headers: {
                "Content-type": "application/json; charset=utf-8",
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            }
        })
        .then(function (response) {
            console.log(response)
            return response.data
        })
        .catch(function (error) {
            //handle error here
            return false
        });
};

module.exports = {
    pinFileToIPFS,
    pinJSONToIPFS,
    testAuthentication
}