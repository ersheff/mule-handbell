let xOutput = document.getElementById("x-output");
let yOutput = document.getElementById("y-output");
let zOutput = document.getElementById("z-output");
let accelPerm = document.getElementById("accel-perm");

document.addEventListener("click", startAccel);

function startAccel(){
  DeviceMotionEvent.requestPermission().then(response => {
    if (response === "granted") {
      let lastZ = 0;
      let threshold = 50;
      window.addEventListener("devicemotion", (event) => {
        let z = event.acceleration.z;
        if (z - lastZ > threshold) {
          document.body.style.backgroundColor = "red";
        }
        else document.body.style.backgroundColor = "white";
      });
    }
  });
}