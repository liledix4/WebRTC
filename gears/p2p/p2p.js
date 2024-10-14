import QrScanner from '../qr-scanner.min.js';

let playerIDGlobal;
let conn;
const
    peer = new Peer(undefined, {
		// host: "192.168.0.149",
		// port: 9000,
		// path: "/",
        config: {'iceServers': [
            { url: "stun:stun.l.google.com:19302" },
            { url: "stun:stun.l.google.com:5349" },
            { url: "stun:stun1.l.google.com:3478" },
            { url: "stun:stun1.l.google.com:5349" },
            { url: "stun:stun2.l.google.com:19302" },
            { url: "stun:stun2.l.google.com:5349" },
            { url: "stun:stun3.l.google.com:3478" },
            { url: "stun:stun3.l.google.com:5349" },
            { url: "stun:stun4.l.google.com:19302" },
            { url: "stun:stun4.l.google.com:5349" }
        ]}
	}),
    QRSize = 256,
    qrScanner = new QrScanner(
        document.getElementById('scan-qr'),
        result => detectedQR(result.data),
        {returnDetailedScanResult: true}
    );

function generateQR(input) {
    let qrcode = new QRCode(
        document.getElementById("qrcode"),
        {width : QRSize, height : QRSize}
    );
    document.getElementById('my-player-id').innerHTML = input;
    qrcode.makeCode(input);
}
function detectedQR(QRData) {
    document.getElementById('player-id').value = QRData;
    qrScanner.stop();
    $('#scan-again').removeAttr('style');
    findThePlayer(QRData);
}
function findThePlayer(playerID) {
    console.log('Oookay');
    conn = peer.connect(playerID, {reliable: true});
    console.log(conn);
    conn.on('open', function() {
        console.log('Did it work tho?');
        playerIDGlobal = playerID;
        // Receive messages
        conn.on('data', function(data) {
            console.log("You've got something!");
            console.log('Received', data);
        });
        console.log('I guess?');
        console.log(conn);
    });
}
function sendMessage(text) {
    conn.send(text);
    console.log("Data sent: "+text);
}

// =====================================================================

peer.on('open', function(id) {
    generateQR(id);
});
$('#player-find').click(function(){findThePlayer($('#player-id').val());});
$('#send-message').click(function(){
    sendMessage('HIYAAAAAA!!!!!!');
});

// =====================================================================

{
qrScanner.start();
$('#scan-again').click(function(){
    qrScanner.start();
    $(this).attr('style', 'display: none');
});
}

{ // File scanning
const
    fileSelector = document.getElementById('file-selector'),
    fileQrResult = document.getElementById('player-id');
fileSelector.addEventListener('change', event => {
    const file = fileSelector.files[0];
    if (!file) {
        return;
    }
    QrScanner.scanImage(file, { returnDetailedScanResult: true })
        .then(result => detectedQR(result.data))
        .catch(e => fileQrResult.value = e || 'No QR code found.');
});
}