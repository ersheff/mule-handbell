let zThreshold = document.getElementById("z-threshold");
let zThresholdOutput = document.getElementById("z-threshold-output");
let zValue = document.getElementById("z-value");

let startButton = document.getElementById("start-button");

let zThresh = 0;
let debounceTimer = 20;

zThreshold.addEventListener("input", () => {
  zThresh = zThreshold.value;
  zThresholdOutput.innerText = zThresh;
})

startButton.addEventListener("click", async () => {
  
  await Tone.start();

  const polySynth = new Tone.PolySynth({
    voice: Tone.MonoSynth
  });

  polySynth.set({
    oscillator: {
      type: "fatsawtooth",
      spread: 0.1
    },
    envelope: {
      attack: 0,
      decay: 1,
      sustain: 0,
      release: 0
    },
    filter: {
      rolloff: -12
    },
    filterEnvelope: {
      attack: 0,
      decay: 1,
      sustain: 0,
      release: 0,
      baseFrequency: 1000,
      octaves: 1
    }
  });

  polySynth.toDestination();

  DeviceMotionEvent.requestPermission().then(response => {
    if (response === "granted") {

      let lastZ = 0;
      let smoothZ = 0;

      window.addEventListener("devicemotion", (event) => {
        let z = event.acceleration.z*10;
        smoothZ = (lastZ*0.75)+(z*0.25);
        zValue.value = smoothZ;
        let zDiff = z - smoothZ;

        if (zDiff > zThresh && debounceTimer <= 0) {
          document.body.style.backgroundColor = "red";
          polySynth.triggerAttackRelease(60, 1, Tone.immediate(), 1);
          debounceTimer = 20;
        }
        else document.body.style.backgroundColor = "white";
        lastZ = smoothZ;

        if (debounceTimer-- <= 0) {
          debounceTimer = 0;
        }

      });
    }
  });

});