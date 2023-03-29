/**
 * Payload Decoder for The Reports
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product HKT-SW-200p
 */
function Decoder(bytes) 
{
    decide_L=bytes.length;
    while(decide_L >=2)
    {
        if(bytes[0]===0xBD)
        {
            
            
            if (bytes[1]===0xF9) //电量上报
            {
                if(true)//CK(bytes,bytes[17],18)===
                {
                    decoded.Bat_type=readUInt8LE(bytes.slice(2,3));//电量类型
                    decoded.Bat_volt=(bytes[3]+(bytes[4]<<8));//电量值
                    decoded.Signal_type=readUInt8LE(bytes.slice(5,6));//信号类型
                    decoded.Signal_strength=(bytes[6]+(bytes[7]<<8));//信号强度
                    decoded.other_type=readUInt8LE(bytes.slice(8,9));//扩展类型
                    decoded.num=(bytes[9]+(bytes[10]<<8)+(bytes[11]<<16)+(bytes[12]<<24));//扩展值
                    decoded.timestamp=dateFormat(bytes[13]+(bytes[14]<<8)+(bytes[15]<<16)+(bytes[16]<<24));//时间戳
                    bytes.splice(1,18);
                }
            }
    
    
            else if (bytes[1]===0x03) //GPS位置上传
            {
                if(true)
                {
                    decoded.lon=readDoubleLE(bytes.slice(2,10));//经度
                    decoded.lat=readDoubleLE(bytes.slice(10,18));//纬度
                    decoded.north_south=String.fromCodePoint(readUInt8LE(bytes.slice(18,19)));//北纬南纬
                    decoded.east_west=String.fromCodePoint(readUInt8LE(bytes.slice(19,20)));//东经西经
                    decoded.status=String.fromCodePoint(readUInt8LE(bytes.slice(20,21)));//有效无效
                    decoded.timestamp=dateFormat(bytes[21]+(bytes[22]<<8)+(bytes[23]<<16)+(bytes[24]<<24));//时间戳
                    bytes.splice(1,26);
                }
            }
            
            
            else if (bytes[1]===0xC2) //心率和血压上传
            {
                if(true)//CK(bytes,bytes[17],18)===
                {
                    decoded.bp_high=readUInt8LE(bytes.slice(2,4));//收缩压
                    decoded.bp_low=readUInt8LE(bytes.slice(4,6));//舒张压
                    decoded.Bp_heart=(bytes[6]+(bytes[7]<<8));//心率
                    decoded.timestamp=dateFormat(bytes[8]+(bytes[9]<<8)+(bytes[10]<<16)+(bytes[11]<<24));//时间戳
                    bytes.splice(1,13);
                }
            }
            
            
            else if (bytes[1]===0xC6) //设备血氧数据上传
            {
                if(true)//CK(bytes,bytes[17],18)===
                {
                    decoded.BloodOxygen=(bytes[2]+(bytes[3]<<8));//上传血氧
                    decoded.timestamp=dateFormat(bytes[4]+(bytes[5]<<8)+(bytes[6]<<16)+(bytes[7]<<24));//时间戳
                    bytes.splice(1,9);
                }
            }
            
            
            else if (bytes[1]===0x17) //设置周期定位
            {
                if(true)//CK(bytes,bytes[17],18)===
                {
                    //时间段1
                    decoded.enable_1=readUInt8LE(bytes.slice(2,3));//是否启用
                    decoded.Interval_1=(bytes[3]+(bytes[4]<<8));//时间间隔（分钟）
                    decoded.time_start_h_1=readUInt8LE(bytes.slice(5,6));//-时
                    decoded.time_start_m_1=readUInt8LE(bytes.slice(6,7));//-分
                    decoded.time_end_h_1=readUInt8LE(bytes.slice(7,8));//-时
                    decoded.time_end_m_1=readUInt8LE(bytes.slice(8,9));//-分
                    //时间段2
                    decoded.enable_2=readUInt8LE(bytes.slice(9,10));//是否启用
                    decoded.Interval_2=(bytes[10]+(bytes[11]<<8));//时间间隔（分钟）
                    decoded.time_start_h_2=readUInt8LE(bytes.slice(12,13));//-时
                    decoded.time_start_m_2=readUInt8LE(bytes.slice(13,14));//-分
                    decoded.time_end_h_2=readUInt8LE(bytes.slice(14,15));//-时
                    decoded.time_end_m_2=readUInt8LE(bytes.slice(15,16));//-分
                    //时间段3
                    decoded.enable_3=readUInt8LE(bytes.slice(16,17));//是否启用
                    decoded.Interval_3=(bytes[17]+(bytes[18]<<8));//时间间隔（分钟）
                    decoded.time_start_h_3=readUInt8LE(bytes.slice(19,20));//-时
                    decoded.time_start_m_3=readUInt8LE(bytes.slice(20,21));//-分
                    decoded.time_end_h_3=readUInt8LE(bytes.slice(21,22));//-时
                    decoded.time_end_m_3=readUInt8LE(bytes.slice(22,23));//-分
                    //时间段4
                    decoded.enable_4=readUInt8LE(bytes.slice(23,24));//是否启用
                    decoded.Interval_4=(bytes[24]+(bytes[25]<<8));//时间间隔（分钟）
                    decoded.time_start_h_4=readUInt8LE(bytes.slice(26,27));//-时
                    decoded.time_start_m_4=readUInt8LE(bytes.slice(27,28));//-分
                    decoded.time_end_h_4=readUInt8LE(bytes.slice(28,29));//-时
                    decoded.time_end_m_4=readUInt8LE(bytes.slice(29,30));//-分
                    bytes.splice(1,31);
                }
            }
            
            
            else if (bytes[1]===0xB5) //SOS上传
            {
                if(true)//CK(bytes,bytes[17],18)===
                {
                    decoded.Status=readUInt8LE(bytes.slice(2,3));//状态：1:SOS
                    decoded.timestamp=dateFormat(bytes[3]+(bytes[4]<<8)+(bytes[5]<<16)+(bytes[6]<<24));//时间戳
                    bytes.splice(1,8);
                }
            }
            
            
            else if (bytes[1]===0xBA) //温度上传
            {
                var N=0;
                if(true)//CK(bytes,bytes[17],18)===
                {
                    decoded.with_without=readUInt8LE(bytes.slice(2,3));//时间戳标识
                    if(decoded.with_without===0x00)
                    {
                        N=4;
                        decoded.timestamp=dateFormat(bytes[3]+(bytes[4]<<8)+(bytes[5]<<16)+(bytes[6]<<24));//时间戳
                    }
                    else
                    {
                        N=0;
                    }
                    decoded.Temp_type=readUInt8LE(bytes.slice(3+N,4+N));//温度类型
                    decoded.wrist_Temp=(bytes[4+N]+(bytes[5+N]<<8))/10;//体表温度
                    decoded.Body_Temp=(bytes[6+N]+(bytes[7+N]<<8))/10;//体温
                    if(decoded.Temp_type===0x02)
                    {
                        decoded.environment_temperature=(bytes[8+N]+(bytes[9+N]<<8))/10;//环境温度
                        bytes.splice(1,11+N);
                    }
                    else
                    {
                        bytes.splice(1,9+N);
                    }
                }
            }
            
            
            else if (bytes[1]===0xD6) //蓝牙定位信息
            {
                if(true)//CK(bytes,bytes[17],18)===
                {
                    decoded.Type=readUInt8LE(bytes.slice(2,3));//目前固定为0
                    decoded.Total_groups=readUInt8LE(bytes.slice(3,4));//总组数,可能有多组信息,每组里可能有多个
                    var N1 = decoded.Total_groups;
                    decoded.ALL = [];
                    while(N1>=1)
                    {
                        decoded.timestamp=dateFormat(bytes[4]+(bytes[5]<<8)+(bytes[6]<<16)+(bytes[7]<<24));//时间戳
                        decoded.Total_PackCount=readUInt8LE(bytes.slice(8,9));//当前时间的包总数
                        var N2 = decoded.Total_PackCount;
                        var all = [];
                        var data ={};
                        while(N2>=1)
                        {
                            data.Major0=(bytes[9]+(bytes[10]<<8));//Major
                            data.Minor0=(bytes[11]+(bytes[12]<<8));//Minor0
                            data.Rssi0=readInt8LE(bytes.slice(13,14));//Rssi0
                            all[N2]=data;
                            console.table(all[N2]);
                            N2--;
                            bytes.splice(9,5);
                        }
                        decoded.ALL[N1]=all;
                        bytes.splice(4,4);
                        N1--;
                    }
                    bytes.splice(1,6);
                }
            }
            
            
            else if (bytes[1]===0x02) //报警数据上传
            {
                if(true)//CK(bytes,bytes[17],18)===
                {
                    decoded.Upl_warn=(bytes[3]+(bytes[2]<<8)).toString(16);//Bitfield see below
                    decoded.timestamp=dateFormat(bytes[4]+(bytes[5]<<8)+(bytes[6]<<16)+(bytes[7]<<24));//时间戳
                    bytes.splice(1,9);
                }
            }
        }
        
        
        else if(bytes[0]===0xFF)
        {
            if(bytes[1]===0x00 && bytes[2]===0xFF)
            {
                decoded.time_request = 1;
            }
            else if(bytes[1]===0x10 && bytes[9]===0xFF)
            {
                decoded.Year=(bytes[3]+(bytes[2]<<8)).toString(16);//Year
                decoded.Month=readUInt8LE(bytes.slice(4,5));//Month
                decoded.Day=readUInt8LE(bytes.slice(5,6));//Day
                decoded.Hour=readUInt8LE(bytes.slice(6,7));//Hour
                decoded.Minitus=readUInt8LE(bytes.slice(7,8));//Minitus
                decoded.Second=readUInt8LE(bytes.slice(8,9));//Second
            }
        }
        decide_L=bytes.length;
    }
    return decoded;
}




/* ******************************************
 * bytes to number
 ********************************************/
function readUInt8LE(bytes) 
{
    return (bytes & 0xFF);
}
 
function readUInt8LE_SWP8(bytes) 
{
    return (value & 0xFF);
}
 
function readInt8LE(bytes) 
{
    var ref = readUInt8LE(bytes);
    return (ref > 0x7F) ? ref - 0x100 : ref;
}

function readUInt16LE(bytes) 
{
    var value = (bytes[0] << 8) + bytes[1];
    return (value & 0xFFFF);
}
 
function readUInt16LE_SWP16(bytes) 
{
    var value = (bytes[1] << 8) + bytes[0];
    return (value & 0xFFFF);
}
 
function readInt16LE(bytes)
{
    var ref = readUInt16LE(bytes);
    return (ref > 0x7FFF) ? ref - 0x10000 : ref;
}
 
function readUInt32LE(bytes) 
{
    var value = (bytes[0] << 24) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3];
    return (value & 0xFFFFFFFF);
}
 
function readUInt32LE_SWP32(bytes) 
{
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xFFFFFFFF);
}
 
function readInt32LE(bytes) 
{
    var ref = readUInt32LE(bytes);
    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}
 
function readInt32LE_SWP32(bytes) 
{
    var ref = readUInt32LE_SWP32(bytes);
    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}
 
function readDoubleLE(bytes)
{
    var n;
    var Exponent;
    if(bytes[7]&0xF0)//求阶码与阶数
    {
        bytes[7]=bytes[7]&0x7F;
        Exponent=(bytes[7]<<4)+((bytes[6]&0xF0)>>4);
        n=Exponent-1023;
    }
    else
    {
        Exponent=(bytes[7]<<4)+((bytes[6]&0xF0)>>4);
        n=Exponent-1023;
    }
    var integer=((bytes[6]&0x0F)<<24)+(bytes[5]<<16)+(bytes[4]<<8)+bytes[3];
    var Integer=(integer>>(28-n))+(0x01<<n);
    var decimal=(integer-((integer>>(28-n))<<(28-n)))/Math.pow(2,28-n);
    return Integer+decimal;
}
 
function readX16LE(bytes)
{
    var value = (bytes[0] << 8) + bytes[1];
    return (value & 0xFFFF);
}
 
function readX16LE_SWP32(bytes)
{
    var value = (bytes[1] << 8) + bytes[0];
    return (value & 0xFFFF);
}
 
function readS16LE(bytes)
{
    var value = (bytes[0] << 8) + bytes[1];
    return (value & 0xFFFF);
}
 
function readS16LE_SWP32(bytes)
{
    var value = (bytes[1] << 8) + bytes[0];
    return (value & 0xFFFF);
}
 
function dateFormat (timestamp) 
{
    var date = new Date(timestamp*1000);
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours()+8 + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds(); 
    return (Y+M+D+h+m+s);
}

//有问题
function CK(bytes,ck,N)
{
    var Ck_sum = 0x00;  
    for(var i=0; i<N; i++)  
    {
        Ck_sum += bytes[i];
        Ck_sum = Ck_sum % 0x100;
        console.table(Ck_sum.toString(16));
    }
    Ck_sum = 0xFF-Ck_sum;
    if(ck===Ck_sum)
        return true;
    else
        return false;
}
var decoded={}; 
