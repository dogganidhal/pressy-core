import { exec } from "child_process";

exec("echo 'Hello World'", (error, output, erroutput) => {
  console.log({
    error: error,
    stdout: output,
    stderr: erroutput
  });
});