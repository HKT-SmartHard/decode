/**
 * Payload Decoder for The Reports
 * 
 * Copyright 2022 HKT SmartHard
 * 
 * @product   three-phase electric meter   EM-100
 */
function Decoded(Bytes) 
 {
    var decoded={};
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
    else if(Bytes[0]===0x07)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.status=readUInt16LE(Bytes.slice(1,2)).toString(2);
        decoded.frameidentification=readUInt8LE(Bytes.slice(2,3));        
    }
    else if(Bytes[2]===0x04)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.cycle=readUInt16LE_SWP16(Bytes.slice(1,3));
        decoded.frameidentification=readUInt8LE(Bytes.slice(3,4));
    }
    else if(Bytes[0]===0x05)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.Hour=readUInt8LE(Bytes.slice(1,2));
        decoded.Minute=readUInt8LE(Bytes.slice(2,3));
        decoded.frameidentification=readUInt8LE(Bytes.slice(3,4));
    }
    else if(Bytes[0]===0x06)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.firmwareversion=readUInt8LE(Bytes.slice(1,2));
        decoded.frameidentification=readUInt8LE(Bytes.slice(2,3));
    }
    else if(Bytes[0]===0x08)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.alarm=readUInt8LE(Bytes.slice(1,2));
        decoded.frameidentification=readUInt8LE(Bytes.slice(2,3));
    }
    else if(Bytes[0]===0x09)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.Data=dateFormat(Bytes.slice(1,7));
        decoded.frameidentification=readUInt8LE(Bytes.slic(7,8));
    }

    else if(Bytes[0]===0x0A)
    {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.typect=readUInt8LE(Bytes.slice(1,2));
        decoded.frameidentification=readUInt8LE(Bytes.slice(2,3));
    }
   else if(Bytes[0]===0x0B)
   {
        decoded.command=readUInt8LE(Bytes.slice(0,1));
        decoded.GB=(readUInt32LE_SWP32(Bytes.slice(1,5))/256).toString(16);
        decoded.frameidentification=readUInt8LE(Bytes.slice(5,6));
   }
   else if(Bytes[0]===0x12)
   {
    if(Bytes.length===35)
    {
       decoded.command=readUInt8LE(Bytes.slice(0,1));
       decoded.Schedule=dateFormat(Bytes.slice(1,7));
       decoded.Total=(readUInt32LE_SWP32(Bytes.slice(7,11))/256).toString(16);
       decoded.Amount=(readUInt32LE_SWP32(Bytes.slice(11,15)))/100;
       decoded.A_phase_voltage=(readUInt16LE_SWP16(Bytes.slice(15,17))/16).toString(16);
       decoded.B_phase_voltage=(readUInt16LE_SWP16(Bytes.slice(17,19))/16).toString(16);
       decoded.C_phase_voltage=(readUInt16LE_SWP16(Bytes.slice(19,21))/16).toString(16);
       decoded.A_phase_current=(readUInt24LE_SWP24(Bytes.slice(21,24))/4096).toString(16);
       decoded.B_phase_current=(readUInt24LE_SWP24(Bytes.slice(24,27))/4096).toString(16);
       decoded.C_phase_current=(readUInt24LE_SWP24(Bytes.slice(27,30))/4096).toString(16);
       decoded.Equipment_status=readUInt8LE(Bytes.slice(30,31)).toString(16);
       decoded.Equipment_alarm=readUInt8LE(Bytes.slice(31,32)).toString(16);
       decoded.Down_Signal_Strength=readInt8LE(Bytes.slice(32,33));
       decoded.Downward_SNR=readInt8LE(Bytes.slice(33,34));
       decoded.frameidentification=readUInt8LE(Bytes.slice(34,35));
    }
    else if(Bytes.length===25)
    {
       decoded.command=readUInt8LE(Bytes.slice(0,1));
       decoded.Schedule=dateFormat(Bytes.slice(1,7));
       decoded.Total=(readUInt32LE_SWP32(Bytes.slice(7,11))/256).toString(16);
       decoded.Amount=(readUInt32LE_SWP32(Bytes.slice(11,15)))/100;
       decoded.A_phase_voltage=(readUInt16LE_SWP16(Bytes.slice(15,17))/16).toString(16);
       decoded.A_phase_current=(readUInt24LE_SWP24(Bytes.slice(17,20))/4096).toString(16);
       decoded.Equipment_status=readUInt8LE(Bytes.slice(20,2)).toString(16);
       decoded.Equipment_alarm=readUInt8LE(Bytes.slice(21,22)).toString(16);
       decoded.Down_Signal_Strength=readInt8LE(Bytes.slice(22,23));
       decoded.Downward_SNR=readInt8LE(Bytes.slice(23,24));
       decoded.frameidentification=readUInt8LE(Bytes.slice(24,25));
    }
   }
   else if(Bytes[0]===0x1c)
   {
      decoded.command=readUInt8LE(Bytes.slice(0,1));
      decoded.balance=readUInt32LE_SWP32(Bytes.slice(1,5))/100;
      decoded.frameidentification=readUInt8LE(Bytes.slice(5,6));
   }
   else if(Bytes[8]===0xFF&&Bytes[0]===0x00&&Bytes.length===10)
   {
      decoded.IMEI=(Bytes.slice(0.8)).toString(16);
      decoded.command=readUInt8LE(Bytes.slice(8,9));
      decoded.frameidentification=readUInt8LE(Bytes.slice(9,10));
   }
   else if(Bytes[0]===0xE4)
   {
       var Number;
       Number=(Bytes.length-2)/3;
       decoded.command=readUInt8LE(Bytes.slice(0,1));
       decoded.fixed_point={};
       decoded.uintprice={};
      for(k=0;k<Number;k++)
      {
        decoded.fixed_point[k]=readUInt8LE(Bytes.slice(1+3*k,2+3*k));
        decoded.uintprice[k]=readUInt16LE_SWP16(Bytes.slice(2+3*k,4+3*k));
      }
   }
   else if(Bytes[0]===0x13)
   {
      decoded.command=readUInt8LE(Bytes.slice(0,1));
      decoded.Data=dateFormat2(Bytes.slice(1,4));
      var Number;
      Number=(Bytes.length-5)/11;
      decoded.hour={};
      decoded.Positive_Active_Power_Total_Power={};
      decoded.power={};
      decoded.costs={};
    for(k=1;k<=Number;k++)
    {
      decoded.hour[k]=readUInt8LE(Bytes.slice((k-1)*11+4,(k-1)*11+5))+":00";
      decoded.Positive_Active_Power_Total_Power[k]=readUInt32LE(Bytes.slice((k-1)*11+5,(k-1)*11+9))/100;
      decoded.power[k]=readUInt16LE(Bytes.slice((k-1)*11+9,(k-1)*11+11));
      decoded.costs[k]=readUInt24LE(Bytes.slice((k-1)*11+11,(k-1)*11+14));
    }
    decoded.frameidentification=readUInt8LE(Bytes.slice(Bytes.length-1,Bytes.length));
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


function readUInt24LE(byte) 
{
 var value = (byte[0] << 16) + (byte[1]<<8)+byte[2];
 return (value & 0xFFFFFF);
}


function readUInt24LE_SWP24(byte) 
{
 var value = (byte[2] << 16) +(byte[1] << 8) + byte[0];
 return (value & 0xFFFFFF);
}

function readInt24LE(byte)
{
 var ref = readUInt24LE(byte);
return (ref > 0x7FFFFF) ? ref - 0x1000000 : ref;
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
    if(byte[7]&0xF0)
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

function dateFormat (byte) {
    var Y=(0x2000+byte[0]).toString(16)+".";
    var M=byte[1].toString(16)+".";
    var D=byte[2].toString(16)+" ";
    var h=byte[3].toString(16)+":";
    var m=byte[4].toString(16)+":";
    var s=byte[5].toString(16);
    var  date=Y+M+D+h+m+s;
        return date;
    }
  

    function dateFormat2 (byte) {
        var Y=(0x2000+byte[0]).toString(16)+"-";
        var M=byte[1].toString(16)+"-";
        var D=byte[2].toString(16)+" ";
        var  date=Y+M+D;
            return date;
        }
