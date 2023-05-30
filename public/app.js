var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class App {
    constructor(engine) {
        this.isReady = false;
        this.animationGroups = {
            说话: BABYLON.AnimationGroup,
            眨眼: BABYLON.AnimationGroup,
            讲解: BABYLON.AnimationGroup,
            发呆: BABYLON.AnimationGroup,
            挥手: BABYLON.AnimationGroup,
        };
        this.engine = engine;
        this.canvas = engine.getRenderingCanvas();
    }
    init() {
        const scene = this.CreateScene(this.engine, this.canvas);
        this.scene = scene;
        this.engine.runRenderLoop(() => {
            scene.render();
        });
    }
    CreateScene(engine, canvas) {
        let scene = new BABYLON.Scene(engine);
        this.scene = scene;
        scene.ambientColor = new BABYLON.Color3(1, 1, 1);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        this.scene.debugLayer.show();
        const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 5, new BABYLON.Vector3(0, 0, 0), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl();
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        this.importAss();
        return scene;
    }
    importAss() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield BABYLON.SceneLoader.ImportMeshAsync("", "/assets/", "ass.glb", this.scene);
            let anis = res.animationGroups;
            for (let i = 0; i < anis.length; i++) {
                let ani = anis[i];
            }
        });
    }
}
