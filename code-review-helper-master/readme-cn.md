# Code Review Helper



> 本工具为 CodeReview 文化建设提供了系列工具
> - notifyAssignees 当 MR 被创建时，能过提醒对应的 assignees
> - changesSizeLimit 当 MR 被创建时，能限制 MR 的大小（涉及的函数），并支持添加文件白名单
> - mergeRequestStatusNotifier:
>   1. 每次拉取项目的Mr列表
>   2. 分别计算Mr状态：CR完成/超时未CR/等待CR/CR评论Resolved等待reviewer再次review/可合入
>     + CR完成：Mr的状态是opened且没有approved，评论数不为0，且最后一条评论时间距离当前执行时间大于crFinishedGapTime（mergeRequestStatusNotifier函数的第二个参数，默认是60分钟）--- 此状态后续应该通知MR Author
>     + 超时未CR：Mr的状态是opened且没有approved，评论数为0且当前Mr的创建时间距离当前执行时间大于mrUrgeViewGapTime（mergeRequestStatusNotifier函数的第一个参数，默认是60分钟） --- 此状态后续应该通知MR Reviewer
>     + 等待CR: Mr的状态是opened且没有approved，评论数为0且当前Mr的创建时间距离当前执行时间小于mrUrgeViewGapTime（mergeRequestStatusNotifier函数的第一个参数，默认是60分钟），且存在其它状态的MR --- 此状态在存在其它状态的MR下才会发通知顺带提醒
>     + CR评论Resolved等待reviewer再次review: Mr的状态是opened且没有approved，评论数不为0且评论的resolved状态全部为true --- 此状态后续应该通知MR Reviewer
>     + 可合入: Mr的状态是opened且approved状态为true --- 此状态后续应该通知MR Author
>   3. 遍历MR列表，以人为单位聚合MR发送消息
> - ...(other tools are work-in-progress)

## 用法

### notifyAssignees
以 Gitlab 作为数据源，seatalk 作为提醒工具为例
+ Step 1: 在 gitlab 配置文件 .gitlab-ci.yml 中加入声明
  注意 这里 code-review-helper 后面跟的第一个参数 notifyAssignees 是工具名，第二个参数是工具报错时是否让流水线失败
  第三个参数将传给notifyAssignees用于选择数据源/提醒工具组合，默认为default，表示Gitlab 作为数据源，seatalk 作为提醒工具
  ```yaml
  notifyAssignees:
    stage: test
    only:
      - merge_requests
    script:
      - yarn config set registry https://npm.shopee.io/
      - yarn global add @infra/code-review-helper
      - code-review-helper notifyAssignees
  ```
+ Step 2: 在 gitlab 的变量配置中配置变量 (如果已经配置过，可以忽略)
  1. 在由项目管理员在 `https://git.garena.com/${Your project's namespace}/${Your project's name}/-/settings/` 创建 token
    + 需要支持 api, read_api, read_repository 三个 Scope
  2. 打开 `https://git.garena.com/${Your project's namespace}/${Your project's name}/-/settings/ci_cd`
  3. 展开 Variables 选项卡
  4. 点击 Add variable 添加两个变量：
     | Key                     | Value                                      |
     | ----------------------- | ------------------------------------------ |
     | CR_NOTIFY_ROBOT_WEBHOOK | 已经创建好的 seatalk 的机器人 webhook 地址 |
     | PERSONAL_TOKEN          | 第1小点中创建的token                       |
+ Step 3: 发起 MR 来测试
  + 注意：在创建 MR 的时候一定要选择好 `assignees`，如果忘了，则需要 `retry` 流水线中此工具对应的 `Job`，因为编辑 MR 信息本身是不会触发流水线重新构建的

### changesSizeLimit
以 Gitlab 作为数据源为例
+ Step 1: 在 gitlab 配置文件 .gitlab-ci.yml 中加入声明
  注意 这里 code-review-helper 后面跟的第一个参数 changesSizeLimit 是工具名，第二个参数是工具报错时是否让流水线失败
  第三个参数是限制的行数，如下配置为300行，之后每个参数是文件名白名单（支持正则，不需要正则前后的/，需要引号），从项目根路径开始
  ```yaml
  notifyAssignees:
    stage: test
    only:
      - merge_requests
    script:
      - yarn config set registry https://npm.shopee.io/
      - yarn global add @infra/code-review-helper
      - code-review-helper changesSizeLimit true 300 '.+\.lock$' 'package-lock.json'
  ```
+ Step 2: 在 gitlab 的变量配置中配置变量 (如果已经配置过，可以忽略)
  1. 在由项目管理员在 `https://git.garena.com/${Your project's namespace}/${Your project's name}/-/settings/` 创建 token
     + 需要支持 api, read_api, read_repository 三个 Scope
  2. 打开 `https://git.garena.com/${Your project's namespace}/${Your project's name}/-/settings/ci_cd`
  3. 展开 Variables 选项卡
  4. 点击 Add variable 添加1个变量：
     | Key                     | Value                                      |
     | ----------------------- | ------------------------------------------ |
     | PERSONAL_TOKEN          | 第1小点中创建的token                       |
+ Step 3: 发起 MR 来测试
  + 当 MR 的标题带有--skip-mr-size-limit时 会跳过检查

### pipelineFailureNotification

+ Step 1: 在 gitlab 配置文件 .gitlab-ci.yml 中加入声明
  注意: 这里的stage要在想要捕获错误的stage后面，仅当至少一个早期stage的作业失败时才运行该作业

  ```yaml
  test-pipeline-fail:
  stage: error
  rules:
    - if: $CI_MERGE_REQUEST_IID
      when: on_failure
  script:
    - yarn config set registry https://npm.shopee.io/
    - yarn global add @infra/code-review-helper
    - code-review-helper pipelineFailureNotification
  ```

+ Step 2: 在 gitlab 的变量配置中配置变量 (如果已经配置过，可以忽略)
  1. 在由项目管理员在 `https://git.garena.com/${Your project's namespace}/${Your project's name}/-/settings/` 创建 token
     - 需要支持 api, read_api, read_repository 三个 Scope
  2. 打开 `https://git.garena.com/${Your project's namespace}/${Your project's name}/-/settings/ci_cd`
  3. 展开 Variables 选项卡
  4. 点击 Add variable 添加1个变量：
     | Key                     | Value                                      |
     | ----------------------- | ------------------------------------------ |
     | PERSONAL_TOKEN          | 第1小点中创建的token                       |

+ Step 3: 发起 MR 来测试
  - 仅当至少一个早期stage的作业失败时才运行该作业

### mergeRequestStatusNotifier

+ Step 1: 在 gitlab 配置文件 .gitlab-ci.yml 中加入声明
  注意：这里 code-review-helper 后面跟的第一个参数 mergeRequestStatusNotifier 是工具名，第二个参数是设置MR提交后间隔多长时间后没
  有review认为该Mr已经超时未review，给reviewer发起Mr催看通知，可不传，默认是60分钟；第三个参数是设置Mr的最后一条评论间隔多长时间后没有新评论
  认为是已经review完成，给Mr创建者发送CR完成的消息通知，可不传，默认是60分钟。

  ```yaml
  mr_urge_notify:
  stage: test
  only:
    - trigger
  script:
    - yarn config set registry https://npm.shopee.io/
    - yarn global add @infra/code-review-helper
    - code-review-helper mergeRequestStatusNotifier 60 60
  ```

+ Step 2: 在 gitlab 的Pipeline triggers中add trigger token
  1. 打开 `https://git.garena.com/${Your project's namespace}/${Your project's name}/-/settings/ci_cd#js-pipeline-triggers`，点击Expand，展开pipeline trigger token
  2. 输入Description，点击Add trigger添加

+ Step 3: 因为目前版本的gitlab的定时任务有bug，所以要用其它定时任务来trigger
```bat
*/60 * * * * curl -X POST  -F token=${step2中设置的pipeline trigger token的值} -F ref=master  https://git.garena.com/api/v4/projects/${项目Id}/trigger/pipeline
```
注意：*/60 * * * 为每60分钟触发一次，cron job 可根据实际需要调整，cron syntax详情查看<https://en.wikipedia.org/wiki/Cron>

+ Step 4: 测试
  + 可以等待step3的cron job的执行时机到来，触发pipeline，执行mergeRequestStatusNotifier测试
  + 也可以执行下面命令手动立即触发一次
```bat
curl -X POST  -F token=${step2中设置的pipeline trigger token的值} -F ref=master  https://git.garena.com/api/v4/projects/${项目Id}/trigger/pipeline
```
