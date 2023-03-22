let xyzOutput = document.getElementById("xyz-output");
let abgOutput = document.getElementById("abg-output");
let accelPerm = document.getElementById("accel-perm");

document.addEventListener("click", startAccel);

function startAccel(){
  DeviceMotionEvent.requestPermission().then(response => {
    if (response === "granted") {
      // xyz axes (units in m/s^2)
      window.addEventListener("devicemotion", (event) => {
        xyzOutput.innerText = `x: ${event.acceleration.x}, y: ${event.acceleration.y}, z: ${event.acceleration.z}`;
      });
      // alpha-beta-gamma axes (units in degrees)
      window.addEventListener("deviceorientation",(event) => {
        abgOutput.innerText = `alpha: ${event.alpha}, beta: ${event.beta}, gamma: ${event.gamma}`;
      });
    }
  });
}