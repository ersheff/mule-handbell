let zThresholdSlider = document.getElementById("z-threshold-slider");
let zThresholdOutput = document.getElementById("z-threshold-output");

let zSmoothSlider = document.getElementById("z-smooth-slider");
let zSmoothOutput = document.getElementById("z-smooth-output");

let zDiffSlider = document.getElementById("z-diff-slider");
let zDiffOutput = document.getElementById("z-diff-output");

let startButton = document.getElementById("start-button");

let smoothZ = 0;
let zThresh = 0;
let debounceTimer = 30;

zThresholdSlider.addEventListener("input", () => {
  zThresh = zThresholdSlider.value;
  zThresholdOutput.innerText = zThresh;
})

startButton.addEventListener("click", async () => {

  DeviceMotionEvent.requestPermission().then(response => {
    if (response === "granted") {

      window.addEventListener("devicemotion", (event) => {
        let z = event.acceleration.z;
        let lastZ = smoothZ;
        smoothZ = (lastZ*0.85)+(z*0.15);

        zSmoothSlider.value = smoothZ;
        zSmoothOutput.innerText = smoothZ;

        let zDiff = smoothZ-lastZ;

        zDiffSlider.value = zDiff;
        zDiffOutput.innerText = zDiff;

        if (zDiff > zThresh && debounceTimer <= 0) {
          document.body.style.backgroundColor = "red";
          polySynth.triggerAttackRelease(60, 1, Tone.immediate(), 1);
          debounceTimer = 20;
        }
        else document.body.style.backgroundColor = "white";

        if (debounceTimer-- <= 0) {
          debounceTimer = 0;
        }

      });
    }
  });

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

});
