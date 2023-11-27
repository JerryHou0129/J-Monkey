#!/usr/bin/env node
const main = require('../main.js');

;(async () => {
  const processArguments = process.argv;
  if (processArguments.length <= 2) {
    console.error('no tool name provided, exiting...');
    process.exit(-1);
  }
  const [, , toolName, ...restArguments] = processArguments;
  await main.codeReviewHelper(toolName, ...restArguments);
})();
