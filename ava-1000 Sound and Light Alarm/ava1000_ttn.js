/**
 * Payload Decoder for Sound and Light Alarm Protocol
 * Fport=210
 */

function Decoder(bytes, port) {
    var decoded = {};
    
    // Check if data is valid
    if (!bytes || bytes.length === 0) {
        return { error: "No data" };
    }
    
    // Only process port 210
    if (port !== 210) {
        return { error: "Wrong port, expected 210" };
    }
    
    var i = 0;
    
    try {
        while (i < bytes.length) {
            var dataType = bytes[i];
            i++;
            
            switch (dataType) {
                case 0x01:  // Product Model
                    if (i < bytes.length) {
                        decoded.product_model = bytes[i];
                        if (bytes[i] === 0x2A) {
                            decoded.device_type = "Sound and Light Alarm";
                        }
                        i++;
                    }
                    break;
                    
                case 0x3A:  // Alarm Status
                    if (i < bytes.length) {
                        decoded.alarm_status = bytes[i];
                        decoded.status = bytes[i] === 0x00 ? "Normal" : "Alarm";
                        i++;
                    }
                    break;
                    
                case 0x06:  // Heartbeat
                    if (i < bytes.length) {
                        decoded.heartbeat = true;
                        decoded.sensor_status = bytes[i] === 0x00 ? "Online" : "Offline";
                        i++;
                    }
                    break;
                    
                default:
                    // Skip unknown data types
                    i++;
                    break;
            }
        }
    } catch (error) {
        return { error: "Decoding failed: " + error.message };
    }
    
    return decoded;
}

// Test the decoder
function testDecoder() {
    // Test data 1: 0600 (heartbeat)
    var test1 = [0x06, 0x00];
    console.log("Test 1 - Heartbeat:", Decoder(test1, 210));
    
    // Test data 2: 3A01 (alarm)
    var test2 = [0x3A, 0x01];
    console.log("Test 2 - Alarm:", Decoder(test2, 210));
    
    // Test data 3: 3A00 (normal)
    var test3 = [0x3A, 0x00];
    console.log("Test 3 - Normal:", Decoder(test3, 210));
    
    // Test data 4: 012A (product model)
    var test4 = [0x01, 0x2A];
    console.log("Test 4 - Product:", Decoder(test4, 210));
}

// Run tests
testDecoder();