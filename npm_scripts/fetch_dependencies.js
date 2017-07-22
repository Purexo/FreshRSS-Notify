const fs = require('fs');
const path = require('path');

/**
 * @param {string} src
 * @param {string} target
 */
function cp(src, target) {
  const read = fs.createReadStream(src);
  const write = fs.createWriteStream(target);
  
  const onError = (err) => console.error(err);
  
  read.on('error', onError);
  write.on('error', onError);
  
  read.pipe(write);
}

const npm_config_files = Object.getOwnPropertyNames(process.env)
  .filter(env => env.startsWith('npm_package_config_files')) // [[1, 2], [1, 2], ...] struct
  .map(env => process.env[env]) // get value env npm_package_config_files_*_*
  .reduce((prev, curr, index) => { // fetch them in [[1, 2], [1, 2], ...] struct
    if (index % 2 == 0) {
      prev.push([curr]);
    } else {
      prev[prev.length - 1].push(curr)
    }
  
    return prev;
  }, []);

npm_config_files
  .map(([src, target]) => [path.join(src), path.join(target)])
  .forEach(([src, target]) => cp(src, target));