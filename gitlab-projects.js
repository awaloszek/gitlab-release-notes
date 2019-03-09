var client = require('./gitlab-client');

function getById(id, response) {
    client.get('projects/' + id, response);
}

module.exports.getById = getById;