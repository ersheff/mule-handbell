let pitchButtons = document.querySelectorAll(".pitch-button");

let eventThreshold = 15;
let eventMax = 30;

let debounceTimer = 20;
let debounceAmount = 20;

let diffX = 0;
let lastX = 0;
let lastDiffX = 0;

let diffZ = 0;
let lastZ = 0;
let lastDiffZ = 0;

let pitch = 74;

let color = "blue";

let myOrientation = "left-hand";

document.getElementById("orientation-select").addEventListener("input", () => {
  myOrientation = document.getElementById("orientation-select").value;
  //console.log(myOrientation);
});


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
    document.getElementById("orientation-select").disabled = true;
  }

  document.getElementById("start-accel").addEventListener("click", async () => {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission().then(async (response) => {
        if (response === "granted") {
          document.getElementById("start-accel").disabled = true;
          //console.log("granted!");
          window.addEventListener("devicemotion", (event) => {
            let accX = event.acceleration.x;
            diffX = accX - lastX;

            let accZ = event.acceleration.z;
            diffZ = accZ - lastZ;

            if (myOrientation === "left-hand") {
              if (diffX > eventThreshold && debounceTimer >= debounceAmount) {
                let velocityTrigger = (value_limit(diffX, eventThreshold, eventMax))*4.2;
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
            }
            else if (myOrientation === "right-hand") {
              if (diffX < -eventThreshold && debounceTimer >= debounceAmount) {
                let velocityTrigger = (value_limit(-diffX, eventMax, eventThreshold))*4.2;
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
            }
            else if (myOrientation === "top") {
              if (diffZ > eventThreshold && debounceTimer >= debounceAmount) {
                let velocityTrigger = (value_limit(diffZ, eventMax, eventThreshold))*4.2;
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
            }
            
            if (debounceTimer++ >= debounceAmount) {
              debounceTimer = debounceAmount;
              document.body.style.backgroundColor = "black";
            }

            lastX = accX;
            lastDiffX = diffX;

            lastZ = accZ;
            lastDiffZ = diffZ;
  
          });
        }
      });
    }
    else {
      document.getElementById("start-accel").disabled = true;
      //console.log("granted!");
      window.addEventListener("devicemotion", (event) => {
        let accX = event.acceleration.x;
        diffX = accX - lastX;

        let accZ = event.acceleration.z;
        diffZ = accZ - lastZ;

        if (myOrientation === "left-hand") {
          if (diffX > eventThreshold && debounceTimer >= debounceAmount) {
            let velocityTrigger = (value_limit(diffX, eventThreshold, eventMax))*4.2;
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
        }
        else if (myOrientation === "right-hand") {
          if (diffX < -eventThreshold && debounceTimer >= debounceAmount) {
            let velocityTrigger = (value_limit(-diffX, eventMax, eventThreshold))*4.2;
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
        }
        else if (myOrientation === "top") {
          if (diffZ > eventThreshold && debounceTimer >= debounceAmount) {
            let velocityTrigger = (value_limit(diffZ, eventMax, eventThreshold))*4.2;
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
        }
        
        if (debounceTimer++ >= debounceAmount) {
          debounceTimer = debounceAmount;
          document.body.style.backgroundColor = "black";
        }

        lastX = accX;
        lastDiffX = diffX;

        lastZ = accZ;
        lastDiffZ = diffZ;

      });
    }
  });

  function triggerNote(p, v) {
    //console.log(`triggering note: ${p} at velocity: ${v}`);
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