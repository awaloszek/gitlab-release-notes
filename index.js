#!/usr/bin/env node
const input = require('commander');
const compare = require('./compare.js');
const issues = require('./gitlab-issues.js');
const wiki = require('./gitlab-wiki.js');
const projects = require('./gitlab-projects.js');
const client = require('./gitlab-client.js');
const log = require('./log.js');

input
    .option('-H, --host <hostname>', 'target hostname')
    .option('-t, --token <token>', 'login token')
    .option('-p, --project <projectId>', 'id of the project')
    .option('-l, --labels <labels>', 'a comma separated list of labels', tags => tags.split(','))
    .option('-s, --sort <value>', 'value is one of [version, due, start, name]')
    .option('-d, --direction <direction>', 'direction is one of [asc, desc]')
    .option('-v, --verbose')
    .option('-D, --dryRun', 'dry run does not update the wiki page, but output the markdown to the console')
    .parse(process.argv);


if (!input.host || !input.token || !input.project) {
    input.outputHelp();
    return;
}

if (input.verbose)
    log.setLevel(log.LEVEL_INFO);

client.config.hostname = input.host;
client.config.token = input.token;
const pid = input.project;

projects.getById(pid, project => {

    issues.getClosedMilestones(pid, milestones => {
        milestones.sort(sortOrder(input.sort, input.direction));

        let page = new wiki.Page('release-notes', 'Release Notes', '');

        milestones.reverse().forEach(milestone => {
            page.content += '# ' + milestone.title + '\n';

            milestone.issues.forEach(issue => {
                page.content += '* ' + project.path_with_namespace + '#' + issue.iid + '\t';

                for (let element of input.labels)
                    if (issue.labels.includes(element))
                        page.content += ' ~' + element + '\t';

                page.content += issue.title + '\n';
            });

            page.content += '\n';
        });

        if (!input.dryRun)
            wiki.update(pid, page);
        else
            console.log(page);
    });
});

function sortOrder(sort, direction) {
    if (sort === undefined)
        sort = 'due';

    if (direction === undefined)
        direction = 'desc';

    switch (sort) {
        case 'version':
            return direction === 'asc' ? compare.byVersion('asc') : compare.byVersion('desc');
        case 'due':
            return direction === 'asc' ? compare.byDueDate('asc') : compare.byDueDate('desc');
        case 'start':
            return direction === 'asc' ? compare.byStartDate('asc') : compare.byStartDate('desc');
        case 'name':
            return direction === 'asc' ? compare.byName('asc') : compare.byName('desc');
    }

    return compare.byDueDate('desc');
}