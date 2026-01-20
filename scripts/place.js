const yearSpan = document.querySelector('#year');
const modifiedSpan = document.querySelector('#modified');
const windChillSpan = document.querySelector('#windchill');

yearSpan.textContent = new Date().getFullYear();
modifiedSpan.textContent = document.lastModified;

const temperature = 10;
const windSpeed = 10;

function calculateWindChill(temp, speed) {
  return (13.12 + 0.6215 * temp - 11.37 * Math.pow(speed, 0.16) + 0.3965 * temp * Math.pow(speed, 0.16)).toFixed(1);
}

if (temperature <= 10 && windSpeed > 4.8) {
  windChillSpan.textContent = `${calculateWindChill(temperature, windSpeed)} °C`;
} else {
  windChillSpan.textContent = 'N/A';
}

const timeSpan = document.getElementById("spnTime");
const tokyoTime = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' });
timeSpan.textContent = tokyoTime;

