declare var HandTrackerThreeHelper: any;
declare var PoseFlipFilter: any;
declare var handTrackerCanvas: any;
declare var THREE: any;
declare var WEBARROCKSHAND: any;

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private _settings: any = {
    threshold: 0.6, // detection sensitivity, between 0 and 1
    
    // CONVERSES SHOES:
    // 3D models:
    shoeRightPath: '../../assets/3d-models/vansShoe.glb',
    isModelLightMapped: true,
    occluderPath: '../../assets/3d-models/occluder.glb',
  
    // pose settings:
    scale: 1,
    translation: [0, -0.02, 0], // Z -> verical, Y+ -> front way
    
    /** 
    // BALLERINA SHOES:  
    // 3D models:
    shoeRightPath: 'assets/ballerinaShoe.glb',
    isModelLightMapped: false,
    occluderPath: 'assets/occluder.glb',
  
    // pose settings:
    scale: 1.1,
    translation: [0, 0.01, -0.02], // Z -> verical
    //
    */
  
    // debug flags:
    debugCube: false, // Add a cube
    debugDisplayLandmarks: true
  };
  
  private _three = {
    loadingManager: null
  }
  
  private _states = {
    notLoaded: -1,
    loading: 0,
    running: 1,
    busy: 2
  };

  private _state = this._states.notLoaded;
  private _isSelfieCam = false;

  constructor() {
    
  }

  ngOnInit() {
    this.main();
  }
  
  setFullScreen(cv: any){
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
  }
  
  
  // entry point:
  main(){
    this._state = this._states.loading;
  
    const handTrackerCanvas = document.getElementById('handTrackerCanvas');
    const VTOCanvas = document.getElementById('ARCanvas');
  
    this.setFullScreen(handTrackerCanvas);
    this.setFullScreen(VTOCanvas);
  
  
    HandTrackerThreeHelper.init({
      poseLandmarksLabels: [
        'ankleBack', 'ankleOut', 'ankleIn', 'ankleFront',
        'heelBackOut', 'heelBackIn',
        'pinkyToeBaseTop', 'middleToeBaseTop', 'bigToeBaseTop'
      ],
      poseFilter: PoseFlipFilter.instance({}),
      enableFlipObject: true,//true,
      cameraZoom: 1,
      freeZRot: false,
      threshold: this._settings.threshold,
      scanSettings: {
        translationScalingFactors: [0.3, 0.3, 1],
        multiDetectionSearchSlotsRate: 0.5,
        multiDetectionEqualizeSearchSlotScale: true, 
        multiDetectionForceSearchOnOtherSide: true
      },
      VTOCanvas: VTOCanvas,
      handTrackerCanvas: handTrackerCanvas,
      debugDisplayLandmarks: false,
      NNsPaths: ['../../neuralNets/NN_BAREFOOT_3.json'],
      maxHandsDetected: 2,
      stabilizationSettings: {
        NNSwitchMask: {
          isRightHand: true,
          isFlipped: false
        }
      }
    }).then((three: any) =>{
      handTrackerCanvas!.style.zIndex = '3'; // fix a weird bug on iOS15 / safari
      this.start(three);
    }).catch(function(err: any){
      console.log('INFO in main.js: an error happens ', err);
    });
  } 
  
  
  start(three: any){
    three.loadingManager.onLoad = function(){
      console.log('INFO in main.js: Everything is loaded');
      this._state = this._states.running;
    }
  
    // set tonemapping:
    three.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    three.renderer.outputEncoding = THREE.sRGBEncoding;
  
    // set lighting:
    if (!this._settings.isModelLightMapped){
      const pointLight = new THREE.PointLight(0xffffff, 2);
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      three.scene.add(pointLight, ambientLight);
    }
  
    // add a debug cube:
    if (this._settings.debugCube){
      const s = 1;
      const cubeGeom = new THREE.BoxGeometry(s,s,s);
      const cubeMesh = new THREE.Mesh(cubeGeom,new THREE.MeshNormalMaterial());
      HandTrackerThreeHelper.add_threeObject(cubeMesh);
    }
  
    const transform = (threeObject: any) => {
      threeObject.scale.multiplyScalar(this._settings.scale);
      threeObject.position.add(new THREE.Vector3().fromArray(this._settings.translation));
    }
  
    // load the shoes 3D model:
    new THREE.GLTFLoader().load(this._settings.shoeRightPath, function(gltf: any){
      const shoe = gltf.scene;
      transform(shoe);
      HandTrackerThreeHelper.add_threeObject(shoe);
    });
  
    new THREE.GLTFLoader().load(this._settings.occluderPath, function(gltf: any){
      const occluder = gltf.scene.children[0];
      transform(occluder);
      HandTrackerThreeHelper.add_threeOccluder(occluder);
    });
  
  } //end start()
  
  flip_camera(){
    if (this._state !== this._states.running){
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
    }).catch(function(err: any){
      console.log('ERROR in main.js: Cannot flip camera -', err);
    });
  }
}