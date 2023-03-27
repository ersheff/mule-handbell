let zThreshold = document.getElementById("z-threshold");
let zThresholdOutput = document.getElementById("z-threshold-output");
let zValue = document.getElementById("z-value");

let startAccel = document.getElementById("start-accel");
let startSound = document.getElementById("start-sound");

let zThresh = 0;
let debounceTimer = 0;
let polySynth;

zThreshold.addEventListener("input", () => {
  zThresh = zThreshold.value;
  zThresholdOutput.innerText = zThresh;
})

startAccel.addEventListener("click", getAccel);

function getAccel() {

  DeviceMotionEvent.requestPermission().then(response => {
    if (response === "granted") {

      window.addEventListener("devicemotion", (event) => {
        let z = event.acceleration.z*10;

        if (z > 0) {
          smoothZ = (lastZ*0.75)+(z*0.25);
          zValue.value = smoothZ;
          let zDiff = z - smoothZ;
          if (zDiff > zThresh && debounceTimer <= 0) {
            document.body.style.backgroundColor = "red";
            polySynth.triggerAttackRelease(60, 1, Tone.immediate(), 1);
            debounceTimer = 30;
          }
          else document.body.style.backgroundColor = "white";
          lastZ = smoothZ;
        }

        if (debounceTimer-- <= 0) {
          debounceTimer = 0;
        }

      });
    }
  });
}


startSound.addEventListener("click", async () => {
  
  await Tone.start();

  polySynth = new Tone.PolySynth({
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

});
