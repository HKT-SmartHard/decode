/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2024 HKT SmartHard
 * 
 * @product HKT-SVC-100
 */

function easy_decode(bytes) {
    var decoded = {};

    if (checkReportSync(bytes) == false)
        return;

    var temp;
    var dataLen = bytes.length - 5;
    var i = 5;
    while (dataLen--) {
        var type = bytes[i];
        i++;
        switch (type) {
            case 0x01:  //software_ver and hardware_ver  
                decoded.hard_ver = bytes[i];
                decoded.soft_ver = bytes[i + 1];
                dataLen -= 2;
                i += 2;
                break;
            case 0x03:  //battery 
                decoded.battery = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x3C:// solenoid valve status
                decoded.valve_status_1 =  bytes[i];
                decoded.connect_status_1 =  bytes[i+1];
                decoded.pulse_sum_1 =  byteToUint16(bytes.slice(i+2, i+4));
                i += 4;

                decoded.valve_status_2 =  bytes[i];
                decoded.connect_status_2 =  bytes[i+1];
                decoded.pulse_sum_2 =  byteToUint16(bytes.slice(i+2, i+4));
                i += 4;

                dataLen -= 8;
                break;
            case 0x3D:// Solenoid valve Set the local task
                var n,num;
                decoded.local_task_num = bytes[i];
                i += 1;
                dataLen -= 1;

                decoded.local_timer_ID = {};
                decoded.local_valve_ID = {};
                decoded.local_valve_status  = {};
                decoded.local_pulse  =  {};
                decoded.local_start_time  =  {};
                decoded.local_close_time  =  {};
                decoded.local_repetition_period  =  {};

                for (n = 0; n < decoded.local_task_num; n++)
                {
                    decoded.local_timer_ID[n] = bytes[i];
                    decoded.local_valve_ID[n]  = bytes[i+1];
                    decoded.local_valve_status[n]  = bytes[i+2];
                    decoded.local_pulse[n]  =  byteToUint16(bytes.slice(i+3, i+5));
                    decoded.local_start_time[n]  = bytes[i+5].toString(10) + ":"+bytes[i+6].toString(10);
                    decoded.local_close_time[n]  =  bytes[i+7].toString(10) + ":"+bytes[i+8].toString(10);
                    decoded.local_repetition_period[n]  =  bytes[i+9];
                   
                    i += 10;
                    dataLen -= 10;
                }
  
                break;
            case 0x3E:// Solenoid valve Deletes the local task 

                break;
            case 0x3F:// Solenoid valve RT(Real-time) task
                decoded.RT_valve_ID = bytes[i];
                decoded.RT_status = bytes[i+1];
                decoded.RT_duration_time =  byteToUint16(bytes.slice(i+2, i+4));
                decoded.RT_pulse = (bytes[i+4] << 16) + (bytes[i+5] << 8) + bytes[i+6];

                dataLen -= 7;
                i += 7;
                break;
            case 0x40:// voltage  00:12V 01:9V 02:5V
                decoded.voltage_output = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x41:// Pulse interface
                decoded.pulse_interface = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x42:// AS (Anti-Shake)
                decoded.AS_time = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x43:// Auto poweron
                decoded.auto_poweron = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x80:// Synchronizing system time
     
                break;
            case 0x85:// Reset

                break;
            case 0x86:// sync interval
                decoded.sync_interval =  byteToUint16(bytes.slice(i, i+2));
                dataLen -= 2;
                i += 2;
                break;
            case 0x8A:// timezone
                decoded.timezone = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
        }
    }
    return decoded;
}


function byteToUint16(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
    return value;
}

function byteToInt16(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
    return value > 0x7fff ? value - 0x10000 : value;
}

function byteToInt32(bytes) {
    var value = bytes[0] * 0xFF * 0xFF + bytes[1] * 0xFF + bytes[2];
    return value > 0x7fffff ? value - 0x1000000 : value;
}

function hexToString(bytes) {
    var value = "";
    var arr = bytes.toString(16).split(",");
    for (var i = 0; i < arr.length; i++) {
        value += parseInt(arr[i]).toString(16);
    }
    return value;
}

function checkReportSync(bytes) {
    if (bytes[0] == 0x68 && bytes[1] == 0x6B && bytes[2] == 0x74) {
        return true;
    }
    return false;
}

function Decoder(bytes, port) {
    return easy_decode(bytes);
}
