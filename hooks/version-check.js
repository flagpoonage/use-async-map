const current_package = require('../package.json');
const { toSemver } = require('./utils/simple-semver');
const { runCommand, exitOnError } = require('./utils/utils');

(async function () {
  const protected_branches = (process.argv[3] || 'master').split(','); 
  
  const remote = await runCommand(
    "git remote | head -1 | tr -d '\\n'",
    'Unable to retrieve git remote name'
  );
  const branch = await runCommand(
    "git branch | sed 's/\\*\\s//' | tr -d '\\n'",
    'Unable to retrieve git branch name'
  );

  if (!protected_branches.includes(branch)) {
    console.log('Branch is not version protected');
    process.exit(0);
  }
  else {
    console.log('Branch is version protected, checking versions...');
  }

  await runCommand('git fetch', 'Unable to fetch from git remote');
  
  const result = await runCommand(
    `git show ${remote}/${branch}:package.json`,
    `Unable to retrieve package.json from git remote [${remote}]`
  );

  let result_package;

  try {
    result_package = JSON.parse(result);
  } catch (exception) {
    exitOnError('Unable to parse package.json file', exception);
  }

  const current_version = toSemver(current_package.version);

  if (!current_version.isHigherThan(result_package.version)) {
    console.error(
      `Working version [${current_package.version}] is not higher than the remote version [${result_package.version}]`
    );
  }
  else {
    console.log(`Working version [${current_package.version}] is higher than remote version [${result_package.version}] and can be pushed.`);
  }
})();
