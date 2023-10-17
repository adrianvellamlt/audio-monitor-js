
// Creating a list of colors for led
const ledColor = [
    "#064dac",
    "#064dac",
    "#064dac",
    "#06ac5b",
    "#15ac06",
    "#4bac06",
    "#80ac06",
    "#acaa06",
    "#ac8b06",
    "#ac5506",
]
let isFirstClick = true
let listening = false

document.getElementById('audio').addEventListener('click', () => {
    activeSound(updateMonitorLevel, listening)

    // Just to know if button is on or off
    // and stop or resume the microphone listening
    let audioButton = document.getElementsByClassName('audio-control')[0]
    if (listening) {
        audioButton.style.boxShadow = "-2px -2px 4px 0px #a7a7a73d, 2px 2px 4px 0px #0a0a0e5e"
        audioButton.style.fontSize = "25px"
    } else {
        audioButton.style.boxShadow = "5px 2px 5px 0px #0a0a0e5e inset, -2px -2px 1px 0px #a7a7a73d inset"
        audioButton.style.fontSize = "24px"
    }

    listening = !listening
})

/**
 * This method updates leds
 * depending the volume detected
 * 
 * @param {Float} vol value of volume detected from microphone
 */
function updateMonitorLevel(volume) {
    const vol = (volume * 100)

    let leds = [...document.getElementsByClassName('led')]
    let range = leds.slice(0, Math.round(vol))

    for (var i = 0; i < leds.length; i++) {
        leds[i].style.boxShadow = "-2px -2px 4px 0px #a7a7a73d, 2px 2px 4px 0px #0a0a0e5e";
        leds[i].style.height = "22px"
    }

    for (var i = 0; i < range.length; i++) {
        range[i].style.boxShadow = `5px 2px 5px 0px #0a0a0e5e inset, -2px -2px 1px 0px #a7a7a73d inset, -2px -2px 30px 0px ${ledColor[i]} inset`;
        range[i].style.height = "25px"
    }
}
