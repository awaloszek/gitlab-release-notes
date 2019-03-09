const https = require('https');
const log = require('./log.js');

const config = new function () {
    let hostname = null;
    let token = null;
};

function Option(path, method) {
    this.hostname = config.hostname;
    this.port = 443;
    this.path = '/api/v4/' + path;
    this.method = method;
    this.headers = { 'Private-Token': config.token }
}

function get(path, response) {
    let options = new Option(path, 'GET');

    let data = '';

    const req = https.request(options, (res) => {

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                try {
                    data = JSON.parse(data);
                } catch (ex) {
                    log.error('Error parsing response');
                }
                response(data);
            }
        });
    });

    req.on('error', (e) => log.error('Error while requesting data'));

    req.end();
}

function getAllPages(path, response) {
    getPage(path, 1, response, null);
}

function getPage(path, page, response, result) {

    let options = new Option(path + (path.includes('?') ? '&' : '?') + 'page=' + page, 'GET');

    let data = '';

    const req = https.request(options, (res) => {
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                try {
                    data = JSON.parse(data);
                    if (result)
                        data = data.concat(result);
                } catch (ex) {
                    log.error('Error parsing response');
                }

                if (res.headers['x-next-page'] && res.headers['x-next-page'].length !== 0) {
                    getPage(path, res.headers['x-next-page'], response, data)

                } else
                    response(data);

            }
        });
    });

    req.on('error', (e) => log.error('Error while requesting data'));

    req.end();
}


function put(path, content) {
    let option = new Option(path, 'PUT');

    option.headers['Content-Length'] = Buffer.byteLength(content);
    option.headers['Content-Type'] = 'application/json; charset=utf-8';

    const req = https.request(option, (res) => {
        log.info(`STATUS: ${res.statusCode}`);
        log.info(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            log.info(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            log.info('No more data in response.');
        });
    });

    req.on('error', (e) => {
        log.error(`problem with request: ${e.message}`);
    });

    req.write(content);

    req.end();

}

module.exports.get = get;
module.exports.put = put;
module.exports.getAllPages = getAllPages;
module.exports.config = config;