/**
 * ESP32 Simulator
 * Sends simulated sensor data to the backend for testing.
 * Usage: npm run simulate
 *
 * This is a BACKUP for when the physical ESP32 is not available.
 * The final demo should use the real ESP32.
 */

const API_URL = process.env.API_URL || 'http://localhost:5000/api/sensor-data';
const INTERVAL_MS = 2000; // Send data every 2 seconds

let count = 0;

function randomBetween(min, max) {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

function generateSensorData() {
  count++;

  const data = {
    deviceId: 'ESP32-001',
    temperature: randomBetween(22, 35),
    humidity: randomBetween(40, 75),
    vibration: randomBetween(0.1, 0.4),
    pressure: randomBetween(1008, 1018),
    frequency: randomBetween(47, 53),
    motion: 0.0,
  };

  // Every 10th reading, spike vibration and trigger motion anomaly
  if (count % 10 === 0) {
    data.vibration = randomBetween(2.0, 3.5);
    data.motion = 1.0;
    console.log(`\n⚠️  SPIKE! Sending high vibration (${data.vibration}g) & motion intrusion (${data.motion} lvl)\n`);
  }

  return data;
}

async function sendData() {
  const data = generateSensorData();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      const alertInfo = result.alerts && result.alerts.length > 0
        ? ` | 🚨 ${result.alerts.length} alert(s)!`
        : '';
      console.log(
        `[#${count}] ✅ Sent: temp=${data.temperature}°C hum=${data.humidity}% vib=${data.vibration}g${alertInfo}`
      );
    } else {
      console.log(`[#${count}] ❌ Error: ${result.error}`);
    }
  } catch (err) {
    console.log(`[#${count}] ❌ Connection failed: ${err.message}`);
    console.log('   Make sure the backend is running: npm run dev');
  }
}

console.log('');
console.log('╔══════════════════════════════════════════╗');
console.log('║   ESP32 SIMULATOR (Backup for testing)   ║');
console.log('╚══════════════════════════════════════════╝');
console.log('');
console.log(`Sending data to: ${API_URL}`);
console.log(`Interval: ${INTERVAL_MS}ms`);
console.log(`Every 10th reading will spike vibration to trigger an alert`);
console.log('Press Ctrl+C to stop\n');

// Send first reading immediately
sendData();

// Then send on interval
const timer = setInterval(sendData, INTERVAL_MS);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nSimulator stopped.');
  clearInterval(timer);
  process.exit(0);
});
