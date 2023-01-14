/**
 * Payload Decoder for The Reports
 * 
 * Copyright 2022 HKT  Smart Hard
 * 
 * @product  SM-100  Smart Water Meter
 */
function Decoded(Bytes) 
{
    var decoded = {};
    if(Bytes[0]===0x00&&Bytes.length===3)
    {
        if(Bytes[2]===0x00)
        {
            decoded.command=readUInt8LE(Bytes.slice(0,1));
            decoded.interrupt=readUInt8LE(Bytes.slice(1,2));
            decoded.frameidentification=readUInt8LE(Bytes.slice(2,3));
        }
        else if(Bytes[2]===0x01)
        {
           decoded.answer=readUInt8LE(Bytes.slice(0,1));
           decoded.response=readUInt8LE(Bytes.slice(1,2));
           decoded.frameidentification=readUInt8LE(Bytes.slice(2,3));
        }
    }
    else if(Bytes[0]===0x01&&Bytes.length===3)
    {
        decoded.answer=readUInt8LE(Bytes.slice(0,1));
        decoded.response=readUInt8LE(Bytes.slice(1,2));
        decoded.frameidentification=readUInt8LE(Bytes.slice(2,3));
    }
    else if(Bytes[0]===0x02)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.Cumulative_flow=readUInt32LE_SWP32(Bytes.slice(1,5));
        decoded.Equipment_status=readUInt8LE(Bytes.slice(5,6)).toString(2);
        decoded.Equipment_alarm=readUInt8LE(Bytes.slice(6,7)).toString(2);
        decoded.Electricity=readUInt16LE_SWP16(Bytes.slice(7,9))/100;
        decoded.Downlink_signal_intensity=readInt8LE(Bytes.slice(9,10));
        decoded.SNR=readInt8LE(Bytes.slice(10,11));
        decoded.Balance=readUInt32LE_SWP32(Bytes.slice(11,15));
        decoded.frameidentification=readUInt8LE(Bytes.slice(15,16));
    }
    else if(Bytes[Bytes.length-1]===0x09)
    {

        decoded.IMEI=readUint64_ID(Bytes.slice(0,8)).toString(16);
        
        if(Bytes.length===11)
        {
           decoded.history_data=readUInt8LE(Bytes.slice(8,9));
           decoded.command=readUInt8LE(Bytes.slice(9,10));
           decoded.frameidentification=readInt8LE(Bytes.slice(10,11));
        }
        else if(Bytes.length>11)
        {   
            decoded.command=readUInt8LE(Bytes.slice(8,9));
            decoded.Timestamp=readUInt32LE_SWP32(Bytes.slice(9,13));
            formatDate(decoded.Timestamp);
            decoded.Historical_cumulative_flows={};
            var Number;
            Number=(Bytes.length-2-4-8)/4;
            for(k=1;k<=Number;k++)
            {
                decoded.Historical_cumulative_flows[k]=readUInt32LE_SWP32(Bytes.slice(13+4*(k-1),17+4*(k-1)))/1000;
            }
        }
        decoded.frameidentification=readUInt8LE(Bytes.slice(Bytes.length-1,Bytes.length));
    }
    else if(Bytes[0]===0x09)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.Equipment_status=readUInt8LE(Bytes.slice(1,2));
        decoded.frameidentification=readUInt8LE(Bytes.slice(2,3));
    }
    else if(Bytes[0]===0x06)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.Reporting_cycle=readUInt16LE_SWP16(Bytes.slice(1,3));
        decoded.frameidentification=readUInt8LE(Bytes.slice(3,4));
    }
    else if(Bytes[0]===0x07)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.Point_Reporting_Time_H=readUInt8LE(Bytes.slice(1,2));
        decoded.Point_Reporting_Time_M=readUInt8LE(Bytes.slice(2,3));
        decoded.frameidentification=readUInt8LE(Bytes.slice(3,4));
    }
    else if(Bytes[0]===0x08)
    {
        if(Bytes.length===3)
        {
            decoded.command=readUInt8LE(Bytes.slice(0,1));
            decoded.Electricity=readUInt8LE(Bytes.slice(1,2));
            decoded.frameidentification=readUInt8LE(Bytes.slice(2,3));
        }
        else if(Bytes.length===4)
        {
            decoded.command=readUInt8LE(Bytes.slice(0,1));
            decoded.battery_voltager=readUInt16LE_SWP16(Bytes.slice(1,3))/100;
            decoded.frameidentification=readUInt8LE(Bytes.slice(3,4));
        }
        
    }
    else if(Bytes[Bytes.length-1]===0x0D)
    {
        decoded.IMEI=readUint64_ID(Bytes.slice(0,8)).toString(16);
        decoded.response=readUInt8LE(Bytes.slice(8,9));
        decoded.answer=readUInt8LE(Bytes.slice(9,10));
        decoded.frameidentification=readUInt8LE(Bytes.slice(10,11));
    }
    else if(Bytes[0]===0x09)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.Equipment_status=readUInt8LE(Bytes.slice(1,2)).toString(2);
        decoded.frameidentification=readUInt8LE(Bytes.slice(2,3));
    }
    else if(Bytes[0]===0x0A)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.Equipment_alarm=readUInt8LE(Bytes.slice(1,2)).toString(2);
        decoded.frameidentification=readUInt8LE(Bytes.slice(2,3));
    }
    else if(Bytes[0]===0x0B)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.main_version=Bytes[1]>>4;
        decoded.second_version=Bytes[1]&15;
        decoded.frameidentification=readUInt8LE(Bytes.slice(2,3));
    }
    else if(Bytes[0]===0x0D)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.Current_Temperature=readUInt16LE_SWP16(Bytes.slice(1,3))/10;
        decoded.frameidentification=readUInt8LE(Bytes.slice(3,4));
    }
    else if(Bytes[Bytes.length-1]===0x10)
    {
        decoded.IMEI=readUint64_ID(Bytes.slice(0,8)).toString(16);
        decoded.command=readUInt8LE(Bytes.slice(8,9));
        decoded.Time=getDate_48(Bytes.slice(9,15));
        decoded.frameidentification=readUInt8LE(Bytes.slice(15,16));
    }
    else if(Bytes[0]===0xE0)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.pulse_coefficient=readUInt16LE_SWP16(Bytes.slice(1,3));
        decoded.frameidentification=readUInt8LE(Bytes.slice(3,4));
    }
    else if(Bytes[0]===0xE1)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.Mode=readUInt8LE(Bytes.slice(1,2));
        decoded.oggerswitch=readInt8LE(Bytes.slice(2,3));
        decoded.frameidentification=readUInt8LE(Bytes.slice(3,4));
    }
    else if(Bytes[0]===0xFF)
    {
        decoded.IMEI=readUint64_ID(Bytes.slice(0,8)).toString(16);
        decoded.command=readInt8LE(Bytes.slice(8,9));
        decoded.frameidentification=readUInt8LE(Bytes.slice(9,10));
    }
    
        return decoded;
    
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt8LE(byte) 
{
return (byte & 0xFF);
}

function readUInt8LE_SWP8(byte) 
{
 return (value & 0xFF);
}

function readInt8LE(byte) 
{
var ref = readUInt8LE(byte);
 return (ref > 0x7F) ? ref - 0x100 : ref;
}

function readUInt16LE(byte) 
{
 var value = (byte[0] << 8) + byte[1];
 return (value & 0xFFFF);
}

function readUInt16LE_SWP16(byte) 
{
 var value = (byte[1] << 8) + byte[0];
 return (value & 0xFFFF);
}

function readInt16LE(byte)
{
 var ref = readUInt16LE(byte);
return (ref > 0x7FFF) ? ref - 0x10000 : ref;
}

function readUInt32LE(byte) 
{
 var value = (byte[0] << 24) + (byte[1] << 16) + (byte[2] << 8) + byte[3];
 return (value & 0xFFFFFFFF);
}

function readUInt32LE_SWP32(byte) 
{
var value = (byte[3] << 24) + (byte[2] << 16) + (byte[1] << 8) + byte[0];
return (value & 0xFFFFFFFF);
}

function readInt32LE(byte) 
{
 var ref = readUInt32LE(byte);
return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}

function readInt32LE_SWP32(byte) 
{
 var ref = readUInt32LE_SWP32(byte);
return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}

function readDoubleLE(byte)
{
    var n;
    var Exponent;
    if(byte[7]&0xF0)//求阶码与阶数
    {
      byte[7]=byte[7]&0x7F;
       Exponent=(byte[7]<<4)+((byte[6]&0xF0)>>4);
       n=Exponent-1023;
    }
    else
    {
        Exponent=(byte[7]<<4)+((byte[6]&0xF0)>>4);
        n=Exponent-1023;
    }
   var integer=((byte[6]&0x0F)<<24)+(byte[5]<<16)+(byte[4]<<8)+byte[3];
   var Integer=(integer>>(28-n))+(0x01<<n);
   var decimal=(integer-((integer>>(28-n))<<(28-n)))/Math.pow(2,28-n);
   return Integer+decimal;

}

function  readUint64_ID(byte)
{
   var ID;
   ID=byte[0]*Math.pow(2,56)+byte[1]*Math.pow(2,48)+byte[2]*Math.pow(2,40)+byte[3]*Math.pow(2,32)+byte[4]*Math.pow(2,24)+byte[5]*Math.pow(2,16)+byte[6]*Math.pow(2,8)+byte[7];
   return ID;
}


function readX16LE(byte)
{
    var value = (byte[0] << 8) + byte[1];
    return (value & 0xFFFF);
}

function readX16LE_SWP32(byte)
{
    var value = (byte[1] << 8) + byte[0];
    return (value & 0xFFFF);
}

function readS16LE(byte)
{
    var value = (byte[0] << 8) + byte[1];
    return (value & 0xFFFF);
}

function readS16LE_SWP32(byte)
{
    var value = (byte[1] << 8) + byte[0];
    return (value & 0xFFFF);
}

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
        console.log(newTime);
    return newTime;
} 
function getDate_48(byte)
{
    var Y,M,D,h,m,s;
    var Date;
    Y=byte[0]+2000+"-";
    M=byte[1]+"-";
    D=byte[2]+"  ";
    h=byte[3]+":";
    m=byte[4]+":";
    s=byte[5];
    Date=Y+M+D+h+m+s;
    return Date;
}
 
  
