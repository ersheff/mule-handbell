const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

let pitch = notes[0];

let xSmoothOutput = document.getElementById("x-smooth-output");
let xDiffOutput = document.getElementById("x-diff-output");

let startButton = document.getElementById("start-button");

let pitchRadios = document.getElementById("pitch-radios");


let smoothX = 0;
let xThresh = 2.5;
let debounceTimer = 20;
let debounceAmount = 20;

const length = 4;

pitchRadios.addEventListener("click", () => {
  pitch = notes[document.querySelector('input[name="pitches"]:checked').value];
});

startButton.addEventListener("click", async () => {

  startButton.style.display = "none";

  if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission().then(response => {
      if (response === "granted") {

        window.addEventListener("devicemotion", (event) => {
          let x = Math.abs(event.acceleration.x);
          let lastX = smoothX;
          smoothX = (lastX*0.75)+(x*0.25);
          xSmoothOutput.innerText = smoothX.toFixed(2);

          let xDiff = smoothX-lastX;

          if (xDiff > xThresh && debounceTimer <= 0) {
            document.body.style.backgroundColor = "red";
            let octave = Math.floor(Math.random() * 2) + 3;
            polySynth.triggerAttackRelease(pitch+octave, length, Tone.immediate());
            debounceTimer = debounceAmount;
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
      let x = Math.abs(event.acceleration.x);
      let lastX = smoothX;
      smoothX = (lastX*0.75)+(x*0.25);
      xSmoothOutput.innerText = smoothX.toFixed(2);

      let xDiff = smoothX-lastX;

      if (xDiff > xThresh && debounceTimer <= 0) {
        document.body.style.backgroundColor = "red";
        let octave = Math.floor(Math.random() * 2) + 3;
        polySynth.triggerAttackRelease(pitch+octave, length, Tone.immediate());
        debounceTimer = debounceAmount;
      }

      if (debounceTimer-- <= 0) {
        debounceTimer = 0;
        document.body.style.backgroundColor = "black";
      }

    });
  }

  await Tone.start();

  const polySynth = new Tone.PolySynth({
    voice: Tone.FMSynth
  });

  polySynth.set({
    oscillator: {
      type: "triangle3"
    },
    harmonicity: 5.5,
    modulationIndex: 8,
    envelope: {
      attack: 0,
      decay: length,
      sustain: 0,
      release: 0
    },
    modulationEnvelope: {
      attack: 0,
      decay: length,
      sustain: 0,
      release: 0
    }
  });

  const autoFilter = new Tone.AutoFilter("4n", 5, 2).start();

  const chorus = new Tone.Chorus(4, 2.4, 0.15).start();

  polySynth.connect(autoFilter);

  polySynth.connect(chorus);

  chorus.toDestination();
  autoFilter.toDestination();

});
