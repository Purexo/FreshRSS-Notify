const path = require('path');
const child_process = require('child_process');
const util = require('util');

const exec = util.promisify(child_process.exec);

const dir = path.resolve(__dirname, 'extension');

async function crossStartChrome() {
  let cp;
  const args = ['--profile-directory=FreshRSS', `--load-extension="${dir}"`, 'chrome://extensions/'];
  
  switch (process.platform) {
    case "darwin": // mac-osx
      let {stdout} = await exec('mdfind kMDItemCFBundleIdentifier==com.google.Chrome');
      stdout = stdout.trim();
      
      if (stdout) throw new Error('Chrome not found');
      
      cp = child_process.spawn(
        `${stdout}/Contents/MacOS/Google Chrome`,
        args
      );
      break;
    case 'win32':
      cp = child_process.spawn(
        'start',
        ['chrome', ...args],
        {shell: true}
      );
      break;
    default:
      cp = child_process.spawn(
        'google-chrome',
        args
      );
  }
  
  cp.stderr.pipe(process.stderr);
  cp.stdout.pipe(process.stdout);
  
  cp.on('error', console.error);
  cp.on('close', code => process.exit(code));
}

crossStartChrome().catch(e => {
  console.error(e);
  process.exit(1);
});