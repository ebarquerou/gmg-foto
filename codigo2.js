const videoElement = document.getElementById('videoElement');
const cameraList = document.getElementById('cameraList');
const captureButton = document.getElementById('captureButton');
const canvasElement = document.getElementById('canvasElement');
const capturedImage = document.getElementById('capturedImage');
let selectedDeviceId;

navigator.mediaDevices.enumerateDevices().then(devices => {
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    videoDevices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Camera ${cameraList.length + 1}`;
        cameraList.appendChild(option);
    });

    cameraList.onchange = () => {
        selectedDeviceId = cameraList.value;
        startVideoStream();
    };

    // Automatically select the first camera
    if (videoDevices.length > 0) {
        selectedDeviceId = videoDevices[0].deviceId;
        cameraList.value = selectedDeviceId;
        startVideoStream();
    }
});

function startVideoStream() {
    if (selectedDeviceId) {
        navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: selectedDeviceId } } })
            .then(stream => {
                videoElement.srcObject = stream;
                videoElement.onloadedmetadata = () => {
                    videoElement.play();
                    highlightPaper(videoElement);
                };
            })
            .catch(error => {
                console.error('Error accessing media devices.', error);
            });
    }
}

function highlightPaper(videoElement) {
    Jscanify.highlightPaper(videoElement, {
        onHighlight: () => {
            captureButton.style.display = 'block';
        },
        onDetect: () => {
            captureButton.style.display = 'block';
        }
    });
}

captureButton.addEventListener('click', () => {
    const context = canvasElement.getContext('2d');
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    const imageData = canvasElement.toDataURL('image/png');
    capturedImage.src = imageData;
    captureButton.style.display = 'none';
});
