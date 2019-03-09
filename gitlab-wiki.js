var client = require('./gitlab-client');

function Page(slug, title, content) {
    this.format = 'markdown';
    this.slug = slug;
    this.title = title;
    this.content = content;
}

function update(pid, page) {
    const content = JSON.stringify(page);
    client.put('projects/' + pid + '/wikis/' + page.slug, content);
}

module.exports.update = update;
module.exports.Page = Page;
