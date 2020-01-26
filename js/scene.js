import * as BABYLON from 'babylonjs';
import * as _ from 'lodash';

const NORTH = 0;
const SOUTH = 1;
const EAST = 2;
const WEST = 3;
const UP = 4;
const DOWN = 5;

BABYLON.ArcRotateCamera.prototype.spinTo = function (whichprop, targetval, speed) {
    var ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
	BABYLON.Animation.CreateAndStartAnimation('at4', this, whichprop, speed, 120, this[whichprop], targetval, 0, ease);
}

function addPlane(scene, x, y, z, direction) {
    let myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
    let floorImage = `./td_world/td_world_floor_mossy_${_.sample(['a','b','c','d','e'])}.png`;
    let wallImage = `./td_world/td_world_floor_cobble_${_.sample(['a','b','c','d','e'])}.png`;

    let plane = BABYLON.MeshBuilder.CreatePlane("plane", {width: 1, height: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);

    plane.material = myMaterial;

    plane.position.x = x;
    plane.position.y = y;
    plane.position.z = z;

    let rotation = _.sample([0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]);

    switch(direction) {
        case UP:
            plane.rotation = new BABYLON.Vector3(0, 0, rotation);
            plane.position.z += 0.5;
            myMaterial.emissiveTexture = new BABYLON.Texture(floorImage, scene, null, null, 1);
            break;
        case DOWN:
            plane.rotation = new BABYLON.Vector3(Math.PI, 0, rotation);
            plane.position.z -= 0.5;
            myMaterial.emissiveTexture = new BABYLON.Texture(floorImage, scene, null, null, 1);
            break;
        case NORTH:
            plane.rotation = new BABYLON.Vector3(Math.PI/2, rotation, 0);
            plane.position.y += 0.5;
            myMaterial.emissiveTexture = new BABYLON.Texture(wallImage, scene, null, null, 1);
            break;
        case SOUTH:
            plane.rotation = new BABYLON.Vector3(-Math.PI/2, rotation, 0);
            plane.position.y -= 0.5;
            myMaterial.emissiveTexture = new BABYLON.Texture(wallImage, scene, null, null, 1);
            break;
        case EAST:
            plane.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
            plane.position.x += 0.5;
            myMaterial.emissiveTexture = new BABYLON.Texture(wallImage, scene, null, null, 1);
            break;
        case WEST:
            plane.rotation = new BABYLON.Vector3(0, -Math.PI/2, rotation);
            plane.position.x -= 0.5;
            myMaterial.emissiveTexture = new BABYLON.Texture(wallImage, scene, null, null, 1);
            break;
    }

    return plane;
}

function addCube(scene, x, y, z) {
    [UP, DOWN, NORTH, SOUTH, EAST, WEST].forEach(direction => addPlane(scene, x, y, z, direction));
}

export function createScene(engine, canvas, axes=false) {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI/2, 0.8, 25, new BABYLON.Vector3(0, 1, 0), scene);
    camera.upVector = new BABYLON.Vector3(0, 0, 1);
    camera.attachControl(canvas, true);

    if (axes) {
        new BABYLON.AxesViewer(scene);
    }

    for (let x = -5; x < 5; x++) {
        for (let y = -5; y < 5; y++) {
            addCube(scene, x, y, 0);
        }
    }

    addCube(scene, 0, 0, 1);
    addCube(scene, 0, 1, 1);
    addCube(scene, 2, 3, 1);

    var spriteManagerPlayer = new BABYLON.SpriteManager("playerManager","./td_monsters/td_monsters_berserker_d1.png", 1, {width: 16, height: 16}, scene, null, 1);
    var sprite1 = new BABYLON.Sprite("sprite", spriteManagerPlayer);
    sprite1.position.x = 2;
    sprite1.position.y = 2;
    sprite1.position.z = 1;

    var spriteManagerEnemy = new BABYLON.SpriteManager("enemyManager","./td_monsters/td_monsters_troll_l1.png", 1, {width: 16, height: 16}, scene, null, 1);
    var sprite2 = new BABYLON.Sprite("sprite2", spriteManagerEnemy);
    sprite2.position.x = 0;
    sprite2.position.y = 1;
    sprite2.position.z = 2;

    camera.spinTo("alpha", 1.2, 20);

    return scene;
}