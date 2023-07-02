declare var HandTrackerThreeHelper: any;
declare var PoseFlipFilter: any;
declare var THREE: any;
declare var WEBARROCKSHAND: any;

import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
  private three: any

  // 3D Model specification and settings
  @Input() threshold!: number; // detection sensitivity, between 0 and 1
  @Input() shoeRightPath!: BehaviorSubject<string>;
  @Input() modeName!: string;

  // Pose settings
  @Input() scale!: number;
  @Input() translation!: number[]; // Z -> vertical, Y+ -> front way

  // Debug flags
  @Input() debugCube!: boolean;

  // Scan settings
  @Input() scanSettings!: any;

  // Neural network paths
  @Input() NNsPaths!: string[];

  private _settings: any;

  private _three = {
    loadingManager: null
  }

  private _states = {
    notLoaded: -1,
    loading: 0,
    running: 1,
    busy: 2,
    loaded3dModel: 3
  };

  private _state = this._states.notLoaded;
  private _isSelfieCam = false;

  constructor() {

  }

  ngOnInit() {
    this._settings = {
      threshold: this.threshold,
      shoeRightPath: null,
      occluderPath: '../../assets/3d-models/occluder.glb', // foot occluder

      scale: this.scale,
      translation: this.translation,

      debugCube: this.debugCube,
      debugDisplayLandmarks: true,

      isModelLightMapped: true
    }

    this.shoeRightPath.subscribe((s) => {
      this._settings.shoeRightPath = s;

      // don't run start the first time emission occurs (before main has been run)
      // but run every time shoeRightPath emits after that
      if (this._state != this._states.notLoaded) {
        this.start(this.three);
      }
    });

    this.main();
  }

  setFullScreen(cv: any) {
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
  }


  // entry point:
  main() {
    this._state = this._states.loading;

    const handTrackerCanvas = document.getElementById('handTrackerCanvas');
    const VTOCanvas = document.getElementById('ARCanvas');

    this.setFullScreen(handTrackerCanvas);
    this.setFullScreen(VTOCanvas);

    const initParams: any = {
      poseLandmarksLabels: [
        'ankleBack', 'ankleOut', 'ankleIn', 'ankleFront',
        'heelBackOut', 'heelBackIn',
        'pinkyToeBaseTop', 'middleToeBaseTop', 'bigToeBaseTop'
      ],
      enableFlipObject: true,//true,
      cameraZoom: 1,
      freeZRot: false,
      threshold: this._settings.threshold,
      scanSettings: this.scanSettings,
      VTOCanvas: VTOCanvas,
      handTrackerCanvas: handTrackerCanvas,
      debugDisplayLandmarks: false,
      NNsPaths: this.NNsPaths,
      maxHandsDetected: 2,
      stabilizationSettings: {
        NNSwitchMask: {
          isRightHand: true,
          isFlipped: false
        }
      }
    }

    // set landmarks stabilizer if shoes on
    if (this.modeName == 'shoes-on-vto') {
      initParams.landmarksStabilizerSpec = {
        minCutOff: 0.001,
        beta: 3 // lower => more stabilized
      }
    }

    // set posefilter if barefoot
    if (this.modeName == 'barefoot-vto') {
      initParams.poseFilter = PoseFlipFilter.instance({})
    }

    HandTrackerThreeHelper.init(initParams).then((three: any) => {
      handTrackerCanvas!.style.zIndex = '3'; // fix a weird bug on iOS15 / safari
      this.three = three;
      this.start(this.three);
    }).catch(function (err: any) {
      console.log('INFO in main.js: an error happens ', err);
    });
  }


  start(three: any) {
    HandTrackerThreeHelper.clear_threeObjects(true);

    three.loadingManager.onLoad = function () {
      console.log('INFO in main.js: Everything is loaded');
      this._state = this._states.running;
    }

    // set tonemapping:
    three.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    three.renderer.outputEncoding = THREE.sRGBEncoding;

    // set lighting:
    if (!this._settings.isModelLightMapped) {
      const pointLight = new THREE.PointLight(0xffffff, 2);
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      three.scene.add(pointLight, ambientLight);
    }

    // add a debug cube:
    if (this._settings.debugCube) {
      const s = 1;
      const cubeGeom = new THREE.BoxGeometry(s, s, s);
      const cubeMesh = new THREE.Mesh(cubeGeom, new THREE.MeshNormalMaterial());
      HandTrackerThreeHelper.add_threeObject(cubeMesh);
    }

    this.load_shoes_3dmodel();
  } //end start()

  // load the shoes 3D model:
  load_shoes_3dmodel() {
    const transform = (threeObject: any) => {
      threeObject.scale.multiplyScalar(this._settings.scale);
      threeObject.position.add(new THREE.Vector3().fromArray(this._settings.translation));
    }

    new THREE.GLTFLoader().load(this._settings.shoeRightPath, function (gltf: any) {
      const shoe = gltf.scene;
      transform(shoe);
      HandTrackerThreeHelper.add_threeObject(shoe);
    });

    new THREE.GLTFLoader().load(this._settings.occluderPath, function (gltf: any) {
      const occluder = gltf.scene.children[0];
      transform(occluder);
      HandTrackerThreeHelper.add_threeOccluder(occluder);
    });
  }

  flip_camera() {
    if (this._state !== this._states.running) {
      return;
    }
    this._state = this._states.busy;
    WEBARROCKSHAND.update_videoSettings({
      facingMode: (this._isSelfieCam) ? 'environment' : 'user'
    }).then(() => {
      this._isSelfieCam = !this._isSelfieCam;
      this._state = this._states.running;
      // mirror canvas using CSS in selfie cam mode:
      document.getElementById('canvases')!.style.transform = (this._isSelfieCam) ? 'rotateY(180deg)' : '';
      console.log('INFO in main.js: Camera flipped successfully');
    }).catch(function (err: any) {
      console.log('ERROR in main.js: Cannot flip camera -', err);
    });
  }
}

