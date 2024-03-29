import { LifeGame } from "../life-game";

/**
 * コンフィグ
 */
export type ColorTransitionConfig = {
    row: number;    // セルのY位置
    col: number;    // セルのX位置
    colorFrom: number;  // 遷移前の色
    colorTo: number;    // 遷移後の色
    duration: number;   // 遷移時間(ミリ秒)
}

//tweenによる色の変化を行うクラス
export class ColorTransition {
    private scene: Phaser.Scene;
    private lifeGame: LifeGame;
    private config: ColorTransitionConfig;
    private tween: Phaser.Tweens.Tween;
    private current: number;

    /**
     * コンストラクタ
     * @param scene シーン
     * @param lifeGame ライフゲーム
     * @param config コンフィグ
     */
    constructor(scene: Phaser.Scene, lifeGame: LifeGame, config: ColorTransitionConfig) {
        this.scene = scene;
        this.lifeGame = lifeGame;
        this.config = config;
        this.current = this.config.colorFrom;

        this.tween = this.scene.tweens.addCounter({
            duration: this.config.duration,
            ease: "Linear",
            onStart: this._onStart,
            onStartScope: this,
            onUpdate: this._onUpdate,
            onUpdateScope: this,
            onComplete: this._onComplete,
            onCompleteScope: this,
        })
    }

    // 遷移を停止させる
    kill(): void {
        this.tween.stop();
    }

    // 開始時の処理
    private _onStart(): void {
        this.current = 0;

        this._draw();
    }

    // 更新処理
    private _onUpdate(): void {
        this.current = this.tween.totalProgress;
        this._draw();
    }

    // 完了時の処理
    private _onComplete(): void {
        this.current = 1;
        this._draw();
    }

    // 色を線形補間する
    private _lerpColor(from: number, to: number, t: number): number {
        // agb に分解
        const from_r = ((from >> 16) & 0xff);
        const from_g = ((from >> 8) & 0xff);
        const from_b = ((from >> 0) & 0xff);
        const to_r = ((to >> 16) & 0xff);
        const to_g = ((to >> 8) & 0xff);
        const to_b = ((to >> 0) & 0xff);

        // 各色を補完
        const lerp_r = from_r * (1.0 - t) + to_r * t;
        const lerp_g = from_g * (1.0 - t) + to_g * t;
        const lerp_b = from_b * (1.0 - t) + to_b * t;

        // rgb に戻す
        const ret = ((lerp_r & 0xff) << 16) | ((lerp_g & 0xff) << 8) | ((lerp_b & 0xff) << 0);
        return ret;
    }

    // 表示処理
    private _draw(): void {
        //fillColor の色を算出
        const color = this._lerpColor(this.config.colorFrom, this.config.colorTo, this.current);

        this.lifeGame.drawCell(this.config.row, this.config.col, color);
    }

}