const { spawn } = require('child_process');
const inquirer = require('inquirer');
const { inc } = require('semver');
const { version } = require('./package.json');

const executeCommand = textToExecute => new Promise(resolve => {
  const command = spawn(textToExecute, { shell: true, stdio: 'inherit' })
  command.on('close', resolve)
})

const major = inc(version, 'major');
const minor = inc(version, 'minor');
const patch = inc(version, 'patch');

inquirer
  .prompt([
    {
      type: 'list',
      message: '选择你要发布的版本号',
      name: 'releaseVersion',
      choices: [
        {
          name: `主版本：v${version} => v${major}`,
          value: major,
        },
        {
          name: `次版本：v${version} => v${minor}`,
          value: minor,
        },
        {
          name: `补丁版本：v${version} => v${patch}`,
          value: patch,
        },
      ],
    },
  ])
  .then(({ releaseVersion }) => {
    console.log('===============begin publish===============')
    return executeCommand(
      [
        `npm version ${releaseVersion} --no-git-tag-version`,
        'npm run build',
        'npm publish --registry=https://npm.shopee.io/ --access=public'
      ].filter((v) => v).join(' && ')
    );
  }).then(() => {
    console.log('===============end publish===============')
  });
