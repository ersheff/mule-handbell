let pitchButtons = document.querySelectorAll(".pitch-button");

let eventThreshold = 10;
let eventMax = 30;

let debounceTimer = 50;
let debounceAmount = 50;

let diffX = 0;
let lastX = 0;
let lastDiffX = 0;

let lastZ = 0;
let lastDiffZ = 0;

let pitch = 74;

let color = "blue";

pitchButtons.forEach(button => button.addEventListener("click", () => {
  let currentlyActive = document.querySelector(".active-pitch");
  currentlyActive.classList.remove("active-pitch");
  button.classList.add("active-pitch");
  pitch = button.value;
}));

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
  document.getElementById("start-audio").onpointerdown = (e) => {
    context.resume();
    e.target.disabled = true;
  }

  document.getElementById("start-accel").addEventListener("click", async () => {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission().then(async (response) => {
        if (response === "granted") {
          document.getElementById("start-accel").disabled = true;
          console.log("granted!");
          window.addEventListener("devicemotion", (event) => {
            let accX = event.acceleration.x;
            diffX = accX - lastX;

            console.log(diffX);

            // orientation
            if (diffX > eventThreshold && diffX < lastDiffX && debounceTimer >= debounceAmount) {
              let velocityTrigger = value_limit(diffX, eventThreshold, eventMax);;
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
              triggerNote(pitch, velocityTrigger);
              debounceTimer = 0;
            }
            
            if (debounceTimer++ >= debounceAmount) {
              debounceTimer = debounceAmount;
              document.body.style.backgroundColor = "black";
            }

            lastX = accX;
            lastDiffX = diffX;
  
          });
        }
      });
    }
  });

  function triggerNote(p, v) {
    console.log(`triggering note: ${p} at velocity: ${v}`);
    const midiNote = new MessageEvent(TimeNow, "in2", [ p ]);
    const velocity = new MessageEvent(TimeNow, "in1", [ v ]);
    device.scheduleEvent(midiNote);
    device.scheduleEvent(velocity);
  }

  function value_limit(val, min, max) {
    return val < min ? min : (val > max ? max : val);
  }
  
};

setup();


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
        debounceTimer = debounceAmount;
        xDiffOutput.innerText = valocity.toFixed(2);
      }

      if (debounceTimer-- <= 0) {
        debounceTimer = 0;
        document.body.style.backgroundColor = "black";
      }

    });
  }

});

function value_limit(val, min, max) {
  return val < min ? min : (val > max ? max : val);
}
*/