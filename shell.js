const { exec } = require('child_process');

const child = exec("./publish.sh",  (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});