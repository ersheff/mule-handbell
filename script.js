let zSmoothOutput = document.getElementById("z-smooth-output");
let zDiffOutput = document.getElementById("z-diff-output");

let startButton = document.getElementById("start-button");

let pitchRadios = document.getElementById("pitch-radios");
let pitch = "C4";

let smoothZ = 0;
let zThresh = 2;
let debounceTimer = 30;

pitchRadios.addEventListener("click", () => {
  pitch = document.querySelector('input[name="pitches"]:checked').value;
});

startButton.addEventListener("click", async () => {

  startButton.style.display = "none";

  if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission().then(response => {
      if (response === "granted") {

        window.addEventListener("devicemotion", (event) => {
          let z = Math.abs(event.acceleration.z);
          let lastZ = smoothZ;
          smoothZ = (lastZ*0.75)+(z*0.25);
          zSmoothOutput.innerText = smoothZ.toFixed(2);

          let zDiff = smoothZ-lastZ;
          zDiffOutput.innerText = zDiff.toFixed(2);

          if (zDiff > zThresh && debounceTimer <= 0) {
            document.body.style.backgroundColor = "red";
            polySynth.triggerAttackRelease(pitch, 2, Tone.immediate());
            debounceTimer = 30;
          }

          if (debounceTimer-- <= 0) {
            debounceTimer = 0;
            document.body.style.backgroundColor = "black";
          }

        });
      }
    });
  }
  else {
    window.addEventListener("devicemotion", (event) => {
      let z = Math.abs(event.acceleration.z);
      let lastZ = smoothZ;
      smoothZ = (lastZ*0.75)+(z*0.25);
      zSmoothOutput.innerText = smoothZ.toFixed(2);

      let zDiff = smoothZ-lastZ;
      zDiffOutput.innerText = zDiff.toFixed(2);

      if (zDiff > zThresh && debounceTimer <= 0) {
        document.body.style.backgroundColor = "red";
        polySynth.triggerAttackRelease(pitch, 2, Tone.immediate());
        debounceTimer = 30;
      }

      if (debounceTimer-- <= 0) {
        debounceTimer = 0;
        document.body.style.backgroundColor = "black";
      }

    });
  }

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
      decay: 2,
      sustain: 0,
      release: 0
    },
    filter: {
      rolloff: -12
    },
    filterEnvelope: {
      attack: 0,
      decay: 2,
      sustain: 0,
      release: 0,
      baseFrequency: 800,
      octaves: 1
    }
  });

  polySynth.toDestination();

});
