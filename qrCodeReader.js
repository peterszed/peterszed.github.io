const QRcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");
console.log("a")

let scanning = false;



// functions
function drawStremFrame() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(drawStremFrame);
}

function scan() {
  try {
    QRcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}



QRcode.callback = (res) => {
  if (res) {
    outputData.innerText = res;
    scanning = false;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    qrResult.hidden = false;
    btnScanQR.hidden = false;
    canvasElement.hidden = true;
  }
};


btnScanQR.onclick = () =>{
	console.log("click")
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: { exact: "environment" },
							 height:720,
						     width : 1280 } })
    .then(function(stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      drawStremFrame();
      scan();
    });
};