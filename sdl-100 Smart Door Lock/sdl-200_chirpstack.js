/**
 * Payload Decoder for The Chirpstack v4
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product HKT-SDL-200
 */

var ACT_WAY = ["Fingerprint Open", "Password Open", "MF Card Open", "Fingerprint Alarm", "Password Alarm", "MF Card Alarm", "Tamper Alarm", "LoRa Open", "BLE Open", "Unknow"];

function easy_decode(bytes) {
    var decoded = {};

    if (checkReportSync(bytes) == false)
        return;
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
            case 0x03:// battery
                decoded.battery = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x30:// operating record
                decoded.unlock_record = bytes[i];
                switch (decoded.unlock_record) {
                    case 0x01:
                        decoded.unlock_record_des = ACT_WAY[0];
                        break;
                    case 0x02:
                        decoded.unlock_record_des = ACT_WAY[1];
                        break;
                    case 0x03:
                        decoded.unlock_record_des = ACT_WAY[2];
                        break;
                    case 0xC1:
                        decoded.unlock_record_des = ACT_WAY[3];
                        break;
                    case 0xC2:
                        decoded.unlock_record_des = ACT_WAY[4];
                        break;
                    case 0xC3:
                        decoded.unlock_record_des = ACT_WAY[5];
                        break;
                    case 0xC4:
                        decoded.unlock_record_des = ACT_WAY[6];
                        break;
                    case 0xC5:
                        decoded.unlock_record_des = ACT_WAY[7];
                        break;
                    case 0xC6:
                        decoded.unlock_record_des = ACT_WAY[8];
                        break;
                    default:
                        decoded.unlock_record_des = ACT_WAY[9];
                        break;
                }
                decoded.user_number = bytes[i + 1];
                decoded.timestamp = byteToUint32(bytes.slice(i + 2, i + 6));
                dataLen -= 6;
                i += 6;
                break;
            case 0x84:// tamper status
                decoded.tamper_status = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x86:// sync interval
                decoded.sync_interval = readUInt16LE(bytes.slice(i, i + 2));
                dataLen -= 2;
                i += 2;
                break;
        }
    }
    return decoded;
}

function readUInt16LE(byte) {
    var value = (byte[0] << 8) + byte[1];
    return (value & 0xFFFF);
}

function byteToUint32(bytes) {
    var value = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | (bytes[3] << 0);
    return value;
}

function checkReportSync(bytes) {
    if (bytes[0] == 0x68 && bytes[1] == 0x6B && bytes[2] == 0x74) {
        return true;
    }
    return false;
}

function decodeUplink(input) {
    var decoded = easy_decode(input.bytes);
    return { data: decoded };
}


