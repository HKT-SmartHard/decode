/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2025 HKT SmartHard
 * 
 * @product Pipeline pressure sensor
 */

function easy_decode(bytes) {
    var decoded = {};

    // 校验数据长度（至少5字节）
    if (bytes.length < 5) {
        decoded.Error = "Invalid data length";
        return decoded;
    }

    // 解析传感器主类型（第0字节，固定0x06）
    decoded.MainSensorType = bytes[0] === 0x06 ? "0x06" : "Invalid";

    // 解析帧类型（第1字节，原误命名为子传感器类型）
    decoded.FrameType = `0x${bytes[1].toString(16)}`;

    // 解析电池电压（第2字节）
    const voltageByte = bytes[2];
    decoded.BatteryStatus = (voltageByte & 0x80) ? "Low" : "Normal"; // 最高位为状态位
    decoded.BatteryVoltage = ((voltageByte & 0x7F) / 10).toFixed(1) + "V"; // 低7位为电压值

    // 解析水压（第3-4字节，大端序）
    decoded.WaterPressure = (bytes[3] << 8) | bytes[4] ;// 大端转换
    decoded.WaterPressure_kPa = decoded.WaterPressure;   // 单位千帕

    return decoded;
}



function decodeUplink(input) {
    var decoded = easy_decode(input.bytes);
    return { data: decoded };
}
