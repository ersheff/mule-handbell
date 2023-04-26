const setup = async () => {

  // create WebAudio AudioContext
  const WAContext = window.AudioContext;
  const context = new WAContext();
  
  // get exported RNBO patcher file (file name must match whatever is used during target export)
  const rawPatcher = await fetch("export/tta.export.json");
  const patcher = await rawPatcher.json();

  // create RNBO device
  const device = await RNBO.createDevice({ context, patcher });

  const { TimeNow, MessageEvent } = RNBO;

  // Load the exported dependencies.json file
  let dependencies = await fetch("export/dependencies.json");
  dependencies = await dependencies.json();

  // Load the dependencies into the device
  const results = await device.loadDataBufferDependencies(dependencies);
  results.forEach(result => {
      if (result.type === "success") {
          console.log(`Successfully loaded buffer with id ${result.id}`);
      } else {
          console.log(`Failed to load buffer with id ${result.id}, ${result.error}`);
      }
  });

  // connect device to AudioContext audio output
  device.node.connect(context.destination);
  
  // start audio with a button
  document.getElementById("start-button").onpointerdown = (e) => { 
    context.resume();
    e.target.disabled = true;
  };

  //

  // attach HTML UI elements to RNBO device parameters 
  document.getElementById("test-button").onclick = (e) => {
    const midiNote = new MessageEvent(TimeNow, "in2", [ 73 ]);
    const velocity = new MessageEvent(TimeNow, "in1", [ 127 ]);
    device.scheduleEvent(midiNote);
    device.scheduleEvent(velocity);
  };

  
};

setup();