import { loadBirds } from "./components/birds/birds.js";
import { loadBuildings } from "./components/buildings/buildings.js";
import { createCamera } from "./components/camera.js";
import { createAxesHelper, createGridHelper } from "./components/helpers.js";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene.js";

import { createControls } from "./systems/controls.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./systems/Loop.js";
import { TWEEN } from "tween";
import { AmmoPhysics } from "three/addons/physics/AmmoPhysics.js";

import * as THREE from "three";
// import {PointerLockControls} from ""
import { PointerLockControls } from "../three/examples/jsm/controls/Pointerlockcontrols.js";


 var options = {
   zone: document.getElementById("zone_joystick"),
   mode: "static",
   color: "red",
   size: 100,
   zIndex: 1000,
   threshold: 0.1,
   position: { left: "10px",bottom: "10px"},
   restJoystick: true,
 };

 let check = false;
 let a = window.navigator.userAgent||navigator.vendor||window.opera
 if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;

 

 
 
  var manager = null;
  if(check == true) manager = nipplejs.create(options);
console.log('check',check,manager);



// These variables are module-scoped: we cannot access them
// from outside the module
let camera;
let controls;
let renderer;
let css3drenderer;
let scene;
let loop;

let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let vertex = new THREE.Vector3();
let color = new THREE.Color();

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

var collidableMeshList = [];

class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    const {
      renderer,
      css3drenderer
    } = createRenderer();

    const onKeyDown = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          moveForward = true;
          break;
        case "ArrowLeft":
        case "KeyA":
          moveLeft = true;
          break;
        case "ArrowDown":
        case "KeyS":
          moveBackward = true;
          break;
        case "ArrowRight":
        case "KeyD":
          moveRight = true;
          break;
      }
    };

    const onKeyUp = (event) => {
      console.log(event.keyCode);
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          moveForward = false;
          break;
        case "ArrowLeft":
        case "KeyA":
          moveLeft = false;
          break;
        case "ArrowDown":
        case "KeyS":
          moveBackward = false;
          break;
        case "ArrowRight":
        case "KeyD":
          moveRight = false;
          break;
      }
    };

    // document.addEventListener("touchstart", function () {
    //   console.log("touch");
    //   moveForward = true;
    // });

    // document.addEventListener("touchend", function () {
    //   console.log("end");
    //   moveForward = false;
    // });

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const lightGroup = createLights();

    scene.add(lightGroup);

    const resizer = new Resizer(container, camera, renderer);

    scene.add(createAxesHelper(), createGridHelper());
  }

  async init() {
    // const {
    //   personCube,
    //   controls
    // } = await createControls(camera, renderer.domElement);
    
    controls = new PointerLockControls(camera, document.body);

    controls.tick = (delta) => {
      const time = performance.now();

      if (controls.isLocked === true) {
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward)
          velocity.z -= direction.z * 1500.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 1500.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        // personCube.position.set(
        //   controls.getObject().position.x,
        //   controls.getObject().position.y,
        //   controls.getObject().position.z
        // );

        // const firstBB = new THREE.Box3().setFromObject(personCube);
        // const secondBB = new THREE.Box3().setFromObject(collidableMeshList[0]);

        // var collision = firstBB.intersectsBox(secondBB);
      }

      prevTime = time;
    };

    const blocker = document.getElementById("blocker");
    const instructions = document.getElementById("instructions");

    instructions.addEventListener("click", () => {
      controls.lock();
    });

    controls.addEventListener("lock", () => {
      instructions.style.display = "none";
      blocker.style.display = "none";
    });

    controls.addEventListener("unlock", () => {
      blocker.style.display = "block";
      instructions.style.display = "";
    });

    controls.getObject().position.x = 0;
    controls.getObject().position.y = 120;
    controls.getObject().position.z = 0;

    // controls.getObject().position.x = 400;
    // controls.getObject().position.y = 830;
    // controls.getObject().position.z = 1100;

    const control_target = new THREE.Vector3();
    // control_target.x = 0;
    // control_target.y = 120;
    // control_target.z = 300;
    control_target.x = controls.getObject().position.x ;
    control_target.y = controls.getObject().position.y;
    control_target.z = controls.getObject().position.z + 100;

    controls.getObject().lookAt(control_target);

    // console.log(controls.getObject());
    scene.add(controls.getObject());


    if(check == true)
    manager.on("move", (evt, nipple) => {
      moveForward = false;
      moveBackward = false;
      moveLeft = false;
      moveRight = false;
      const {angle} = nipple;
      if (angle.degree > 45 && angle.degree < 135) {
        moveForward = true;

      } else if (angle.degree > 135 && angle.degree < 225) {
        moveLeft = true;
      } else if (angle.degree > 225 && angle.degree < 315) {
        moveBackward = true;
  
      } else {
        moveRight = true;
      }

      
    });
    if(check == true)
    manager.on("end", (evt, nipple) => {
      moveForward = false;
      moveBackward = false;
      moveLeft = false;
      moveRight = false;

    });



    // let physics = await AmmoPhysics();

    // scene.add(controls.getObject(), personCube);

    // physics.addMesh(personCube);
    // const floor = new THREE.Mesh(
    //   new THREE.BoxGeometry(10000, 10, 10000),
    //   new THREE.MeshLambertMaterial({
    //     color: 0x111111
    //   })
    // );
    // floor.position.set(400, 700, 1100)
    // scene.add(floor);
    // physics.addMesh(floor, 0);

    //

    const material = new THREE.MeshLambertMaterial();

    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();

    // Boxes

    // const geometryBox = new THREE.BoxGeometry(50, 50, 50);
    // let boxes = new THREE.Mesh(geometryBox, material);
    // boxes.position.set(450, 1500, 1100)
    // boxes.castShadow = true;
    // boxes.receiveShadow = true;
    // scene.add(boxes);

    // physics.addMesh(boxes, 10);

    loop.updatables.push(controls);

    ////////

    const building = await loadBuildings();

    console.log(building.getObjectByName('Cube_044'));

    var elevator = building.children[1];
    var elevator_door = elevator.getObjectByName("elevator_Main_panel__1_");
    var leds = elevator.getObjectByName("led");
    building.children[0].getObjectByName("elevator_Main_panel").visible = false;
    building.children[0].getObjectByName("Panel_010__1_").visible = false;

    var led_13 = leds.children.slice(0, 13);
    leds.children[0].material.color.setHex(0x000000);
    led_13[0].material = new THREE.MeshLambertMaterial({ color: 0x000000 });
    led_13[0].material.emissive.setHex(0x00ff00);
    elevator_door.position.y -= 2;
    // floor1_elevator_door.position.z -= 200;
    document.addEventListener("keydown", (event) => {
      if (event.key == "b") {
        new TWEEN.Tween(elevator_door.position)
          .to(
            {
              y: elevator_door.position.y + 2,
            },
            2000
          )
          .start()
          .onComplete(() => {
            new TWEEN.Tween(elevator.position)
              .to(
                {
                  y: elevator.position.y + 675,
                },
                6000
              )
              .start();
            new TWEEN.Tween(camera.position)
              .to(
                {
                  y: camera.position.y + 675,
                },
                6000
              )
              .start();
            led_13.map((x, i) => {
              x.material = new THREE.MeshLambertMaterial({ color: 0x000000 });
              x.material.emissive.setHex(0x00ff00);
              x.material.emissiveIntensity = 0;
              console.log(x.material);
              new TWEEN.Tween(x.material)
                .to(
                  {
                    emissiveIntensity: 1,
                  },
                  500
                )
                .delay(1000 * i)
                .start();
              if (i != led_13.length - 1) {
                new TWEEN.Tween(x.material)
                  .to(
                    {
                      emissiveIntensity: 0,
                    },
                    10
                  )
                  .delay(1000 * (i + 1))
                  .start();
              }
            });
            new TWEEN.Tween(elevator_door.position)
              .to(
                {
                  y: elevator_door.position.y - 2,
                },
                2000
              )
              .delay(1000 * (led_13.length + 1))
              .start();
          })
          .update(() => renderer.render(scene, camera));

        // new TWEEN.Tween(elevator.position)
        // .to({
        //     y : elevator.position.y+10,
        //   },
        //   6000
        // )
        // .delay(6000)
        // .start()
        // .update(()=>{renderer.render(scene, camera);
        //   co})
      }
    });

    TWEEN.tick = (delta) => {
      TWEEN.update();
    };
    loop.updatables.push(TWEEN);
    scene.add(building);

    collidableMeshList.push(building.getObjectByName("Wall"));
  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
    // css3drenderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}


export { World };
