import * as BABYLON from 'babylonjs';


class App {
    scene: BABYLON.Scene;
    engine: BABYLON.Engine;
    canvas: HTMLCanvasElement;

    isReady: boolean = false;

    animationGroups: {
        说话: BABYLON.AnimationGroup,
        眨眼: BABYLON.AnimationGroup,
        讲解: BABYLON.AnimationGroup,
        发呆: BABYLON.AnimationGroup,
        挥手: BABYLON.AnimationGroup,
    }


    constructor(engine: BABYLON.Engine) {
        this.engine = engine;
        this.canvas = engine.getRenderingCanvas() as HTMLCanvasElement;
    }

    init(): void {
        const scene = this.CreateScene(this.engine, this.canvas);
        this.scene = scene;
        this.engine.runRenderLoop(() => {
            scene.render();
        });
    }


    public CreateScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {

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

    async importAss() {
        let res = await BABYLON.SceneLoader.ImportMeshAsync("", "assets/", "scene.gltf", this.scene);

        let anis = res.animationGroups;
        for (let i = 0; i < anis.length; i++) {
            let ani = anis[i];
            switch (ani.name) {
                case "Key.001Action.003":
                    this.animationGroups.说话 = ani;
                    break;
                case "KeyAction.005":
                    this.animationGroups.眨眼 = ani;
                    break;
                case "悠闲-摇晃":
                    this.animationGroups.发呆 = ani;
                    break;
                case "招手.001":
                    this.animationGroups.挥手 = ani;
                    break;
                case "讲解-长":
                    this.animationGroups.讲解 = ani;
                    break;
                default:
                    break;
            }
        }

        this.isReady = true;
    }

    record() {
        
    }

}



