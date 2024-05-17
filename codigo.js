const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');
const cameraSelect = document.getElementById('cameraSelect');
const startScanButton = document.getElementById('startScan');
const captureButton = document.getElementById('capture');

const scanner = new jscanify();
const canvasCtx = canvas.getContext('2d');
const resultCtx = result.getContext('2d');

async function getCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  videoDevices.forEach((device, index) => {
    const option = document.createElement('option');
    option.value = device.deviceId;
    option.text = device.label || `Camera ${index + 1}`;
    cameraSelect.appendChild(option);
  });
}

async function startCamera(deviceId) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: { exact: deviceId } }
  });
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    video.play();
    console.log("scan");
    scan();
  };
}

function scan() {
  setInterval(() => {
    canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const resultCanvas = scanner.highlightPaper(canvas);
    resultCtx.drawImage(resultCanvas, 0, 0, result.width, result.height);
  }, 10);
}

captureButton.addEventListener('click', () => {
  resultCtx.drawImage(canvas, 0, 0, result.width, result.height);
});

startScanButton.addEventListener('click', () => {
  const selectedCameraId = cameraSelect.value;
  if (selectedCameraId) {
    startCamera(selectedCameraId);
  }
});

// Initialize camera options on page load
getCameras();
