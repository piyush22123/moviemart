const ImageKit = require("@imagekit/nodejs");
const { URLEndpoints } = require("@imagekit/nodejs/resources/accounts/url-endpoints.js");

const ImageKitClient = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    URLEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

async function uploadFile(buffer) {
    const result = await ImageKitClient.files.upload({
        file: buffer,
        fileName: "movie_" + Date.now(),
        folder: "moviesMart/moviePosters"
    })
    return result;
}

module.exports = { uploadFile };