let xSmoothOutput = document.getElementById("x-smooth-output");
let xDiffOutput = document.getElementById("x-diff-output");

let startButton = document.getElementById("start-button");
let pitchButtons = document.querySelectorAll(".pitch-button");

let smoothX = 0;
let xThresh = 2.2;
let debounceTimer = 20;
let debounceAmount = 20;

let pitch = "B2";
let velocity = 1;

let color = "red";

const length = 5;

pitchButtons.forEach(button => button.addEventListener("click", () => {
  let currentlyActive = document.querySelector(".active-pitch");
  currentlyActive.classList.remove("active-pitch");
  button.classList.add("active-pitch");
  pitch = button.value;
}));

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
            let rawVel = value_limit(xDiff, 2, 6);
            velocity = rawVel*0.15+0.1;
            if (pitch == "B2" || pitch == "B3") {
              color = "red";
            }
            else if (pitch == "C4") {
              color = "pink";
            }
            else if (pitch == "D4") {
              color = "orange";
            }
            else if (pitch == "D#4") {
              color = "green";
            }
            else if (pitch == "F#4") {
              color = "yellow";
            }
            else color = "red";
            document.body.style.backgroundColor = color;
            metalSynth.triggerAttackRelease(pitch, length, Tone.immediate(), velocity);
            squareSynth.triggerAttackRelease(pitch, length, Tone.immediate(), velocity);
            sawSynth.triggerAttackRelease(pitch, length, Tone.immediate(), velocity);
            debounceTimer = debounceAmount;
            xDiffOutput.innerText = velocity.toFixed(2);
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
        let rawVel = value_limit(xDiff, 2, 6);
        velocity = rawVel*0.15+0.1;
        if (pitch == "B2" || pitch == "B3") {
          color = "red";
        }
        else if (pitch == "C4") {
          color = "pink";
        }
        else if (pitch == "D4") {
          color = "orange";
        }
        else if (pitch == "D#4") {
          color = "green";
        }
        else if (pitch == "F#4") {
          color = "yellow";
        }
        else color = "red";
        document.body.style.backgroundColor = color;
        metalSynth.triggerAttackRelease(pitch, length, Tone.immediate(), velocity);
        squareSynth.triggerAttackRelease(pitch, length, Tone.immediate(), velocity);
        sawSynth.triggerAttackRelease(pitch, length, Tone.immediate(), velocity);
        debounceTimer = debounceAmount;
        xDiffOutput.innerText = valocity.toFixed(2);
      }

      if (debounceTimer-- <= 0) {
        debounceTimer = 0;
        document.body.style.backgroundColor = "black";
      }

    });
  }

  if (!("ontouchstart" in window)) {
    document.getElementById("test-button").hidden = false;
    document.getElementById("test-button").addEventListener("click", () => {
      metalSynth.triggerAttackRelease(pitch, length, Tone.immediate());
      squareSynth.triggerAttackRelease(pitch, length, Tone.immediate());
      sawSynth.triggerAttackRelease(pitch, length, Tone.immediate());
    });
  }

  await Tone.start();

  const metalSynth = new Tone.MetalSynth();
  const squareSynth = new Tone.MonoSynth();
  const sawSynth = new Tone.MonoSynth();

  metalSynth.set({
    detune: -1200,
    harmonicity: 3.5,
    modulationIndex: 5,
    envelope : {
      attack: 0.01,
      decay: length/6,
      sustain: 0,
      release: 0
    },
    volume: -24
  });

  squareSynth.set({
    oscillator : {
      type : "square"
    },
    envelope : {
      attack: 0.2,
      decay: length,
      sustain: 0,
      release: 0
    },
    filterEnvelope : {
      attack: 0.01,
      decay: length,
      sustain: 0,
      release: 0
    },
    volume: -6
  });

  sawSynth.set({
    oscillator : {
      type : "sawtooth"
    },
    detune: -5,
    envelope : {
      attack: 0.01,
      decay: length,
      sustain: 0,
      release: 0
    },
    filter : {
      type: "lowpass",
      rolloff: -24
    },
    filterEnvelope : {
      attack: 0.01,
      decay: length/2,
      sustain: 0,
      release: 0,
      baseFrequency: "G4",
      octaves: 3.2
    },
    volume: -6
  });

  //metalSynth.toDestination();
  //squareSynth.toDestination();
  sawSynth.toDestination();

  //const autoFilter = new Tone.AutoFilter("4n", 5, 2).start();

  const chorus = new Tone.Chorus(4, 2.4, 0.15).start();

  squareSynth.connect(chorus);
  metalSynth.connect(chorus);

  //theSynth.connect(chorus);

  chorus.toDestination();
  //autoFilter.toDestination();

});

function value_limit(val, min, max) {
  return val < min ? min : (val > max ? max : val);
}