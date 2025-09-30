/**
 * Payload Decoder for The ChirpStack v4
 * 
 * Copyright 2024 HKT SmartHard
 * 
 * @product USV-200
 * @protocol ZP UWM LoRaWAN Protocol (231007)
 */

function decodeUplink(input) {
    const bytes = input.bytes;
    const port = input.fPort;
    
    // 验证最小帧长度
    if (bytes.length < 15) return { data: { error: "Frame too short" } };
    
    // 验证帧头帧尾
    if (bytes[0] !== 0x68) return { data: { error: "Invalid frame start" } };
    if (bytes[bytes.length - 1] !== 0x16) return { data: { error: "Invalid frame end" } };
    
    // 计算校验和（从帧头到倒数第二字节）
    let crc = 0;
    for (let i = 0; i < bytes.length - 2; i++) {
        crc = (crc + bytes[i]) % 256;
    }
    if (crc !== bytes[bytes.length - 2]) {
        return { 
            data: {
                error: "CRC mismatch",
                expected: crc,
                actual: bytes[bytes.length - 2],
                hex_expected: "0x" + crc.toString(16).toUpperCase(),
                hex_actual: "0x" + bytes[bytes.length - 2].toString(16).toUpperCase()
            }
        };
    }

    // 解析基本帧信息
    const result = {
        frame_start: "0x" + bytes[0].toString(16).toUpperCase(),
        meter_type: bytes[1],
        address: parseAddress(bytes.slice(2, 9)),
        control_code: bytes[9],
        data_length: bytes[10],
        raw_data: bytesToHexString(bytes) // 添加原始数据用于调试
    };

    // 解析数据域 (从第11字节开始)
    const dataField = bytes.slice(11, 11 + result.data_length);
    let dataIndex = 0;

    // 1. 数据标识 (2字节)
    if (dataField.length >= 2) {
        result.data_identifier = {
            DI0: "0x" + dataField[0].toString(16).toUpperCase(),
            DI1: "0x" + dataField[1].toString(16).toUpperCase()
        };
        dataIndex += 2;
    }

    // 2. 序列号 (1字节)
    if (dataField.length > dataIndex) {
        result.serial_number = dataField[dataIndex++];
    }

    // 3. 正向累积流量 (5字节)
    if (dataField.length >= dataIndex + 5) {
        const flowData = dataField.slice(dataIndex, dataIndex + 5);
        result.forward_flow = parseFlow(flowData, "Positive cumulative flow");
        dataIndex += 5;
    }

    // 4. 反向累积流量 (5字节)
    if (dataField.length >= dataIndex + 5) {
        const flowData = dataField.slice(dataIndex, dataIndex + 5);
        result.reverse_flow = parseFlow(flowData, "Reverse cumulative flow");
        dataIndex += 5;
    }

    // 5. 瞬时流量 (5字节)
    if (dataField.length >= dataIndex + 5) {
        const flowData = dataField.slice(dataIndex, dataIndex + 5);
        result.instant_flow = parseFlow(flowData, "Instantaneous flow");
        dataIndex += 5;
    }

    // 6. 温度 (3字节) - 修改为BCD编码小端顺序
    if (dataField.length >= dataIndex + 3) {
        const tempData = dataField.slice(dataIndex, dataIndex + 3);
        result.temperature = parseTemperature(tempData);
        dataIndex += 3;
    }

    // 7. 时间 (7字节)
    if (dataField.length >= dataIndex + 7) {
        const timeData = dataField.slice(dataIndex, dataIndex + 7);
        result.real_time = parseTime(timeData);
        dataIndex += 7;
    }

    // 8. 状态字 (2字节)
    if (dataField.length >= dataIndex + 2) {
        const statusData = dataField.slice(dataIndex, dataIndex + 2);
        result.status_word = parseStatus(statusData);
        dataIndex += 2;
    }

    result.frame_end = "0x" + bytes[bytes.length - 1].toString(16).toUpperCase();
    result.crc = "0x" + bytes[bytes.length - 2].toString(16).toUpperCase();

    return { data: result };
}

// 辅助函数：解析表地址 (7字节)
function parseAddress(addrBytes) {
    const hexAddress = bytesToHexString(addrBytes);
    const addressParts = [];
    for (let i = 0; i < addrBytes.length; i++) {
        if (addrBytes[i] !== 0 || addressParts.length > 0) {
            addressParts.push(addrBytes[i].toString(16).padStart(2, '0'));
        }
    }
    return {
        hex: hexAddress,
        decimal: parseInt(hexAddress, 16),
        formatted: addressParts.join(':') || '0'
    };
}

// 辅助函数：解析流量数据 (5字节) - 已修正BCD解析
function parseFlow(flowBytes, type) {
    if (flowBytes.length !== 5) return null;
    
    const unitCode = flowBytes[0];
    const valueBytes = flowBytes.slice(1, 5);
    
    // 小端序BCD解析（第一个字节是最低位）
    let bcdValue = 0;
    for (let i = 0; i < 4; i++) {
        const byte = valueBytes[i];
        bcdValue += (byte & 0x0F) * Math.pow(10, 2*i);
        bcdValue += ((byte >> 4) & 0x0F) * Math.pow(10, 2*i + 1);
    }

    // 解析单位
    let unit, factor;
    switch (unitCode) {
        case 0x2C: 
            unit = "m³";
            factor = 0.001; // 示例：BCD值25 → 0.025 m³
            break;
        case 0x35: 
            unit = "m³/h";
            factor = 0.0001; // 示例：BCD值170 → 0.0170 m³/h
            break;
        default:
            unit = "unknown";
            factor = 1;
    }
    
    const actualValue = bcdValue * factor;
    
    return {
        type: type,
        unit_code: "0x" + unitCode.toString(16).toUpperCase(),
        unit: unit,
        bcd_value: bcdValue,
        value: actualValue.toFixed(4),
        formatted: actualValue.toFixed(4) + " " + unit,
        raw_bytes: bytesToHexString(flowBytes) // 调试用原始数据
    };
}

// 辅助函数：解析温度 (3字节) - 修改为BCD编码小端顺序
function parseTemperature(tempBytes) {
    if (tempBytes.length !== 3) return null;
    
    // BCD小端顺序解析：第一个字节是最低位，最后一个字节是最高位
    let bcdValue = 0;
    for (let i = 0; i < 3; i++) {
        const byte = tempBytes[i];
        // 每个字节包含2位BCD数字，低位在前
        bcdValue += (byte & 0x0F) * Math.pow(10, 2*i);
        bcdValue += ((byte >> 4) & 0x0F) * Math.pow(10, 2*i + 1);
    }
    
    const celsius = bcdValue * 0.01; // 示例：BCD值1800 → 18.00°C
    
    return {
        bcd_value: bcdValue,
        celsius: celsius.toFixed(2),
        formatted: celsius.toFixed(2) + " °C",
        raw_bytes: bytesToHexString(tempBytes),
        decoding_note: "BCD小端顺序"
    };
}

// 辅助函数：解析时间 (7字节)
function parseTime(timeBytes) {
    if (timeBytes.length !== 7) return null;
    
    // 字节顺序: 秒, 分, 时, 日, 月, 年(低), 年(高)
    const second = parseBCD([timeBytes[0]]);
    const minute = parseBCD([timeBytes[1]]);
    const hour = parseBCD([timeBytes[2]]);
    const day = parseBCD([timeBytes[3]]);
    const month = parseBCD([timeBytes[4]]);
    const yearLow = parseBCD([timeBytes[5]]);
    const yearHigh = parseBCD([timeBytes[6]]);
    const year = yearHigh * 100 + yearLow;
    
    // 格式化为ISO时间
    const isoTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T` +
                    `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}Z`;
    
    return {
        raw: bytesToHexString(timeBytes),
        bcd: `${year}${month}${day}${hour}${minute}${second}`,
        iso: isoTime,
        formatted: `${year}-${month}-${day} ${hour}:${minute}:${second}`
    };
}

// 辅助函数：解析状态字 (2字节)
function parseStatus(statusBytes) {
    if (statusBytes.length !== 2) return null;
    
    const statusWord = (statusBytes[1] << 8) | statusBytes[0];
    const byte0 = statusBytes[0];
    
    // 解析状态字节0 (根据表3.1)
    const statusResult = {
        valve_status: (byte0 & 0x03) === 0 ? "Open" : 
                     (byte0 & 0x03) === 1 ? "Closed" : "Abnormal",
        battery_low: (byte0 & 0x04) ? true : false,
        pipe_burst: (byte0 & 0x08) ? true : false,
        pipe_leak: (byte0 & 0x10) ? true : false,
        temp_sensor_fault: (byte0 & 0x20) ? true : false,
        flow_sensor_fault: (byte0 & 0x40) ? true : false,
        pipe_direction: (byte0 & 0x80) ? "Reverse" : "Forward"
    };
    
    return {
        hex: "0x" + statusWord.toString(16).toUpperCase().padStart(4, '0'),
        raw_bytes: bytesToHexString(statusBytes),
        parsed: statusResult
    };
}

// 辅助函数：解析BCD值（兼容旧版）
function parseBCD(bytes) {
    let value = 0;
    for (let i = 0; i < bytes.length; i++) {
        const high = (bytes[i] >> 4) & 0x0F;
        const low = bytes[i] & 0x0F;
        value = value * 100 + high * 10 + low;
    }
    return value;
}

// 辅助函数：字节数组转HEX字符串
function bytesToHexString(byteArray) {
    return Array.from(byteArray, byte => 
        ('0' + (byte & 0xFF).toString(16)).slice(-2)
    ).join('');
}