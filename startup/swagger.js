const config = require("config");
const swaggerAutogen = require('swagger-autogen')()

const swagger = async function () {
    let host = config.get("apiHost");
    const doc = {
        swagger: "2.0",
        info: {
            title: 'Informing Science API',
            description: 'API documentation for Informing Science.',
            version: '1.0.0'
        },
        host,
        schemes: ['https', 'http']
    };

    const outputFile = './swagger_output.json';
    const endpointsFiles = ['./startup/routes.js'];
    await swaggerAutogen(outputFile, endpointsFiles, doc);
};

module.exports = swagger;

