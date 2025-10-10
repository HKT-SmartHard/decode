/**
 * Payload Decoder for Sound and Light Alarm Protocol
 * Fport=210
 */

function decodeUplink(input) {
    var bytes = input.bytes;
    var port = input.fPort;
    var decoded = {};
    
    // Only process port 210
    if (port !== 210) {
        return {
            errors: ["Invalid FPort, expected 210 but got " + port]
        };
    }
    
    if (!bytes || bytes.length === 0) {
        return {
            errors: ["Empty payload"]
        };
    }
    
    var i = 0;
    
    try {
        while (i < bytes.length) {
            var dataType = bytes[i];
            i++;
            
            switch (dataType) {
                case 0x01:  // Product Model
                    if (i < bytes.length) {
                        decoded.productModel = bytes[i];
                        if (bytes[i] === 0x2A) {
                            decoded.deviceType = "SoundAndLightAlarm";
                        }
                        i++;
                    }
                    break;
                    
                case 0x3A:  // Alarm Status
                    if (i < bytes.length) {
                        decoded.alarmStatus = bytes[i];
                        decoded.status = bytes[i] === 0x00 ? "NORMAL" : "ALARM";
                        i++;
                    }
                    break;
                    
                case 0x06:  // Heartbeat
                    if (i < bytes.length) {
                        decoded.messageType = "HEARTBEAT";
                        decoded.sensorStatus = bytes[i] === 0x00 ? "ONLINE" : "OFFLINE";
                        decoded.heartbeatInterval = 60;
                        i++;
                    }
                    break;
                    
                default:
                    // Skip unknown data types by moving to next byte
                    if (i < bytes.length) {
                        i++;
                    }
                    break;
            }
        }
    } catch (error) {
        return {
            errors: ["Decoding error: " + error.message]
        };
    }
    
    return {
        data: decoded
    };
}

