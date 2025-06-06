function decodeUplink(input) {
  var mode = (input.bytes[6] & 0x7c) >> 2;
  var data = {};
  var port = input.fPort;
  var bytes = input.bytes;
  var mode = (bytes[6] & 0x7c) >> 2;
  switch (input.fPort) {
    case 2:
      if (mode != 2 && mode != 31) {
        data.BatV = ((input.bytes[0] << 8) | input.bytes[1]) / 1000;
        data.TempC1 = parseFloat(((((input.bytes[2] << 24) >> 16) | input.bytes[3]) / 10).toFixed(2));
        data.ADC_CH0V = ((input.bytes[4] << 8) | input.bytes[5]) / 1000;
        data.Digital_IStatus = input.bytes[6] & 0x02 ? 'H' : 'L';
        if (mode != 6) {
          data.EXTI_Trigger = input.bytes[6] & 0x01 ? 'TRUE' : 'FALSE';
          data.Door_status = input.bytes[6] & 0x80 ? 'CLOSE' : 'OPEN';
        }
      }
      if (mode == '0') {
        data.Work_mode = 'IIC';
        if (((input.bytes[9] << 8) | input.bytes[10]) === 0) {
          data.Illum = ((input.bytes[7] << 24) >> 16) | input.bytes[8];
        } else {
          data.TempC_SHT = parseFloat(((((input.bytes[7] << 24) >> 16) | input.bytes[8]) / 10).toFixed(2));
          data.Hum_SHT = parseFloat((((input.bytes[9] << 8) | input.bytes[10]) / 10).toFixed(1));
        }
      } else if (mode == '1') {
        data.Work_mode = ' Distance';
        data.Distance_cm = parseFloat((((input.bytes[7] << 8) | input.bytes[8]) / 10).toFixed(1));
        if (((input.bytes[9] << 8) | input.bytes[10]) != 65535) {
          data.Distance_signal_strength = parseFloat(((input.bytes[9] << 8) | input.bytes[10]).toFixed(0));
        }
      } else if (mode == '2') {
        data.Work_mode = ' 3ADC';
        data.BatV = input.bytes[11] / 10;
        data.ADC_CH0V = ((input.bytes[0] << 8) | input.bytes[1]) / 1000;
        data.ADC_CH1V = ((input.bytes[2] << 8) | input.bytes[3]) / 1000;
        data.ADC_CH4V = ((input.bytes[4] << 8) | input.bytes[5]) / 1000;
        data.Digital_IStatus = input.bytes[6] & 0x02 ? 'H' : 'L';
        data.EXTI_Trigger = input.bytes[6] & 0x01 ? 'TRUE' : 'FALSE';
        data.Door_status = input.bytes[6] & 0x80 ? 'CLOSE' : 'OPEN';
        if (((input.bytes[9] << 8) | input.bytes[10]) === 0) {
          data.Illum = ((input.bytes[7] << 24) >> 16) | input.bytes[8];
        } else {
          data.TempC_SHT = parseFloat(((((input.bytes[7] << 24) >> 16) | input.bytes[8]) / 10).toFixed(2));
          data.Hum_SHT = parseFloat((((input.bytes[9] << 8) | input.bytes[10]) / 10).toFixed(2));
        }
      } else if (mode == '3') {
        data.Work_mode = '3DS18B20';
        data.TempC2 = parseFloat(((((input.bytes[7] << 24) >> 16) | input.bytes[8]) / 10).toFixed(2));
        data.TempC3 = parseFloat(((((input.bytes[9] << 24) >> 16) | input.bytes[10]) / 10).toFixed(2));
      } else if (mode == '4') {
        data.Work_mode = 'Weight';
        data.Weight = ((input.bytes[7] << 24) >> 16) | input.bytes[8];
      } else if (mode == '5') {
        data.Work_mode = 'Count';
        data.Count = (input.bytes[7] << 24) | (input.bytes[8] << 16) | (input.bytes[9] << 8) | input.bytes[10];
      } else if (mode == '31') {
        data.Work_mode = 'ALARM';
        data.BatV = ((input.bytes[0] << 8) | input.bytes[1]) / 1000;
        data.TempC1 = parseFloat(((((input.bytes[2] << 24) >> 16) | input.bytes[3]) / 10).toFixed(2));
        data.TempC1MIN = (input.bytes[4] << 24) >> 24;
        data.TempC1MAX = (input.bytes[5] << 24) >> 24;
        data.SHTEMPMIN = (input.bytes[7] << 24) >> 24;
        data.SHTEMPMAX = (input.bytes[8] << 24) >> 24;
        data.SHTHUMMIN = input.bytes[9];
        data.SHTHUMMAX = input.bytes[10];
      }

      if (input.bytes.length == 11 || input.bytes.length == 12)
        return {
          data: data,
        };
      break;
    case 5:
      {
        if (bytes[0] == 0x19) data.SENSOR_MODEL = 'D20-LB';

        if (bytes[4] == 0xff) data.SUB_BAND = 'NULL';
        else data.SUB_BAND = bytes[4];

        if (bytes[3] == 0x01) data.FREQUENCY_BAND = 'EU868';
        else if (bytes[3] == 0x02) data.FREQUENCY_BAND = 'US915';
        else if (bytes[3] == 0x03) data.FREQUENCY_BAND = 'IN865';
        else if (bytes[3] == 0x04) data.FREQUENCY_BAND = 'AU915';
        else if (bytes[3] == 0x05) data.FREQUENCY_BAND = 'KZ865';
        else if (bytes[3] == 0x06) data.FREQUENCY_BAND = 'RU864';
        else if (bytes[3] == 0x07) data.FREQUENCY_BAND = 'AS923';
        else if (bytes[3] == 0x08) data.FREQUENCY_BAND = 'AS923_1';
        else if (bytes[3] == 0x09) data.FREQUENCY_BAND = 'AS923_2';
        else if (bytes[3] == 0x0a) data.FREQUENCY_BAND = 'AS923_3';
        else if (bytes[3] == 0x0b) data.FREQUENCY_BAND = 'CN470';
        else if (bytes[3] == 0x0c) data.FREQUENCY_BAND = 'EU433';
        else if (bytes[3] == 0x0d) data.FREQUENCY_BAND = 'KR920';
        else if (bytes[3] == 0x0e) data.FREQUENCY_BAND = 'MA869';

        data.FIRMWARE_VERSION = (bytes[1] & 0x0f) + '.' + ((bytes[2] >> 4) & 0x0f) + '.' + (bytes[2] & 0x0f);
        data.BAT = ((bytes[5] << 8) | bytes[6]) / 1000;
      }
      return {
        data: data,
      };
      break;
    default:
      return {
        errors: ['unknown FPort'],
      };
  }
}
