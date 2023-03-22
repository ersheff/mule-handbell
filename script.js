let yThreshold = document.getElementById("y-threshold");
let yThresholdOutput = document.getElementById("y-threshold-output");
let yValue = document.getElementById("y-value");

let zThreshold = document.getElementById("z-threshold");
let zThresholdOutput = document.getElementById("z-threshold-output");
let zValue = document.getElementById("z-value");

let accelPerm = document.getElementById("accel-perm");

let yThresh = 0;
let zThresh = 0;

yThreshold.addEventListener("input", () => {
  yThresh = yThreshold.value;
  yThresholdOutput.innerText = yThresh;
});

zThreshold.addEventListener("input", () => {
  zThresh = zThreshold.value;
  zThresholdOutput.innerText = zThresh;
})

accelPerm.addEventListener("click", startAccel);


function startAccel(){
  DeviceMotionEvent.requestPermission().then(response => {
    if (response === "granted") {
      let lastY = 0;
      let smoothY = 0;
      let lastZ = 0;
      let smoothZ = 0;

      window.addEventListener("devicemotion", (event) => {
        let y = event.acceleration.y;
        let z = event.acceleration.z;
        
        if (y > 0) {
          smoothY = (lastY*0.85)+(y*0.15);
          yValue.value = smoothY;
          let yDiff = y - smoothY;
          if (yDiff > yThresh) {
            document.body.style.backgroundColor = "green";
          }
          else document.body.style.backgroundColor = "white";
          lastY = smoothY;
        }

        if (z > 0) {
          smoothZ = (lastZ*0.85)+(z*0.15);
          zValue.value = smoothZ;
          let zDiff = z - smoothZ;
          if (zDiff > zThresh) {
            document.body.style.backgroundColor = "red";
          }
          else document.body.style.backgroundColor = "white";
          lastZ = smoothZ;
        }

      });
    }
  });
}