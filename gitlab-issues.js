const client = require('./gitlab-client');

function getClosedMilestones(pid, response) {

    client.getAllPages('projects/' + pid + '/milestones?state=closed', addIssuesToMilestones);

    function addIssuesToMilestones(milestones) {

        var queue = Array.from(milestones);

        loadIssues(queue.pop());

        function loadIssues(milestone) {

            client.getAllPages('projects/' + pid + '/milestones/' + milestone.id + '/issues', addIssuesToMilestone);

            function addIssuesToMilestone(issues) {
                milestone.issues = issues;

                if (queue.length == 0)
                    response(milestones);
                else 
                    loadIssues(queue.pop())
            }
        }
    }
}

module.exports.getClosedMilestones = getClosedMilestones;
