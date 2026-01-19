/**
 * Payload Decoder for Smart Lock Protocol (ChirpStack format)
 * Expected FPort = 10 
 */

var typeToMethodMap = {
    0x01: 'ReportSoftAndHard',
    0x02: 'ReportDeviceSn',
    0x03: 'ReportBatteryPercentage',
    0x2F: 'RemoteOpenCloseReply',
    0x30: 'ReportOperation',
    0x32: 'ManageTmpPwdReply',
    0x4E: 'ManagePwdReply',
    0x4F: 'ManageCardReply',
    0x52: 'NormallyOpenModeSettingReply',
    0x53: 'LockBackTimeSettingReply',
    0x54: 'SyncTimestampReply',
    0x56: 'UserBindingStatusSettingReply',
    0x57: 'VolumeSettingReply',
    0x84: 'ReportTamperProofStatus',
    0x85: 'RestoreDefaultFactorySettingsReply',
    0x86: 'DataSyncPeriodSettingReply',
    0x8A: 'TimezoneSettingReply',
    0x89: 'ReportBatteryStatus',
    0xFF: 'ReportHeartbeat'
};

function decodeUplink(input) {
    var bytes = input.bytes;
    var port = input.fPort;

    // 可根据实际设备配置修改期望的 FPort
    if (port !== 10) {
        return {
            errors: ["Invalid FPort, expected 200 but got " + port]
        };
    }

    if (!bytes || bytes.length < 7) {
        return {
            errors: ["Payload too short, minimum 7 bytes required"]
        };
    }

    try {
        // 检查同步头: 0x68, 0x6B, 0x74
        if (bytes[0] !== 0x68 || bytes[1] !== 0x6B || bytes[2] !== 0x74) {
            return {
                errors: ["Invalid sync header, expected 686B74"]
            };
        }

        var specialType = bytes[3];
        var needReply = (specialType & 0x01) === 0x01;
        var enableChecksum = (specialType & 0x02) === 0x02;
        var packetNumber = bytes[4];
        var dataType = bytes[5];

        // 确定数据段结束位置
        var dataEndIndex = enableChecksum ? bytes.length - 1 : bytes.length;
        if (dataEndIndex <= 6) {
            return { errors: ["No data payload"] };
        }
        var data = bytes.slice(6, dataEndIndex);

        // 校验和验证
        if (enableChecksum) {
            var receivedChecksum = bytes[bytes.length - 1];
            var calcSum = 0;
            for (var i = 0; i < bytes.length - 1; i++) {
                calcSum = (calcSum + bytes[i]) & 0xFF;
            }
            if (calcSum !== receivedChecksum) {
                return {
                    errors: ["Checksum verification failed"]
                };
            }
        }

        var decodedData = {};

        // 辅助函数（定义在 try 内部或外部均可）
        function readInt32(arr, offset) {
            return (arr[offset] << 24) | (arr[offset + 1] << 16) | (arr[offset + 2] << 8) | arr[offset + 3];
        }

        function readInt16(arr, offset) {
            return (arr[offset] << 8) | arr[offset + 1];
        }

        function toHex(arr) {
            return arr.map(function(b) {
                return (b < 0x10 ? '0' : '') + b.toString(16).toUpperCase();
            }).join('');
        }

        // 主解析逻辑
        switch (dataType) {
            case 0x01:
                if (data.length >= 2) {
                    decodedData = {
                        hardwareVersion: data[0],
                        softwareVersion: data[1]
                    };
                }
                break;

            case 0x02:
                decodedData = { SN: toHex(data) };
                break;

            case 0x03:
                if (data.length >= 1) decodedData = { batteryPercentage: data[0] };
                break;

            case 0x2F:
                if (data.length >= 1) decodedData = { lockControl: data[0] };
                break;

            case 0x30:
                if (data.length >= 6) {
                    decodedData = {
                        operation: data[0],
                        userNo: data[1],
                        timestamp: readInt32(data, 2)
                    };
                }
                break;

            case 0x32:
                decodedData = {}; // 无有效数据
                break;

            case 0x4E:
                if (data[0] === 0x01 && data.length >= 22) {
                    var pwdBytes = data.slice(4, 12);
                    var pwdStr = String.fromCharCode.apply(null, pwdBytes).slice(8 - data[3], 8);
                    decodedData = {
                        operation: data[0],
                        userNo: data[1],
                        pwdStatus: data[2],
                        pwdLength: data[3],
                        pwd: pwdStr,
                        validStartTime: readInt32(data, 12),
                        validEndTime: readInt32(data, 16),
                        validUnlockCount: readInt16(data, 20)
                    };
                } else if (data.length >= 2) {
                    decodedData = { operation: data[0], userNo: data[1] };
                }
                break;

            case 0x4F:
                if (data[0] === 0x01 && data.length >= 33) {
                    decodedData = {
                        operation: data[0],
                        userNo: data[1],
                        cardStatus: data[2],
                        cardNo: toHex(data.slice(3, 7)),
                        cardKey: toHex(data.slice(7, 23)),
                        validStartTime: readInt32(data, 23),
                        validEndTime: readInt32(data, 27),
                        validUnlockCount: readInt16(data, 31)
                    };
                } else if (data.length >= 2) {
                    decodedData = { operation: data[0], userNo: data[1] };
                }
                break;

            case 0x52:
                if (data[0] !== 0xFE && data.length >= 11) {
                    decodedData = {
                        mode: data[0],
                        delayLockTime: readInt16(data, 1),
                        cycleInfo: {
                            cyclePeriod: data[3],
                            cycleCount: data[4],
                            openTime: { hour: data[5], minute: data[6], second: data[7] },
                            closeTime: { hour: data[8], minute: data[9], second: data[10] }
                        }
                    };
                }
                break;

            case 0x53:
                if (data[0] !== 0xFE && data.length >= 1) {
                    decodedData = { lockBackTime: data[0] };
                }
                break;

            case 0x54:
                if (data.length >= 4) {
                    decodedData = { timestamp: readInt32(data, 0) };
                }
                break;

            case 0x56:
                if (data.length >= 1) decodedData = { success: data[0] === 1 };
                break;

            case 0x57:
                if (data.length >= 1) decodedData = { volume: data[0] };
                break;

            case 0x84:
                if (data.length >= 1) decodedData = { tamperProofStatus: data[0] };
                break;

            case 0x85:
            case 0x86:
            case 0x8A:
                if (data.length >= 1) decodedData = { success: data[0] === 0 };
                break;

            case 0x89:
                if (data.length >= 1) decodedData = { batteryStatus: data[0] };
                break;

            case 0xFF: // Heartbeat with multiple fields
                if (data.length < 1) break;
                var dataTypeNum = data[0];
                var index = 1;
                for (var i = 0; i < dataTypeNum && index < data.length; i++) {
                    var t = data[index];
                    switch (t) {
                        case 0x01:
                            if (index + 2 < data.length) {
                                decodedData.hardwareVersion = data[index + 1];
                                decodedData.softwareVersion = data[index + 2];
                            }
                            index += 3;
                            break;
                        case 0x03:
                            if (index + 1 < data.length) decodedData.batteryPercentage = data[index + 1];
                            index += 2;
                            break;
                        case 0x8A:
                            if (index + 1 < data.length) decodedData.timeZone = data[index + 1];
                            index += 2;
                            break;
                        case 0x57:
                            if (index + 1 < data.length) decodedData.volume = data[index + 1];
                            index += 2;
                            break;
                        case 0x53:
                            if (index + 1 < data.length) decodedData.lockBackTime = data[index + 1];
                            index += 2;
                            break;
                        case 0x52:
                            if (index + 1 < data.length) {
                                decodedData.normallyOpenMode = data[index + 1];
                                if (decodedData.normallyOpenMode === 2 && index + 3 < data.length) {
                                    decodedData.delayLockTime = readInt16(data, index + 2);
                                }
                            }
                            index += 12;
                            break;
                        case 0x56:
                            if (index + 1 < data.length) decodedData.userBindingStatus = data[index + 1];
                            index += 2;
                            break;
                        case 0x84:
                            if (index + 1 < data.length) decodedData.tamperProofStatus = data[index + 1];
                            index += 2;
                            break;
                        case 0x86:
                            if (index + 2 < data.length) decodedData.dataSyncPeriod = readInt16(data, index + 1);
                            index += 3;
                            break;
                        case 0x54:
                            if (index + 4 < data.length) decodedData.timestamp = readInt32(data, index + 1);
                            index += 5;
                            break;
                        default:
                            // Skip unknown type (assume 1-byte value)
                            index += 2;
                    }
                }
                break;

            default:
                return {
                    errors: ["Unknown data type: 0x" + dataType.toString(16)]
                };
        }

        // 添加上行标识
        decodedData.upSign = typeToMethodMap[dataType] || "UNKNOWN";

        // 返回标准 ChirpStack 格式
        return {
            data: {
                syncHeader: "686B74",
                specialType: { needReply: needReply, enableChecksum: enableChecksum },
                packetNumber: packetNumber,
                dataType: dataType,
                payload: decodedData
            }
        };

    } catch (e) {
        return {
            errors: ["Decoding failed: " + (e.message || e.toString())]
        };
    }
}