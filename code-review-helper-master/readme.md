[toc]

# Code Review Helper

This repository provides a series of helpful tools for the construction of code review culture

## Tool List

### notifyAssignees
#### Background
When someone creates a merge request, he may need to notify the assignees of the merge request.
Use this tool in your CI pipeline and then the assignees of the merge request can be automatically notified.

#### Usage
This tool will pull the assignees of the merge request from a git platform, and notify them by a IM service.
By now, we support gitlab as a data source, and we support seatalk as a IM service.
Take gitlab as the data source and seatalk as the IM service as an example

+ Step 1: Create a seatalk system account in your seatalk group
+ Step 2: Add this tool in your CI pipeline
  You can edit your ci pipeline config file (in most case, it is `.gitlab-ci.yaml`) to add the following code
  ```yaml
  CodeReviewHelper:
    stage: test
    only:
      - merge_requests
    script:
      - yarn config set registry https://npm.shopee.io/
      - yarn global add @infra/code-review-helper
      - code-review-helper notifyAssignees true default
  ```
  The code-review-helper command has three parameters:
    + The first parameter `notifyAssignees` is the tool name
    + The second parameter is optional, it specifies whether to fail the pipeline when the tool reports
      an error, default is 'true'
    + The third parameter is optional, it specifies a tool-set name which appoints the data source and IM service,
      and the default value is `default` which use Gitlab and Seatalk as the data source and IM service.

+ Step 3: Configure variables in gitlab (if you has been configured, this step can be skipped)
  1. Created **gitlab api token** at `https://git.garena.com/${Your project's namespace}/${Your project's name}/-/settings/`
    + Need the access permission of three scopes: api, read_api, read_repository
  2. Open `https://git.garena.com/${Your project's namespace}/${Your project's name}/-/settings/ci_cd`
  3. Expand **Variables** section
  4. Click **Add variable** to add two variables
     + CR_NOTIFY_ROBOT_WEBHOOK: The webhook address of seatalk system account
     + PERSONAL_TOKEN: The gitlab api token created in point 1
+ Step 4: Create a merge request to test
  + Note: Be sure to select `assignees` when creating an MR. If you forget it, you need to retry the pipeline job
   after editing the MR (simply editing the MR will NOT trigger the pipeline to restart)

### changesSizeLimit
#### Background
You may need to limit the size of the changes in a merge request.
Use this tool in your CI pipeline and then the pipeline will fail if the size of the changes is larger than the limit.

#### Usage
This tool will pull the changes of the merge request from a git platform.
By now, we support gitlab as a data source. Now we take gitlab as the data source as an example.

+ Step 1: Add this tool in your CI pipeline
  You can edit your ci pipeline config file (in most case, it is `.gitlab-ci.yaml`) to add the following code

  ```yaml
  CodeReviewHelper:
    stage: test
    only:
      - merge_requests
    script:
      - yarn config set registry https://npm.shopee.io/
      - yarn global add @infra/code-review-helper
      - code-review-helper changesSizeLimit true 300 '.+\.lock$' 'package-lock.json'
  ```
  The code-review-helper command has these parameters:
  + The first parameter `changesSizeLimit` is the tool name
  + The second parameter is optional, it specifies whether to fail the pipeline when the tool reports
    an error, default is 'true'
  + The third parameter is optional, it specifies the limit of the size of the changes, default is 9999
  + The rest parameter is optional, it specifies the file name pattern which will be ignored, default is empty, you can
    use `.+\.lock$` to ignore all lock files like `yarn.lock`

+ Step 2: Configure variables in gitlab (if you has been configured, this step can be skipped)
  1. Created **gitlab api token** at `https://git.garena.com/${Your project's namespace}/${Your project's name}/-/settings/`
     + Need the access permission of three scopes: api, read_api, read_repository
  2. Open `https://git.garena.com/${Your project's namespace}/${Your project's name}/-/settings/ci_cd`
  3. Expand **Variables** section
  4. Click **Add variable** to add a variables
     + PERSONAL_TOKEN: The gitlab api token created in point 1
+ Step 3: Create a merge request to test
  + Note: This tool will skip check when MR's title contains '--skip-mr-size-limit'

### pipelineFailureNotification
#### Background
When MR-check pipeline fails, the author of the MR may want to know which job is failed on IM tools like seatalk.
Use this tool in your CI pipeline and then the failed pipeline will send a notification to the author of the MR.

#### Usage
By now, we support gitlab as a data source, and we support seatalk as a IM service.
Take gitlab as the data source and seatalk as the IM service as an example:

+ Step 1: Create a seatalk system account in your seatalk group
+ Step 2: Add this tool in your CI pipeline
  You can edit your ci pipeline config file (in most case, it is `.gitlab-ci.yaml`) to add the following code

  ```yaml
  PipelineFailedNotifition:
  stage: error
  rules:
    - if: $CI_MERGE_REQUEST_IID # will always be true if pipeline is triggered by a merge request
      when: on_failure
  script:
    - yarn config set registry https://npm.shopee.io/
    - yarn global add @infra/code-review-helper
    - code-review-helper pipelineFailureNotification
  ```
  Note: The stage here should be behind all other stages, errors generated by stages after this stage will be ignored

+ Step 3: Configure variables in gitlab (if you has been configured, this step can be skipped)
  1. Created **gitlab api token** at `https://git.garena.com/${Your project's namespace}/${Your project's name}/-/settings/`
  + Need the access permission of three scopes: api, read_api, read_repository
  2. Open `https://git.garena.com/${Your project's namespace}/${Your project's name}/-/settings/ci_cd`
  3. Expand **Variables** section
  4. Click **Add variable** to add two variables
    + CR_NOTIFY_ROBOT_WEBHOOK: The webhook address of seatalk system account
    + PERSONAL_TOKEN: The gitlab api token created in point 1

+ Step 4: Create a merge request to test

### mergeRequestStatusNotifier
#### Background
An merge request will repeatedly change in the following states:
+ WIP_OR_DRAFT: The MR is created but the work is not finished yet.
+ PIPELINE_FAILED: The check-pipeline for this merge request failed.
+ PENDING: The MR is created but no one has reviewed the MR.
+ TIMEOUT: The MR is created but no one has reviewed the MR for a long time.
+ CR_FINISHED: The MR is reviewed and the author need to solve the problem which review found.
+ RESOLVED: The author has solved all the problem (comment) and the MR is ready to be re-review.
+ APPROVED: The MR is approved by the reviewer.

When a merge request is reviewing, we may need to notify reviewers or the author in these cases:

+ TIMEOUT: we may need to remind the reviewer to review the MR.
+ CR_FINISHED: we may need to remind the author to solve the problem which review found.
+ RESOLVED: we may need to remind the reviewer to review the MR again.
+ APPROVED: we may need to remind the author to merge the MR.

We may need a tool to automatically notify the author and reviewers on the above cases.

#### Usage

+ Step 1: Add this tool in your CI pipeline
  You can edit your ci pipeline config file (in most case, it is `.gitlab-ci.yaml`) to add the following code
  ```yaml
  mr_urge_notify:
  stage: test
  only:
    - trigger
  script:
    - yarn config set registry https://npm.shopee.io/
    - yarn global add @infra/code-review-helper
    - code-review-helper mergeRequestStatusNotifier 120 30
  ```
  The code-review-helper command has three parameters:
  + The first parameter `mergeRequestStatusNotifier` is the tool name
  + The second parameter is optional, it specifies how many minutes after the MR is created,
  the MR is considered to be TIMEOUT state, default to 60
  + The third parameter is optional, it specifies how many minutes after the latest comment created by reviewer,
  the MR is considered to be CR_FINISHED state, default to 60

+ Step 2: Create a trigger token for pipeline
  1. open `https://git.garena.com/${Your project's namespace}/${Your project's name}/-/settings/ci_cd`
  2. Expand **Pipeline triggers** section
  3. Input the description and click **Add trigger**

  Note: We need to create a cron job to run this tool, but due to bug of current version(13.7) of gitlab at shopee,
  we can not use the [pipeline schedule feature](https://docs.gitlab.com/ee/ci/pipelines/schedules.html).
  We need to use other corn job tool to run this tool like `crontab` or `cronie`.
  The cron job should trigger the pipeline by trigger token, that is why we need this step.

+ Step 3: Create a cronjob to trigger pipeline to run the tools
  Example:

  + Create a file named  notify.sh

  ```shell
  #!/bin/bash
  # notify.sh
  curl -X POST  -F token=${trigger token} -F ref=master https://git.garena.com/api/v4/projects/${gitlab project id}/trigger/pipeline
  ```
  Note: ref is the branch name which contains the code at step 1.

  + Create a cronjob

  ```shell
  */60 * * * * sh path/to/notify.sh
  ```

+ Step 4: Testing
  You can test the tool by running `notify.sh` manually, or you can wait for corn job to run it.
