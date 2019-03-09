const client = require('./gitlab-client');

function getClosedMilestones(pid, response) {

    client.getAllPages('projects/' + pid + '/milestones?state=closed', addIssuesToMilestones);

    function addIssuesToMilestones(milestones) {

        milestones.forEach(milestone => {

            client.getAllPages('projects/' + pid + '/milestones/' + milestone.id + '/issues', addIssuesToMilestone);

            function addIssuesToMilestone(issues) {
                milestone.issues = issues;
                if (requestIsDone())
                    response(milestones);
            }

            function requestIsDone() {
                for (const milestone of milestones) {
                    if (!('issues' in milestone))
                        return false;
                }
                return true;
            }
        });
    }
}

module.exports.getClosedMilestones = getClosedMilestones;
