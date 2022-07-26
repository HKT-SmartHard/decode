/**
 * Decoder for The Things Network
 * 
 * Copyright 2022 HKT SmartHard
 * 
 * @product   GCT-100   GPS Cattle Tracker
 */
 function Decoder(bytes) {
    var decoded = {};
    if(bytes[0]===0xaa){
        if(bytes[1]===0x01 && bytes[2] === 0x15&& bytes.length === 25){
            decoded.ID=readUInt8LE(bytes.slice(1,2));
            decoded.DataLength=readUInt8LE(bytes.slice(2,3));
            decoded.Timestamp=readUInt32LE(bytes.slice(3, 7));
            decoded.lat=readUInt32LE(bytes.slice(7, 11))/1000000;
            decoded.lon=readUInt32LE(bytes.slice(11, 15))/1000000;
            decoded.Speed=readUInt8LE(bytes.slice(15, 16));
            decoded.Angle=readUInt16LE(bytes.slice(16, 18));
            decoded.Altitude=readUInt16LE(bytes.slice(18, 20));
            decoded.StepCount=readUInt16LE(bytes.slice(20, 22));
            decoded.Electricity=readUInt8LE(bytes.slice(22, 23));
            decoded.AlarmState=readUInt8LE(bytes.slice(23, 24));
        }
        else if(bytes[1]===0x02 && bytes[2] === 0x25&& bytes.length === 41){
            decoded.ID=readUInt8LE(bytes.slice(1,2));
            decoded.DataLength=readUInt8LE(bytes.slice(2,3));
            decoded.Timestamp=readUInt32LE(bytes.slice(3, 7));
            decoded.TotalQuantity=readUInt8LE(bytes.slice(7, 8));
            if(0<decoded.TotalQuantity&&decoded.TotalQuantity<6){
                decoded.Beacons=[];
                for(var i=0; i<decoded.TotalQuantity; i++){
                    decoded.Beacons[i]={};
                    decoded.Beacons[i].BeaconIDMajor=readUInt16LE(bytes.slice((8+i*6), (10+i*6)));
                    decoded.Beacons[i].BeaconIDMinor=readUInt16LE(bytes.slice((10+i*6), (12+i*6)));
                    decoded.Beacons[i].RSSI=readInt16LE(bytes.slice((12+i*6), (14+i*6)));
                }
            }
            decoded.Electricity=readUInt8LE(bytes.slice(38, 39));
            decoded.AlarmState=readUInt8LE(bytes.slice(39, 40));
        }
        else if(bytes[1]===0x03 && bytes[2] === 0x08&& bytes.length === 12){
            decoded.ID=readUInt8LE(bytes.slice(1,2));
            decoded.DataLength=readUInt8LE(bytes.slice(2,3));
            decoded.Timestamp=readUInt32LE(bytes.slice(3, 7));
            decoded.StepCount=readUInt16LE(bytes.slice(7, 9));
            decoded.Electricity=readUInt8LE(bytes.slice(9, 10));
            decoded.AlarmState=readUInt8LE(bytes.slice(10, 11));
        }
        else if(bytes[18]===0xb0||bytes[18]===0xb2||bytes[18]===0xb3||bytes[18]===0xb5||bytes[18]===0xba){
            decoded.Timestamp=readUInt32LE(bytes.slice(1, 5));
            decoded.lat=readUInt32LE(bytes.slice(5, 9))/1000000;
            decoded.lon=readUInt32LE(bytes.slice(9, 13))/1000000;
            decoded.Speed=readUInt8LE(bytes.slice(13, 14));
            decoded.Angle=readUInt16LE(bytes.slice(14, 16));
            decoded.Altitude=readUInt16LE(bytes.slice(16, 18));
            if(bytes[18]===0xb0&&bytes.length === 24){
                decoded.ID=readUInt8LE(bytes.slice(18, 19));
                decoded.DataLength=readUInt8LE(bytes.slice(19,20));
                decoded.TimePeriod=readUInt16LE(bytes.slice(20, 22));
                decoded.ExecuteState=readUInt8LE(bytes.slice(22, 23));
            }
            else if(bytes[18]===0xb2&&bytes.length === 23){
                decoded.ID=readUInt8LE(bytes.slice(18, 19));
                decoded.DataLength=readUInt8LE(bytes.slice(19,20));
                decoded.State=readUInt8LE(bytes.slice(20, 21));
                decoded.ExecuteState=readUInt8LE(bytes.slice(21, 22));
            }
            else if(bytes[18]===0xb3&&bytes.length === 26){
                decoded.ID=readUInt8LE(bytes.slice(18, 19));
                decoded.DataLength=readUInt8LE(bytes.slice(19,20));
                decoded.TimePeriod=readUInt16LE(bytes.slice(20, 22));
                decoded.mode=readUInt8LE(bytes.slice(22, 23));
                decoded.AlarmState=readUInt8LE(bytes.slice(23, 24));
                decoded.PeripheralState=readUInt8LE(bytes.slice(24, 25));
            }
            else if(bytes[18]===0xb5&&bytes.length === 22){
                decoded.ID=readUInt8LE(bytes.slice(18, 19));
                decoded.DataLength=readUInt8LE(bytes.slice(19,20));
                decoded.ExecuteState=readUInt8LE(bytes.slice(20, 21));
            }
            else if(bytes[18]===0xba&&bytes.length === 23){
                decoded.ID=readUInt8LE(bytes.slice(18, 19));
                decoded.DataLength=readUInt8LE(bytes.slice(19,20));
                decoded.TimePeriod=readUInt8LE(bytes.slice(20, 21));
                decoded.ExecuteState=readUInt8LE(bytes.slice(21, 22));
            }
        }
    }
    else if(bytes[0]===0xbb){
        if(bytes[1]===0xb0 && bytes[2] === 0x02&& bytes.length === 6){
            decoded.ID=readUInt8LE(bytes.slice(1, 2));
            decoded.DataLength=readUInt8LE(bytes.slice(2,3));
            decoded.TimePeriod=readUInt16LE(bytes.slice(3, 5));
        }
        else if(bytes[1]===0xb2 && bytes[2] === 0x01&& bytes.length === 5){
            decoded.ID=readUInt8LE(bytes.slice(1, 2));
            decoded.DataLength=readUInt8LE(bytes.slice(2,3));
            decoded.State=readUInt8LE(bytes.slice(3, 4));
        }
        else if(bytes[1]===0xb3 && bytes[2] === 0x00&& bytes.length === 4){
            decoded.ID=readUInt8LE(bytes.slice(1, 2));
            decoded.DataLength=readUInt8LE(bytes.slice(2,3));
        }
        else if(bytes[1]===0xb5 && bytes[2] === 0x00&& bytes.length === 4){
            decoded.ID=readUInt8LE(bytes.slice(1, 2));
            decoded.DataLength=readUInt8LE(bytes.slice(2,3));
        }
        else if(bytes[1]===0xba && bytes[2] === 0x01&& bytes.length === 5){
            decoded.ID=readUInt8LE(bytes.slice(1, 2));
            decoded.DataLength=readUInt8LE(bytes.slice(2,3));
            decoded.TimePeriod=readUInt8LE(bytes.slice(3, 4));
        }
    }
    else if(bytes[0]===0xff&&bytes[1]===0x10&& bytes.length === 10){
        decoded.ID=readUInt8LE(bytes.slice(1, 2));
        decoded.Years=readUInt16LE(bytes.slice(2, 4));
        decoded.Month=readUInt8LE(bytes.slice(4, 5));
        decoded.Day=readUInt8LE(bytes.slice(5, 6));
        decoded.Hour=readUInt8LE(bytes.slice(6, 7));
        decoded.Minute=readUInt8LE(bytes.slice(7, 8));
        decoded.Seconds=readUInt8LE(bytes.slice(8, 9));
    }

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

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return (ref > 0x7FFF) ? ref - 0x10000 : ref;
}

function readUInt32LE(bytes) {
    var value = (bytes[0] << 24) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3];
    return (value & 0xFFFFFFFF);
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}

/* ******************************************
 * util
 ********************************************/
function formatDate(time, format = 'YY-MM-DD hh:mm:ss') {
    var date = new Date(time*1000);

    var year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
    var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
        return '0' + index;
    });

    var newTime = format.replace(/YY/g, year)
        .replace(/MM/g, preArr[month] || month)
        .replace(/DD/g, preArr[day] || day)
        .replace(/hh/g, preArr[hour] || hour)
        .replace(/mm/g, preArr[min] || min)
        .replace(/ss/g, preArr[sec] || sec);

    return newTime;
}

function bytesToHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}


function HexString2Bytes(str) {
    var pos = 0;
    var len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    var arrBytes = new Array();
    for (var i = 0; i < len; i++) {
        var s = str.substr(pos, 2);
        var v = parseInt(s, 16);
        arrBytes.push(v);
        pos += 2;
    }
    return arrBytes;
}
