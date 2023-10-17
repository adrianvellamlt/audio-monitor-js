/** Declare a context for AudioContext object */
let audioContext
let isFirstClick = true

window.activeSound = (updateMonitorLevel, isListening) => {
    // Tell user that this
    // program wants to use
    // the microphone
    try {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        navigator.getUserMedia(
            { audio: true, video: false },
            stream => onMicrophoneGranted(stream, updateMonitorLevel, isListening),
            onMicrophoneDenied
        );
    } catch (e) {
        alert(e)
    }
}

/**
 * Method used to create a communication between
 * AudioWorkletNode, Microphone and AudioWorkletProcessor
 * 
 * @param {MediaStream} stream If user grant access to microphone, this gives you
 * a MediaStream object necessary in this implementation
 */
async function onMicrophoneGranted(stream, updateMonitorLevel, isListening) {
    const deviceNameElem = document.getElementById("device-name");
    if (deviceNameElem) deviceNameElem.innerText = stream.getTracks()[0].label

    // Instantiate just in the first time
    // when button is pressed
    if (isFirstClick) {
        // Initialize AudioContext object
        audioContext = new AudioContext()

        // Adding an AudioWorkletProcessor
        // from another script with addModule method
        await audioContext.audioWorklet.addModule('src/vanilla/volume-meter-processor.js')

        // Creating a MediaStreamSource object
        // and sending a MediaStream object granted by 
        // the user
        let microphone = audioContext.createMediaStreamSource(stream)

        // Creating AudioWorkletNode sending
        // context and name of processor registered
        // in volume-meter-processor.js
        const node = new AudioWorkletNode(audioContext, 'volume-meter')

        // Listing any message from AudioWorkletProcessor in its
        // process method here where you can know
        // the volume level
        node.port.onmessage = event => {
            const sensitivity = 5
            const vol = (event.data.volume ? event.data.volume : 0) / sensitivity
            updateMonitorLevel(vol)
        }

        // Now this is the way to
        // connect our microphone to
        // the AudioWorkletNode and output from audioContext
        microphone.connect(node).connect(audioContext.destination)

        isFirstClick = false
    }

    if (isListening) {
        audioContext.suspend()
    }
    else {
        audioContext.resume()
    }
}

function onMicrophoneDenied() {
    console.log('denied')
}