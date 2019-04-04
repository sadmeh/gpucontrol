var nvidiaStatus = require('./nvidiaStatus');
const GPU_TYPE= {
    "86.06.62.00.14":{name:"msi-miner",  id:3, noise:3},
    "86.06.45.00.BE":{name:"giga-aurus", id:1, noise:1},
    "86.06.58.00.21":{name:"giga-miner", id:2, noise:2}
};
const socket = require('net');
const db = require('./db');

function calcPerformance(gpuInfo) {
    const powerFactor = gpuInfo.watt*4;
    const noiseFactor = gpuInfo.fan * gpuInfo.noise;
    const tempFactor=   gpuInfo.temp*5;
    const performance = gpuInfo.hashrate/(powerFactor+noiseFactor+tempFactor);
    return performance;
}

async function check() {
    let infoJson = JSON.parse(await nvidiaStatus());
    let gpuArr = infoJson.nvidia_smi_log.gpu;
    claymore((claymoreData)=>{
        let claymoreObj = JSON.parse( claymoreData );
        let sumPerfomance = 0;
        let allGpuInfo = gpuArr.map(function (gpu, index) {
            let gpuType = GPU_TYPE[gpu.vbios_version._text];
            let gpuInfo = {
                index:index,
                type: gpuType.id,
                temp: parseInt(gpu.temperature.gpu_temp._text.replace(" C")),
                fan:  parseInt(gpu.fan_speed._text.replace(" %")),
                watt: parseInt(gpu.power_readings.power_draw._text.replace(" W")),
                noise: gpuType.noise,
                hashrate: claymoreObj.result[3].split(';')[index],
            }
            gpuInfo.performance = calcPerformance(gpuInfo);
            sumPerfomance += gpuInfo.performance;
            return gpuInfo;
        });
        console.log(allGpuInfo);
        console.log(claymoreData);
        var status = {
            timestamp: infoJson.nvidia_smi_log.timestamp._text,
            gpu: allGpuInfo,
            hashrate: claymoreObj.result[2].split(';')[0],
            performance: sumPerfomance/allGpuInfo.length
        };
        db.insertStatus(status)
    })
}

function claymore(callback){

    var s = socket.Socket();
    s.setEncoding('ascii');
    s.on('data',callback)
    s.connect(3333, 'localhost');
    s.write('{"id":0,"jsonrpc":"2.0","method":"miner_getstat1"}');
    s.end();
}

check();

 module.exports = check;