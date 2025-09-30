/**
 * Payload Decoder for The Chirpstack v4
 * 
 * Copyright 2024 HKT SmartHard
 * 
 * @product HKT-WB-100
 */
 
var decoded = {};
function decodeUplink(input) {
    decide_L = input.bytes.length;
while (decide_L >= 2) {
        if (input.bytes[0] === 0xBD) {
            if (input.bytes[1] === 0xF9) {
                if (true)//CK(input.bytes,input.bytes[17],18)===
                {
                    decoded.Bat_type = readUInt8LE(input.bytes.slice(2, 3));
                    decoded.Bat_volt = (input.bytes[3] + (input.bytes[4] << 8));
                    decoded.Signal_type = readUInt8LE(input.bytes.slice(5, 6));
                    decoded.Signal_strength = (input.bytes[6] + (input.bytes[7] << 8));
                    decoded.other_type = readUInt8LE(input.bytes.slice(8, 9));
                    decoded.num = (input.bytes[9] + (input.bytes[10] << 8) + (input.bytes[11] << 16) + (input.bytes[12] << 24));
                    decoded.timestamp = dateFormat(input.bytes[13] + (input.bytes[14] << 8) + (input.bytes[15] << 16) + (input.bytes[16] << 24));
                    input.bytes.splice(1, 18);
                }
            }
            else if (input.bytes[1] === 0x03) {
                if (true) {
                    decoded.lon = readDoubleLE(input.bytes.slice(2, 10));
                    decoded.lat = readDoubleLE(input.bytes.slice(10, 18));
                    decoded.north_south = String.fromCodePoint(readUInt8LE(input.bytes.slice(18, 19)));
                    decoded.east_west = String.fromCodePoint(readUInt8LE(input.bytes.slice(19, 20)));
                    decoded.status = String.fromCodePoint(readUInt8LE(input.bytes.slice(20, 21)));
                    decoded.timestamp = dateFormat(input.bytes[21] + (input.bytes[22] << 8) + (input.bytes[23] << 16) + (input.bytes[24] << 24));
                    input.bytes.splice(1, 26);
                }
            }
            else if (input.bytes[1] === 0x32) {
			     if(input.bytes[2]===0x00){
			     //BD3200 4D0ED961 1100 0A4F01--计步 1156---心率 3152---舒张压 396C---收缩压 1A6C01--体温 223E01--腕温 4162--血氧 F6
				 decoded.timestamp = dateFormat(input.bytes[3] + (input.bytes[4] << 8) + (input.bytes[5] << 16) + (input.bytes[6] << 24));
				 
                var intVal = 0;
                var blnHeath = 0;
                decoded.healthlen=(input.bytes[7] + (input.bytes[8] << 8));
                intSubStart = 9 +decoded.healthlen * 2;
                while(intVal<decoded.healthlen){
                var intType = input.bytes[9 + intVal];
               switch (intType >> 3){
				 case 1:
				     var len=intType & 07;
					 var start=9 + intVal * 2 + 1;
					 var end=start+len;
					 decoded.step =readUInt16LE_SWP16(input.bytes.slice(start,end));
					 break;
			     case 2:
				     var len=intType & 07;
					 var start=9 + intVal+1;
					 var end=start+len;
					 decoded.Bp_heart =readUInt8LE(input.bytes.slice(start,end));
					 break;
				 case 3:
				     var len=intType & 07;
					 var start=9 + intVal + 1;
					 var end=start+len;
					  decoded.Body_Temp =(readUInt16LE_SWP16(input.bytes.slice(start,end))/10);
					 break;
				 case 4:
				     var len=intType & 07;
					 var start=9 + intVal + 1;
					 var end=start+len;
					 decoded.Wrist_Temp =(readUInt16LE_SWP16(input.bytes.slice(start,end))/10);
					 break;			
				 case 6:
				     var len=intType & 07;
					 var start=9 + intVal+ 1;
					 var end=start+len;
					 decoded.bp_high =readUInt8LE( input.bytes.slice(start,end));
					 break;	
				 case 7:
				     var len=intType & 07;
					 var start=9 + intVal+ 1;
					 var end=start+len;
					 decoded.bp_low =readUInt8LE( input.bytes.slice(start,end));
					 break;	
			     case 8:
			         var len=intType & 07;
			    	 var start=9 + intVal+ 1;
			    	 var end=start+len;
			    	 decoded.BloodOxygen =readUInt8LE( input.bytes.slice(start,end));
                  break;
                 }
              intVal += 1 + (intType & 07);
               }   
			   input.bytes.splice(1, (10+decoded.healthlen));																	   
			    }else{
                decoded.bp_high = readUInt8LE(input.bytes.slice(2, 3));
                decoded.bp_low = readUInt8LE(input.bytes.slice(3, 4));
                decoded.Bp_heart = readUInt8LE(input.bytes.slice(4, 5));
                decoded.BloodOxygen = readUInt8LE(input.bytes.slice(5, 6));
                decoded.wrist_Temp = (input.bytes[6] + (input.bytes[7] << 8)) / 10;
                decoded.Body_Temp = (input.bytes[8] + (input.bytes[9] << 8)) / 10;
                decoded.step = (input.bytes[10] + (input.bytes[11] << 8) + (input.bytes[12] << 16) + (input.bytes[13] << 24));
                decoded.Bat_volt = readUInt8LE(input.bytes.slice(14, 15));
                decoded.timestamp = dateFormat(input.bytes[16] + (input.bytes[17] << 8) + (input.bytes[18] << 16) + (input.bytes[19] << 24));
                decoded.Signal_strength = readUInt8LE(input.bytes.slice(15, 16)); 
                input.bytes.splice(1, 21);
				}
             }    
            else if (input.bytes[1] === 0xB5) {
                if (true)//CK(input.bytes,input.bytes[17],18)===
                {
                    decoded.Status = readUInt8LE(input.bytes.slice(2, 3));
                    decoded.timestamp = dateFormat(input.bytes[3] + (input.bytes[4] << 8) + (input.bytes[5] << 16) + (input.bytes[6] << 24));
                    input.bytes.splice(1, 8);
                }
            }
            else if (input.bytes[1] === 0xD6) {
                if (true)
					{
				decoded.Type = readUInt8LE(input.bytes.slice(2, 3));
				decoded.Total_groups = readUInt8LE(input.bytes.slice(3, 4));
				var N1 = decoded.Total_groups;
				decoded.ALL = [];				 
				for (var group = 0; group < N1; group++) {
				    var all = [];
					decoded.timestamp = dateFormat(input.bytes[4] + (input.bytes[5] << 8) + (input.bytes[6] << 16) + (input.bytes[7] << 24));
				    var N2 = readUInt8LE(input.bytes.slice(8, 9)); 
				    for (var i = 0; i < N2; i++) {
				        var data = {};
				        data.Major = (input.bytes[9 + i * 5] + (input.bytes[10 + i * 5] << 8)); // Major，
				        data.Minor = (input.bytes[11 + i * 5] + (input.bytes[12 + i * 5] << 8)); // Minor，
				        data.Rssi = readInt8LE(input.bytes.slice(13 + i * 5, 14 + i * 5)); // Rssi
				        all.push(data);
				    }
				    decoded.ALL.push(all); 
				}	
				var length=N2*5+10;
				input.bytes.splice(1,length);
				}
            }
        else if (input.bytes[1] === 0x02) {
             if (true)//bd02 00 40 47 9ccf61ed
               {
                    decoded.Upl_warn = (input.bytes[2] + (input.bytes[3] << 8)).toString(16);
                    decoded.timestamp = dateFormat(input.bytes[4] + (input.bytes[5] << 8) + (input.bytes[6] << 16) + (input.bytes[7] << 24));
                    input.bytes.splice(1, 9);
                }
        }
		else if (input.bytes[1] === 0x21) {// bd 21 0100 02000000 766d9568 3e
		     if (true)
		       {
		            decoded.WarnType = (input.bytes[2] + (input.bytes[3] << 8)).toString(16);
					decoded.Upl_warn = (input.bytes[4] + (input.bytes[5] << 8) ).toString(16);
		            decoded.timestamp = dateFormat(input.bytes[8] + (input.bytes[9] << 8) + (input.bytes[10] << 16) + (input.bytes[11] << 24));
		            input.bytes.splice(1, 13);
		        }
		}
        else if(input.bytes[1] === 0xC3){
				//BDC301DB4D2F668A
				decoded.charge_warn=(input.bytes[2]);
				decoded.timestamp = dateFormat(input.bytes[3] + (input.bytes[4] << 8) + (input.bytes[5] << 16) + (input.bytes[6] << 24));
				input.bytes.splice(1, 8);
	     }
		 else if(input.bytes[1] === 0xC0){
				//bdc001176a
				decoded.feedbackcount=(input.bytes[2]);
				var feedbacklength=decoded.feedbackcount;
				decoded.feedback=[];
				var feedbackall = [];
				var feedbackdata = {};
				while(feedbacklength>=1){
					feedbackdata.down=(input.bytes[3]).toString(16);
					feedbacklength--;
					input.bytes.splice(3,1);
				}
				decoded.feedback[0]=feedbackdata;
				input.bytes.splice(1, 5);
			}  
			else if (input.bytes[1] === 0x28) {
			     //bd28 0784d061 03 01 03700000  e7
			            decoded.timestamp = dateFormat(input.bytes[2] + (input.bytes[3] << 8) + (input.bytes[4] << 16) + (input.bytes[5] << 24));
						decoded.MessageType= (input.bytes[6]).toString(16);
						decoded.MessageStatus = (input.bytes[7]).toString(16);
						decoded.MessageId = ((input.bytes[11] + (input.bytes[10] << 8) + (input.bytes[9] << 16) + (input.bytes[8] << 24))).toString(16);
			            input.bytes.splice(1, 13);
			        
			}
         else{
			decoded.ALL = [];
			var all="warning!";
           decoded.ALL[0]=all;
           input.bytes.length=0;
		   }
        }
        else if (input.bytes[0] === 0xFF) {
            if (input.bytes[1] === 0x00 && input.bytes[2] === 0xFF) {
              decoded.time_request = 1;
            input.bytes.length=0;
            }
        }
        decide_L = input.bytes.length;
    }
	var data = {};
    data.data = decoded;
  return data;
}
/* ******************************************
 * bytes to number
 ********************************************/
function readUInt8LE(bytes) {
    return (bytes & 0xFF);
}

function readUInt8LE_SWP8(bytes) {
    return (value & 0xFF);
}

function readInt8LE(bytes) {
    var ref = readUInt8LE(bytes);
    return (ref > 0x7F) ? ref - 0x100 : ref;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return (ref > 0x7FFF) ? ref - 0x10000 : ref;
}
function readUInt16LE_SWP16(bytes) {
	 var value = (bytes[1] << 8) + bytes[0];
	 return (value & 0xFFFF);
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

function readX16LE(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
    return (value & 0xFFFF);
}

function readX16LE_SWP32(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return (value & 0xFFFF);
}

function readS16LE(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
    return (value & 0xFFFF);
}

function readS16LE_SWP32(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return (value & 0xFFFF);
}

function dateFormat(timestamp) {
      var date = new Date(timestamp * 1000);
     var Y = date.getFullYear();
     var M = String(date.getMonth() + 1).padStart(2, '0'); 
     var D = String(date.getDate()).padStart(2, '0');
     var h = String(date.getHours()).padStart(2, '0');
     var m = String(date.getMinutes()).padStart(2, '0');
     var s = String(date.getSeconds()).padStart(2, '0');
     return (`${Y}-${M}-${D} ${h}:${m}:${s}`);
      }  