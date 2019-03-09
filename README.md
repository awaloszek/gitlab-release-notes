# gitlab-release-notes
This command line tool is a helper that creates a GitLab Wiki Page with all closed Subjects by closed Milestones for a selected Project that can act as a Release Notes Page for the Project.

```shell
Usage: gitlab-release-notes [options]

Options:
  -H, --host <hostname>        target hostname
  -t, --token <token>          login token
  -p, --project <projectId>    id of the project
  -l, --labels <labels>        a comma separated list of labels
  -s, --sort <value>           value is one of [version, due, start, name]
  -d, --direction <direction>  direction is one of [asc, desc]
  -v, --verbose                
  -D, --dryRun                 dry run does not update the wiki page, but output the markdown to the console
  -h, --help                   output usage information
```
