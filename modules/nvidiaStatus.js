const util = require('util');
const exec = util.promisify(require('child_process').exec);
var convert = require('xml-js');

async function nvidiaStatus() {
    const command = 'nvidia-smi  -q -x';
    const { stdout, stderr } = await exec(command);

    var result = convert.xml2json(stdout, {compact: true, spaces: 4});
    return result;
}

module.exports = nvidiaStatus;