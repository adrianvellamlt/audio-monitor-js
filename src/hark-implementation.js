// does all the audio leveling magics
import '../node_modules/hark/hark.bundle.js'
// facilitates user media stuff to get current device
import '../node_modules/getusermedia/getusermedia.bundle.js'

window.activeSound = (updateMonitorLevel, isListening) => {
    getUserMedia({ video: false, audio: true }, function (err, stream) {
        if (err) throw err

        const deviceNameElem = document.getElementById("device-name");
        if (deviceNameElem) deviceNameElem.innerText = stream.getTracks()[0].label
    
        var options = {};
        var speechEvents = hark(stream, options);
    
        speechEvents.on('volume_change', function (currentVolume, currentThreshold) {
            const sensitivity = 7
            const vol = ((100 + currentVolume) / 100) / sensitivity
            updateMonitorLevel(vol)
        });

        if (isListening) {
            speechEvents.suspend()
        }
        else {
            speechEvents.resume()
        }
    });
}