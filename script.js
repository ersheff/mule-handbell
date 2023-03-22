let xOutput = document.getElementById("x-output");
let yOutput = document.getElementById("y-output");
let zOutput = document.getElementById("z-output");
let accelPerm = document.getElementById("accel-perm");

document.addEventListener("click", startAccel);

function startAccel(){
  DeviceMotionEvent.requestPermission().then(response => {
    if (response === "granted") {
      window.addEventListener("devicemotion", (event) => {
        xOutput.innerText = `x: ${Math.floor(event.acceleration.x*100)}`;
        yOutput.innerText = `y: ${Math.floor(event.acceleration.x*100)}`;
        zOutput.innerText = `z: ${Math.floor(event.acceleration.x*100)}`;
      });
    }
  });
}