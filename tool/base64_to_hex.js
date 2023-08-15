
function base64toHex(base64) {
    const binaryString = atob(base64);
    const hexArray = [];
  
    for (let i = 0; i < binaryString.length; i++) {
      const hex = binaryString.charCodeAt(i).toString(16);
      hexArray.push("0x");
      hexArray.push(hex.padStart(2, '0'));
      hexArray.push(",");
    }
  
    return hexArray.join('');
  }
  

  const base64String = 'vdYAAb4gMV8EQycXlKxDJzCUqkMnuValQyf+lKVq';
  const hexString = base64toHex(base64String);
  console.log(hexString);