const { exec } = require('child_process');

const child = exec("publish.sh 213",  (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});