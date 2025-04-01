/**
 * Payload Decoder for The Chirpstack v4
 * 
 * Copyright 2025 HKT SmartHard
 * 
 * @product IC-200
 */

function decodeUplink(input) {
    var obj = {};
    var offset = 0;
    var fPort = Number(input.fPort);
    var bytes = input.bytes;
    obj.data = {};
    if (fPort < 10 || fPort > 27) {
        obj.data.msgType = "unknown";
        obj.data.code = 1;
        obj.data.error = "Unknown fPort,expect([10,27]),actual(" + fPort + ")";
        return obj;
    }

    if (null == bytes) {
        return {};
    }

    var indexI, indexJ;
    switch (fPort) {
        //It's a heartbeat message.
        case 10:
            {
                obj.data.msgType = "heartbeat";
                if (bytes.length < 15) {
                    obj.data.code = 2;
                    obj.data.error = "Wrong message length,expect(15,18,19),actual(" + bytes.length + ")";
                    return obj;
                }
                obj.data.code = 0;

                obj.data.version = {};
                fwVer = bytes[0] & 0x3f;
                obj.data.version.swVer = ((bytes[0] >> 4) & 0x3).toString(16) + "." + (bytes[0] & 0xf).toString(16);
                obj.data.version.hardwareType = (bytes[0] >> 6);// 1: "gateway" , 0: "badge";
                obj.data.signal = {};
                if (bytes[1] <= 127)
                    obj.data.signal.rssi = bytes[1] - 20;
                else
                    obj.data.signal.rssi = bytes[1] - 275;
                if (bytes[2] <= 127)
                    obj.data.signal.snr = bytes[2];
                else
                    obj.data.signal.snr = bytes[2] - 255;
                obj.data.status = {};
                //GNSS status
                obj.data.status.gnss = (bytes[3] >>> 5) & 0x7; //0:off,1:positioning,2:successful,3:failed,4:indoor
                obj.data.status.battery = (bytes[3] >> 3) & 0x3; //0:not charging,1:charging,2:complete,3:unknown
                //During the heartbeat period, whether the device is moved.
                obj.data.status.vibstate = (bytes[3] >> 2) & 0x1;//1: moved,0:static;
                /*
                 Only used when the hardware type is badge.
                 0 indicates it works as a tracker
                 1 indicates it works as a BLE gateway
                */
                obj.data.workmode = (bytes[3] >> 1) & 0x1;//1:gateway,0:tracker;
                //Calculate the available power of the battery.
                var voltage = bytes[4] / 100.0 + 2;
                if (obj.data.version.hardwareType == 0) {
                    if (voltage < 3.3) {
                        obj.data.status.soc = 0;
                    }
                    else if (voltage >= 4.15) {
                        obj.data.status.soc = 100;
                    }
                    else if (voltage >= 4.1) {
                        obj.data.status.soc = 99;
                    }
                    else if (voltage >= 4.04) {
                        obj.data.status.soc = Math.round(96 + 3 * (voltage - 4.04) / (4.1 - 4.04));
                    }
                    else if (voltage >= 3.97) {
                        obj.data.status.soc = Math.round(90 + 6 * (voltage - 3.97) / (4.04 - 3.97));
                    }
                    else if (voltage >= 3.87) {
                        obj.data.status.soc = Math.round(69 + 21 * (voltage - 3.87) / (3.97 - 3.87));
                    }
                    else if (voltage >= 3.69) {
                        obj.data.status.soc = Math.round(25 + 44 * (voltage - 3.69) / (3.87 - 3.69));
                    }
                    else if (voltage >= 3.4) {
                        obj.data.status.soc = Math.round(3 + 22 * (voltage - 3.4) / (3.69 - 3.4));
                    }
                    else if (voltage >= 3.3) {
                        obj.data.status.soc = Math.round(3 * (voltage - 3.3) / (3.4 - 3.3));
                    }
                }
                else {
                    if (voltage < 3.35) {
                        obj.data.status.soc = 0;
                    }
                    else if (voltage >= 4.1) {
                        obj.data.status.soc = 100;
                    }
                    else if (voltage >= 3.6) {
                        obj.data.status.soc = Math.round(50 + 50 * (voltage - 3.6) / (4.1 - 3.6));
                    }
                    else if (voltage >= 3.35) {
                        obj.data.status.soc = Math.round(50 * (voltage - 3.35) / (3.6 - 3.35));
                    }
                }
                //Parse the parameters.
                obj.data.parameters = {};
                obj.data.parameters.txPower = bytes[5] >>> 6;
                //Data rate
                obj.data.parameters.dr = (bytes[5] >> 3) & 0x7;
                //Scheme
                // 0:US915,1:EU868,2:AU915,3:CN470,4:AS923,5:KR920,6:IN865,7:RU864;
                obj.data.parameters.scheme = bytes[5] & 0x7;
                obj.data.parameters.ble = {};
                obj.data.parameters.ble.auReport = bytes[6] >>> 7;//1:enable,0:disable;
                var bleperiod = [0, 5, 10, 20, 30, 60, 120, 300, 600, 900, 1200, 1800, 3600, 7200, 21600, 43200];
                obj.data.parameters.ble.period = bleperiod[(bytes[6] >> 3) & 0x0f];
                var scan = [1, 2, 3, 6, 9, 12, 15, 255];
                obj.data.parameters.ble.scan = scan[bytes[6] & 0x7];
                obj.data.parameters.ble.scale = (bytes[7] >> 6) & 0x3;
                obj.data.parameters.ble.stepsOff = ((bytes[7] >> 3) & 0x7) * 5;
                obj.data.parameters.ble.bleOff = bytes[7] & 0x7;
                obj.data.parameters.warning = {};
                //buzzer 0:disable,1:enable;
                obj.data.parameters.warning.buzzer = (bytes[8] >> 5) & 0x1;
                obj.data.parameters.warning.vibrator = (bytes[8] >> 4) & 0x1;//1:enabled,0:disabled;
                var distance = [2, 4, 6, 8, 10, 15, 255];
                obj.data.parameters.warning.distance = distance[(bytes[8] >> 1) & 0x7];
                obj.data.parameters.warning.proximity = bytes[8] & 0x1;//1:enabled,0:disabled;

                //Gnss report period
                var gnssperiod = [0, 5, 10, 15, 30, 60, 150, 300, 900, 1800, 3600, 5400, 10800, 21600];
                obj.data.parameters.gnssPeriod = gnssperiod[(bytes[9] >> 4) & 0xf];
                //Heartbeat report period
                var heartbeatperiod = [60, 300, 600, 1200, 1800, 3600, 7200, 21600, 43200, 86400, 86400, 86400, 86400, 86400, 86400, 86400];
                obj.data.parameters.heartBeatPeriod = heartbeatperiod[bytes[9] & 0xf];

                if (fwVer > 0x18) {
                    obj.data.parameters.sleepy = {};
                    obj.data.parameters.sleepy.start = ((bytes[10] & 0x3) << 3) | ((bytes[11] >> 5) & 0x7);
                    obj.data.parameters.sleepy.end = bytes[11] & 0x1f;
                    obj.data.parameters.sleepy.degree = (bytes[10] >> 2) & 0x7;

                    if (obj.data.parameters.sleepy.start != obj.data.parameters.sleepy.end) {
                        obj.data.parameters.timestamp = ((bytes[12] & 0xff) << 24) | ((bytes[13] & 0xff) << 16) | ((bytes[14] & 0xff) << 8) | (bytes[15] & 0xff);
                        obj.data.rmc = (bytes[16] >> 4) & 0x0F;
                        obj.data.bleAck = (bytes[16] >> 3) & 0x01;
                        obj.data.thres = bytes[16] & 0x07;
                        obj.data.steps = ((bytes[17] & 0xff) << 8) | (bytes[18] & 0xff);
                        if (fwVer > 0x19) {
                            obj.data.temp = bytes[19] - 50;//Temperature
                        }
                    }
                    else {
                        obj.data.rmc = (bytes[12] >> 4) & 0x0F;
                        obj.data.bleAck = (bytes[12] >> 3) & 0x01;
                        obj.data.thres = bytes[12] & 0x07;
                        obj.data.steps = ((bytes[13] & 0xff) << 8) | (bytes[14] & 0xff);
                        if (fwVer > 0x19) {
                            obj.data.temp = bytes[15] - 50;//Temperature
                        }
                    }
                }
                else {
                    obj.data.parameters.sleepy = {};
                    obj.data.parameters.sleepy.start = ((bytes[10] & 0x3) << 3) | ((bytes[11] >> 5) & 0x7);
                    obj.data.parameters.sleepy.end = bytes[11] & 0x1f;
                    obj.data.parameters.sleepy.degree = (bytes[10] >> 2) & 0x7;

                    if (obj.data.parameters.sleepy.start != obj.data.parameters.sleepy.end) {
                        obj.data.parameters.timestamp = ((bytes[12] & 0xff) << 24) | ((bytes[13] & 0xff) << 16) | ((bytes[14] & 0xff) << 8) | (bytes[15] & 0xff);
                        obj.data.rmc = (bytes[16] >> 4) & 0x0F;
                        obj.data.bleAck = (bytes[16] >> 3) & 0x01;
                        obj.data.thres = bytes[16] & 0x07;
                        obj.data.steps = ((bytes[18] & 0xff) << 8) | (bytes[19] & 0xff);
                    }
                    else {
                        obj.data.rmc = (bytes[12] >> 4) & 0x0F;
                        obj.data.bleAck = (bytes[12] >> 3) & 0x01;
                        obj.data.thres = bytes[12] & 0x07;
                        obj.data.steps = ((bytes[14] & 0xff) << 8) | (bytes[15] & 0xff);
                    }
                }
                return obj;
            }
        case 11:
            {
                obj.data.msgType = "GNSS coordinate";
                if (bytes.length != 9 && bytes.length != 13) {
                    obj.data.code = 2;
                    obj.data.error = "Wrong message length,expect(9,13),actual(" + bytes.length + ")";
                    return obj;
                }
                obj.data.code = 0;
                if (bytes.length == 9) {
                    obj.data.longitude = {};
                    obj.data.longitude.orientation = bytes[0] & 0x80 ? "W" : "E";
                    var longi = (bytes[0] & 0x7f) << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3];
                    obj.data.longitude.value = (parseInt(longi / 10000000) + (longi % 10000000) / 6000000.0).toFixed(7);
                    obj.data.latitude = {};
                    obj.data.latitude.orientation = bytes[4] & 0x80 ? "S" : "N";
                    var lati = (bytes[4] & 0x7f) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7];
                    obj.data.latitude.value = (parseInt(lati / 10000000) + (lati % 10000000) / 6000000.0).toFixed(7);
                    obj.data.time = bytes[8];
                }
                else if (bytes.length == 13) {
                    obj.data.longitude = {};
                    obj.data.longitude.orientation = bytes[0] & 0x80 ? "W" : "E";
                    var longi = (bytes[0] & 0x7f) << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3];
                    obj.data.longitude.value = (parseInt(longi / 10000000) + (longi % 10000000) / 6000000.0).toFixed(7);
                    obj.data.latitude = {};
                    obj.data.latitude.orientation = bytes[4] & 0x80 ? "S" : "N";
                    var lati = (bytes[4] & 0x7f) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7];
                    obj.data.latitude.value = (parseInt(lati / 10000000) + (lati % 10000000) / 6000000.0).toFixed(7);
                    var alti = (bytes[8] & 0x7f) << 24 | bytes[8] << 16 | bytes[10] << 8 | bytes[11];
                    obj.data.altitude = alti / 100.0;
                    obj.data.time = bytes[12];
                }
                return obj;
            }
        case 12:
            {
                obj.data.msgType = "BLE coordinate";
                if (bytes.length < 7) {
                    obj.data.code = 2;
                    obj.data.error = "wrong message length,less than minimum length(10)";
                    return obj;
                }
                obj.data.code = 0;

                var majorLen, majorShift, beaconStart;
                if (bytes[1] == 0) {
                    obj.data.step = bytes[0] << 16 | bytes[1] << 8 | bytes[2];
                    //How many kinds of Major value of the beacons.
                    majorLen = bytes[3] & 0xf;
                    majorShift = 4 + majorLen;
                    beaconStart = 4;
                }
                else {
                    majorLen = bytes[0] & 0xf;
                    majorShift = 1 + majorLen;
                    beaconStart = 1;
                    obj.data.closecontact = (bytes[0] >> 4) & 0x1;
                }

                obj.data.beaconList = [];


                for (indexI = 0; indexI < majorLen; indexI++) {
                    var beaconNum = bytes[beaconStart + indexI];
                    var major = (bytes[majorShift] << 8 | bytes[majorShift + 1]).toString(16);

                    var minorShift = majorShift + 2;
                    for (indexJ = 0; indexJ < beaconNum; indexJ++) {
                        //var minorShift = majorShift + 2 + indexJ *3;
                        var beaconObj = {};
                        beaconObj.major = major;
                        beaconObj.minor = ((bytes[minorShift] << 8) | bytes[minorShift + 1]).toString(16);
                        beaconObj.type = (bytes[minorShift + 2] >> 5) & 0x3;//0:locator,1:asset,2:alarm,3:proximity
                        beaconObj.rssi = -(bytes[minorShift + 2] & 0x1f) - 59;
                        minorShift += 2;
                        if (bytes[minorShift] >> 7) {
                            beaconObj.battery = bytes[minorShift + 1] & 0x7f;
                            minorShift += 1;
                        }
                        minorShift += 1;
                        obj.data.beaconList.push(beaconObj);
                    }
                    majorShift = minorShift;
                }
                return obj;
            }
        case 13:
            {
                obj.data.msgType = "alarm";
                if (bytes.length != 2) {
                    obj.data.code = 2;
                    obj.data.error = "Wrong message length,expect(2),actual(" + bytes.length + ")";
                    return obj;
                }

                obj.data.code = 0;
                obj.data.msgId = bytes[0];
                obj.data.ack = (bytes[1] >> 4) & 0x1;// 1:true,0:false;
                //0:SOS,1:SOS dismissed,2:power off,3:BLE disable,4:LoRa disable,5:GPS disable,6:Enter hazardous area,7:Unknown
                obj.data.alarm = bytes[1] & 0x7;

                return obj;
            }
        case 14:
            {
                obj.data.msgType = "ack";
                if (bytes.length != 2) {
                    obj.data.code = 2;
                    obj.data.error = "Wrong message length,expect(2),actual(" + bytes.length + ")";
                    return obj;
                }

                obj.data.code = 0;
                obj.data.msgId = bytes[0];
                //0:succeed,1:parameter not supported,2:parameter out of range,3:unknown;
                obj.data.result = bytes[1] & 0x3;

                return obj;
            }
        case 15:
            {
                obj.data.msgType = "Positioning UUID list";
                obj.data.code = 0;
                if (bytes[0] == 0) {
                    return {};
                }
                obj.data.uuidList = [];
                for (indexI = 0; indexI < bytes[0]; indexI++) {
                    var uuid = {};
                    uuid.index = bytes[1 + 17 * indexI];
                    var str = "";
                    for (indexJ = 2 + 17 * indexI; indexJ < 18 + 17 * indexI; indexJ++) {
                        var tmp = bytes[indexJ].toString(16);
                        if (tmp.length == 1) {
                            tmp = "0" + tmp;
                        }
                        str += tmp;
                    }
                    uuid.uuid = str;
                    obj.data.uuidList.push(uuid);
                }
                return obj;
            }
        case 16:
            {
                obj.data.msgType = "Asset UUID list";
                obj.data.code = 0;
                if (bytes[0] == 0) {
                    return {};
                }
                obj.data.uuidList = [];
                for (indexI = 0; indexI < bytes[0]; indexI++) {
                    var uuidAsset = {};
                    uuidAsset.index = bytes[1 + 17 * indexI];
                    var strAsset = "";
                    for (indexJ = 2 + 17 * indexI; indexJ < 18 + 17 * indexI; indexJ++) {
                        var tmpAsset = bytes[indexJ].toString(16);
                        if (tmpAsset.length == 1) {
                            tmpAsset = "0" + tmpAsset;
                        }
                        strAsset += tmpAsset;
                    }
                    uuidAsset.uuid = strAsset;
                    obj.data.uuidList.push(uuidAsset);
                }
                return obj;
            }
        case 17:
            {
                obj.data.msgType = "Pass-through filter list";
                obj.data.code = 0;
                if (bytes[0] == 0) {
                    return obj;
                }
                obj.data.filterList = [];
                var pos = 1;
                for (indexI = 0; indexI < bytes[0]; indexI++) {
                    var filterPosPass = {};
                    filterPosPass.port = bytes[pos];
                    filterPosPass.start = bytes[pos + 1];
                    filterPosPass.end = bytes[pos + 2];
                    filterPosPass.filterStart = bytes[pos + 3];
                    filterPosPass.filterLen = bytes[pos + 4];
                    var filterLen = bytes[pos + 4];
                    var strPosPass = "";
                    for (indexJ = 0; indexJ < filterLen; indexJ++) {
                        var tmpPosPass = bytes[pos + 5 + indexJ].toString(16);
                        if (tmpPosPass.length == 1) {
                            tmpPosPass = "0" + tmpPosPass;
                        }
                        strPosPass += tmpPosPass;
                    }
                    pos = pos + 5 + filterLen;
                    filterPosPass.filter = strPosPass;
                    obj.data.filterList.push(filterPosPass);
                }
                return obj;
            }
        case 18:
            {
                obj.data.msgType = "History Beacon Config List";
                obj.data.code = 0;
                if (bytes[0] == 0) {
                    return {};
                }
                obj.data.number = bytes[0];
                obj.data.beaconList = [];
                for (indexI = 0; indexI < bytes[0]; indexI++) {
                    var beacon = {};
                    offset = 5 * indexI;
                    beacon.index = bytes[1 + offset];
                    beacon.major = (bytes[2 + offset] << 8 | bytes[3 + offset]).toString(16);
                    beacon.minor = (bytes[4 + offset] << 8 | bytes[5 + offset]).toString(16);
                    obj.data.beaconList.push(beacon);
                }
                return obj;
            }
        case 19:
            {
                obj.data.msgType = "History Beacon Info List";
                obj.data.code = 0;
                if (bytes[0] == 0) {
                    return {};
                }
                obj.data.number = bytes[0];
                obj.data.beaconList = [];
                for (indexI = 0; indexI < bytes[0]; indexI++) {
                    var bea = {};
                    offset = 9 * indexI;
                    bea.major = (bytes[1 + offset] << 8 | bytes[2 + offset]).toString(16);
                    bea.minor = (bytes[3 + offset] << 8 | bytes[4 + offset]).toString(16);
                    bea.rssi = -((bytes[5 + offset] & 0x1f) + 59);
                    bea.frmOff = (bytes[6 + offset] << 8 | bytes[7 + offset]);
                    bea.timeOff = (bytes[8 + offset] << 8 | bytes[9 + offset]);
                    obj.data.beaconList.push(bea);
                }
                return obj;
            }
        case 20:
            {
                obj.data.msgType = "History GNSS Info List";
                obj.data.code = 0;
                if (bytes[0] == 0) {
                    return {};
                }
                obj.data.number = bytes[0];
                obj.data.gnssList = [];
                for (indexI = 0; indexI < bytes[0]; indexI++) {
                    var gnss = {};
                    offset = 12 * indexI;
                    gnss.longitude = {};
                    gnss.longitude.orientation = bytes[1 + offset] & 0x80 ? "W" : "E";
                    var longiH = (bytes[1 + offset] & 0x7f) << 24 | bytes[2 + offset] << 16 | bytes[3 + offset] << 8 | bytes[4 + offset];
                    gnss.longitude.value = (parseInt(longiH / 10000000) + (longiH % 10000000) / 6000000.0).toFixed(7);
                    gnss.latitude = {};
                    gnss.latitude.orientation = bytes[5 + offset] & 0x80 ? "S" : "N";
                    var latiH = (bytes[5 + offset] & 0x7f) << 24 | bytes[6 + offset] << 16 | bytes[7 + offset] << 8 | bytes[8 + offset];
                    gnss.latitude.value = (parseInt(latiH / 10000000) + (latiH % 10000000) / 6000000.0).toFixed(7);
                    gnss.frmOff = (bytes[9 + offset] << 8 | bytes[10 + offset]);
                    gnss.timeoff = (bytes[11 + offset] << 8 | bytes[12 + offset]);
                    obj.data.gnssList.push(gnss);
                }
                return obj;
            }
        case 21:
            {   //Only used for RCT platform, should be removed if not needed.
                //Or you can modify according to your BLE devices.
                obj.data.msgType = "Pass-through data list";
                obj.data.subType = "BLE Sensor";
                obj.data.port = fPort;
                obj.data.code = 0;
                if (bytes[0] == 0) {
                    return {};
                }
                obj.data.dataList = [];
                var macList = new Array();
                var dataLen = (bytes.length - 1) / bytes[0];
                for (indexI = 0; indexI < bytes[0]; indexI++) {
                    var passData = {};
                    passData.index = indexI;
                    var strDataPass = "";
                    for (indexJ = 1 + dataLen * indexI; indexJ < 1 + dataLen + dataLen * indexI; indexJ++) {
                        var tmpDataPass = bytes[indexJ].toString(16);
                        if (tmpDataPass.length == 1) {
                            tmpDataPass = "0" + tmpDataPass;
                        }
                        strDataPass += tmpDataPass;
                    }
                    passData.payload = strDataPass;

                    if (bytes[1 + dataLen * indexI] < 128)
                        passData.x = bytes[1 + dataLen * indexI] + bytes[2 + dataLen * indexI] / 256.0;
                    else
                        passData.x = bytes[1 + dataLen * indexI] - 256 + bytes[2 + dataLen * indexI] / 256.0;

                    if (bytes[3 + dataLen * indexI] < 128)
                        passData.y = bytes[3 + dataLen * indexI] + bytes[4 + dataLen * indexI] / 256.0;
                    else
                        passData.y = bytes[3 + dataLen * indexI] - 256 + bytes[4 + dataLen * indexI] / 256.0;

                    if (bytes[5 + dataLen * indexI] < 128)
                        passData.z = bytes[5 + dataLen * indexI] + bytes[6 + dataLen * indexI] / 256.0;
                    else
                        passData.z = bytes[5 + dataLen * indexI] - 256 + bytes[6 + dataLen * indexI] / 256.0;

                    passData.mac = "";
                    for (indexJ = 12 + dataLen * indexI; indexJ > 6 + dataLen * indexI; indexJ--) {
                        var tmpDataPass = bytes[indexJ].toString(16);
                        if (tmpDataPass.length == 1) {
                            tmpDataPass = "0" + tmpDataPass;
                        }
                        passData.mac += tmpDataPass;
                    }
                    var macExist = 0;
                    for (var macIndex = 0; macIndex < macList.length; macIndex++) {
                        if (passData.mac == macList[macIndex]) {
                            macExist = 1;
                            break;
                        }
                    }
                    if (macExist == 1) {
                        break;
                    }
                    else {
                        macList.push(passData.mac);
                    }
                    passData.rssi = bytes[13 + dataLen * indexI] - 255;
                    if (passData.y < -0.8 && Math.abs(passData.x) <= 0.1 && Math.abs(passData.z) < 0.1)
                        passData.state = 0;//Normal
                    else if (Math.abs(passData.y) < 0.1) {
                        passData.state = 2;
                    }
                    else
                        passData.state = 1;//Abnormal

                    obj.data.dataList.push(passData);
                }
                return obj;
            }
        case 22:
        case 23:
        case 24:
        case 25:
            {
                obj.data.msgType = "Pass-through data list";
                obj.data.port = fPort;
                obj.data.code = 0;
                if (bytes[0] == 0) {
                    return {};
                }
                obj.data.dataList = [];
                var dataLen = (bytes.length - 1) / bytes[0];
                for (indexI = 0; indexI < bytes[0]; indexI++) {
                    var passData = {};
                    passData.index = indexI;
                    var strDataPass = "";
                    for (indexJ = 1 + dataLen * indexI; indexJ < 1 + dataLen + dataLen * indexI; indexJ++) {
                        var tmpDataPass = bytes[indexJ].toString(16);
                        if (tmpDataPass.length == 1) {
                            tmpDataPass = "0" + tmpDataPass;
                        }
                        strDataPass += tmpDataPass;
                    }
                    passData.payload = strDataPass;
                    obj.data.dataList.push(passData);
                }
                return obj;
            }
        default:
            return {};
    }
    return {};
}
