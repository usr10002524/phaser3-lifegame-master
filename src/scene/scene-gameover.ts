/**
 * ゲームオーバーシーン（未使用）
 */
export class SceneGameOver extends Phaser.Scene {

    constructor() {
        super({ key: "GameOver" });

    }

    create() {
        this.scene.start("Title");
    }
}