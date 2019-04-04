$(function () {
    console.log("started")
    $("#get-status").click(getStatus);
    const GPU_TYPE= {
        "86.06.62.00.14":"msi-miner",
        "86.06.45.00.BE":"giga-aurus",
        "86.06.58.00.21":"giga-miner"
    }

    function getStatus() {
        $.get('/status', function (data) {
            var allgpu = data.nvidia_smi_log.gpu;
            $('#all-gpu-state').empty();
            $.each(allgpu, function (index, gpu) {
                let gpuType = GPU_TYPE[gpu.vbios_version._text];

                let template = `
                <tr class="${gpuType}">
                    <td>${gpu._attributes.id}</td>
                    <td>${gpu.temperature.gpu_temp._text}</td>
                    <td>${gpu.fan_speed._text}</td>
                    <td>${gpu.power_readings.power_draw._text}</td>
                    <td>${gpuType}</td>
                </tr>`;

                $('#all-gpu-state').append(template);

            });
        })
    }
});