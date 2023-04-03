let startButton = document.getElementById("start-button");
let testButton = document.getElementById("test-button");


startButton.addEventListener("click", async () => {

  testButton.addEventListener("click", () => {
    polySynth.triggerAttackRelease("C4", 8, Tone.immediate());
  })

  await Tone.start();

  const polySynth = new Tone.PolySynth({
    voice: Tone.FMSynth
  });

  polySynth.set({
    oscillator: {
      type: "triangle3"
    },
    harmonicity: 5.5,
    modulationIndex: 15,
    envelope: {
      attack: 0,
      decay: 8,
      sustain: 0,
      release: 0
    },
    modulationEnvelope: {
      attack: 0,
      decay: 8,
      sustain: 0,
      release: 0
    }
  });

  const autoFilter = new Tone.AutoFilter("4n", 5, 2).start();

  autoFilter.depth = 0;

  const chorus = new Tone.Chorus(4, 2.4, 0.15).start();

  polySynth.connect(autoFilter);

  polySynth.connect(chorus);

  chorus.toDestination();
  autoFilter.toDestination();

});