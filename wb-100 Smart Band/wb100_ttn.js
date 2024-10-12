/**
 * Payload Decoder for The Chirpstack v4
 * 
 * Copyright 2024 HKT SmartHard
 * 
 * @product HKT-WB-100
 */

function easy_decode(bytes) {
    var decoded = {};

    var len = bytes.length;

    do {
        if (bytes[0] != 0x00) {
            switch (bytes[0]) {
                case 0xF6:
                    decoded.battery_type = bytes[2];
                    decoded.battery_volt = readUInt16LE_SWP16(bytes.slice(3, 5));
                    decoded.signal_type = bytes[5];
                    decoded.signal_strength = readUInt16LE_SWP16(bytes.slice(6, 8));
                    decoded.other_type = bytes[8];
                    decoded.num = readUInt32LE_SWP32(bytes.slice(9, 13));
                    decoded.timestamp = readUInt32LE_SWP32(bytes.slice(13, 17));
                    bytes = bytes.slice(18, len);
                    len -= 18;
                    break;

                case 0x03:
                    decoded.lon = readDoubleLE(bytes.slice(2, 10));
                    decoded.lat = readDoubleLE(bytes.slice(10, 18));
                    decoded.north_south = String.fromCodePoint(bytes[18]);
                    decoded.east_west = String.fromCodePoint(bytes[19]);
                    decoded.status = String.fromCodePoint(bytes[20]);
                    decoded.timestamp = readUInt32LE_SWP32(bytes.slice(21, 25));
                    bytes = bytes.slice(26, len);
                    len -= 26;
                    break;

                case 0xC2:
                    decoded.bp_high = readUInt16LE_SWP16(bytes.slice(2, 4));
                    decoded.bp_low = readUInt16LE_SWP16(bytes.slice(4, 6));
                    decoded.bp_heart = readUInt16LE_SWP16(bytes.slice(6, 8));
                    decoded.timestamp = readUInt32LE_SWP32(bytes.slice(8, 12));
                    bytes = bytes.slice(13, len);
                    len -= 13;
                    break;

                case 0xBA:
                    var N = 0;
                    decoded.with_without = bytes[1];
                    if (decoded.with_without == 0x00) {
                        N = 4;
                        decoded.timestamp = readUInt32LE_SWP32(bytes.slice(2, 6));
                    }
                    decoded.temperature_type = readUInt8LE(bytes.slice(2 + N, 3 + N));
                    decoded.wrist_temperature = readUInt16LE_SWP16(bytes.slice(4 + N, 6 + N)) / 10;
                    decoded.body_temperature = readUInt16LE_SWP16(bytes.slice(6 + N, 8 + N)) / 10;
                    if (decoded.temperature_type == 0x02) {
                        decoded.environment_temperature = readUInt16LE_SWP16(bytes.slice(6 + N, 8 + N)) / 10;
                    }
                    bytes = bytes.slice((9 + N), len);
                    len -= (9 + N);
                    break;

               case 0xD6:  
                    decoded.Type = bytes[1];     
                    decoded.PackCount = bytes[6];
                    decoded.Timestamp = readUInt32LE_SWP32(bytes.slice(2, 6)); 
                    decoded.Major = readUInt16LE_SWP16(bytes.slice(7, 9));  
                    decoded.Minor = readUInt16LE_SWP16(bytes.slice(9, 11));  
                    decoded.Rssi = readInt8LE(bytes[11]);  
					decoded.Major1 = readUInt16LE_SWP16(bytes.slice(12, 14));  
                    decoded.Minor1 = readUInt16LE_SWP16(bytes.slice(14, 16));  
                    decoded.Rssi1 = readInt8LE(bytes[16]); 
					
                    var dataLength = 13;
                    bytes = bytes.slice(dataLength);  
                    len -= dataLength;  

                    //console.table(decoded.BLE); 
                    break;

              case 0x02:
                    decoded.upl_warn = [];
                    var warn_data = {};
                    warn_data.warn = readUInt16LE_SWP16(bytes.slice(2, 4));
                    warn_data.warn_hex = warn_data.warn.toString(16);
                    warn_data.warn_bit = warn_data.warn.toString(2);
                    if ((warn_data.warn >> 4) & 0x01) {
                        warn_data.fall_alarm = 1;
                    }

                    if ((warn_data.warn >> 8) & 0x01) {
                        warn_data.wear_status = 1;
                    }

                    if ((warn_data.warn >> 7) & 0x01) {
                        warn_data.dis_sos = 1;
                    }

                    /*if ((warn_data.warn >> 4) & 0x01) {
                        warn_data.wear = 0;
                    }*/
					
                    if ((warn_data.warn >> 2) & 0x01) {
                        warn_data.power_off = 1;
                    }

                    if ((warn_data.warn >> 1) & 0x01) {
                        warn_data.sos = 1;
                    }

                    if ((warn_data.warn) & 0x01) {
                        warn_data.power_low = 1;
                    }
                    decoded.upl_warn.push(warn_data);
                    decoded.timestamp = readUInt32LE_SWP32(bytes.slice(4, 8));
                    bytes = bytes.slice(9, len);
                    len -= 9;
                    break;
                default:
                    len = 0;
                    break;
					
			 case 0xBB: 
					decoded.Version_len = bytes[1];
                    decoded.Version = arrayToAscii(bytes);
                    bytes = bytes.slice(13, len);
                    len -= 13;
                    break;
					
                    break;	

            }
        }
        else if (bytes[0] == 0xFF) {
            if (bytes[1] == 0x00) {
                decoded.time_request = 1;
            }
            bytes = bytes.slice(3, len);
            len -= 3;
        }
        else {
            len = 0;
        }
    }
    while (len);
    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt8LE(bytes) {
    return (bytes & 0xFF);
}

function readInt8LE(bytes) {
    var ref = readUInt8LE(bytes);
    return (ref > 0x7F) ? ref - 0x100 : ref;
}

function readUInt16LE(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
    return (value & 0xFFFF);
}

function readUInt16LE_SWP16(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return (value & 0xFFFF);
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return (ref > 0x7FFF) ? ref - 0x10000 : ref;
}

function readUInt32LE(bytes) {
    var value = (bytes[0] << 24) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3];
    return (value & 0xFFFFFFFF);
}

function readUInt32LE_SWP32(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xFFFFFFFF);
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}

function readInt32LE_SWP32(bytes) {
    var ref = readUInt32LE_SWP32(bytes);
    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}

function readDoubleLE(bytes) {
    var n;
    var Exponent;
    if (bytes[7] & 0xF0) {
        bytes[7] = bytes[7] & 0x7F;
        Exponent = (bytes[7] << 4) + ((bytes[6] & 0xF0) >> 4);
        n = Exponent - 1023;
    }
    else {
        Exponent = (bytes[7] << 4) + ((bytes[6] & 0xF0) >> 4);
        n = Exponent - 1023;
    }
    var integer = ((bytes[6] & 0x0F) << 24) + (bytes[5] << 16) + (bytes[4] << 8) + bytes[3];
    var Integer = (integer >> (28 - n)) + (0x01 << n);
    var decimal = (integer - ((integer >> (28 - n)) << (28 - n))) / Math.pow(2, 28 - n);
    return Integer + decimal;
}


function dateFormat(timestamp) {
    var date = new Date(timestamp * 1000);
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + 8 + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return (Y + M + D + h + m + s);
}

function arrayToAscii(array) {
    let ascii = '';
  
    for (let i = 0; i < array.length; i++) {
      ascii += String.fromCharCode(array[i]);
    }
  
    return ascii;
}


function Decoder(bytes, port) {
    return easy_decode(bytes);
}

