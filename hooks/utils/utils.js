const { exec } = require('child_process');

const asyncExec = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (error, value) => (error ? reject(error) : resolve(value)));
  });

function exitOnError(error, exception) {
  console.error(error);
  console.error(exception);

  process.exit(1);
}

async function runCommand(command, errorMessage) {
  try {
    return await asyncExec(command);
  } catch (exception) {
    exitOnError(errorMessage, exception);
  }
}

module.exports = {
  asyncExec,
  exitOnError,
  runCommand,
};
