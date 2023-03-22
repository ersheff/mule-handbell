let zThreshold = document.getElementById("z-threshold");
let zThresholdOutput = document.getElementById("z-threshold-output");
let zValue = document.getElementById("z-value");

let accelPerm = document.getElementById("accel-perm");

let zThresh = 0;
let debounceTimer = 0;

zThreshold.addEventListener("input", () => {
  zThresh = zThreshold.value;
  zThresholdOutput.innerText = zThresh;
})

accelPerm.addEventListener("click", startAccel);


function startAccel(){
  DeviceMotionEvent.requestPermission().then(response => {
    if (response === "granted") {

      let lastZ = 0;
      let smoothZ = 0;

      window.addEventListener("devicemotion", (event) => {
        let z = event.acceleration.z*10;

        if (z > 0) {
          smoothZ = (lastZ*0.75)+(z*0.25);
          zValue.value = smoothZ;
          let zDiff = z - smoothZ;
          if (zDiff > zThresh && debounceTimer <= 0) {
            document.body.style.backgroundColor = "red";
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