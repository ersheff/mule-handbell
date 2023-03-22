let zOutput = document.getElementById("z-output");
let accelPerm = document.getElementById("accel-perm");

document.addEventListener("click", startAccel);

function startAccel(){
  DeviceMotionEvent.requestPermission().then(response => {
    if (response === "granted") {
      let lastZ = 0;
      let smoothZ = 0;
      let threshold = 50;
      window.addEventListener("devicemotion", (event) => {
        let z = event.acceleration.z;
        smoothZ = (lastZ*0.85)+(z*0.15);
        zOutput.innerText = `z: ${smoothZ}`
        if (z - smoothZ > threshold) {
          document.body.style.backgroundColor = "red";
        }
        else document.body.style.backgroundColor = "white";
        lastZ = smoothZ;
      });
    }
  });
}