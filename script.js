let xSmoothOutput = document.getElementById("x-smooth-output");
let xDiffOutput = document.getElementById("x-diff-output");

let startButton = document.getElementById("start-button");
let pitchButtons = document.querySelectorAll(".pitch-button");

let smoothX = 0;
let xThresh = 2.5;
let debounceTimer = 20;
let debounceAmount = 20;

let pitch = "B2";
let velocity = 1;

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
            document.body.style.backgroundColor = "red";
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
        document.body.style.backgroundColor = "red";
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
      attack: 0,
      decay: length/4,
      sustain: 0,
      release: 0
    },
    volume: -30
  });

  squareSynth.set({
    oscillator : {
      type : "square"
    },
    detune: -5,
    envelope : {
      attack: 0.01,
      decay: length,
      sustain: 0,
      release: 0
    },
    filterEnvelope : {
      attack: 0,
      decay: length,
      sustain: 0,
      release: 0
    },
    volume: -10
  });

  sawSynth.set({
    oscillator : {
      type : "sawtooth"
    },
    detune: -10,
    envelope : {
      attack: 0.01,
      decay: length,
      sustain: 0,
      release: 0
    },
    filter : {
      frequency: 5000
    },
    filterEnvelope : {
      attack: 0,
      decay: length,
      sustain: 0,
      release: 0
    },
    volume: -10
  });

  metalSynth.toDestination();
  squareSynth.toDestination();
  sawSynth.toDestination();

  //const autoFilter = new Tone.AutoFilter("4n", 5, 2).start();

  //const chorus = new Tone.Chorus(4, 2.4, 0.15).start();

  //theSynth.connect(autoFilter);

  //theSynth.connect(chorus);

  //chorus.toDestination();
  //autoFilter.toDestination();

});

function value_limit(val, min, max) {
  return val < min ? min : (val > max ? max : val);
}