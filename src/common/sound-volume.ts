/**
 * AtumaruApi が使えない場合、代替で使用するサウンドボリューム変更UIを制御する
 */

import { Consts } from "../consts";

/**
 * サウンドボリュームUIの表示用各種設定
 */
export type SoundVolumeConfig = {
    pos: {
        x: number;
        y: number;
    },

    icon: {
        atlas: string;
        frame: {
            volume: string;
            mute: string;
        };
        pos: {
            x: number;
            y: number;
        };
        scale: {
            x: number;
            y: number;
        };
    };

    guage: {
        pos: {
            x: number;
            y: number;
        };
        size: {
            w: number;
            h: number;
        };
        color: {
            normal: number;
            disabled: number;
            bg: number;
        };
    };

    handle: {
        size: {
            w: number;
            h: number;
        };
        color: {
            normal: number;
            grabed: number;
            disabled: number;
        };
    }

    panel: {
        pos: {
            x: number;
            y: number;
        };
        size: {
            w: number;
            h: number;
        };
        color: {
            normal: number;
        };
        alpha: {
            normal: number;
        };
    }
};

/**
 * サウンドボリュームUIクラス
 */
export class SoundVolume {

    private scene: Phaser.Scene;    // シーン
    private config: SoundVolumeConfig;  // コンフィグ
    private container: Phaser.GameObjects.Container;    // UIをまとめたコンテナ
    private icon: Phaser.GameObjects.Image; // アイコン画像
    private handle: Phaser.GameObjects.Rectangle;   // ボリュームのつまみ
    private guage: Phaser.GameObjects.Rectangle;    // ゲージ部分
    private guageBg: Phaser.GameObjects.Rectangle;  // ゲージ背景
    private panel: Phaser.GameObjects.Rectangle;    // UI背景

    private soundVolume: number;    // 現在のサウンドボリューム
    private clicked: boolean;       // クリックされたか
    private isMute: boolean;        // ミュートかどうか

    /**
     * コンストラクタ
     * @param scene 親のシーン
     * @param config コンフィグ
     */
    constructor(scene: Phaser.Scene, config: SoundVolumeConfig) {
        // パラメータ設定
        this.scene = scene;
        this.config = config;
        this.soundVolume = 0.5;
        this.clicked = false;
        this.isMute = this.scene.sound.mute;    // 現在ミュートされているか

        // サウンドボリュームUIを入れるためのコンテナを作成
        this.container = scene.add.container(config.pos.x, config.pos.y);
        this.container.setDepth(Consts.SoundVolume.Panel.DEPTH);

        // アイコンの初期化
        {
            // 画像ロード、表示パラメータの設定
            this.icon = scene.add.image(config.icon.pos.x, config.icon.pos.y, config.icon.atlas, config.icon.frame.volume);
            this.icon.setScale(config.icon.scale.x, config.icon.scale.y);
            this.icon.setDepth(Consts.SoundVolume.Icon.DEPTH);
            // 入力を受け付ける
            this.icon.setInteractive();
            // 各種入力時のコールバックを設定
            this.icon.on("pointerdown", this._onDownIcon, this);
            // コンテナに追加
            this.container.add(this.icon);
        }

        // ツマミ部分の初期化
        {
            // 四角形の表示パラメータの設定
            this.handle = scene.add.rectangle(config.guage.pos.x + config.guage.size.w * this.soundVolume, config.guage.pos.y,
                config.handle.size.w, config.handle.size.h, config.handle.color.normal);
            this.handle.setDepth(Consts.SoundVolume.Handle.DEPTH);
            this.handle.setOrigin(0.5, 0.5);
            // 入力を受け付ける
            this.handle.setInteractive();
            // 各種入力時のコールバックを設定
            this.handle.on("pointerdown", this._onDown, this);
            this.handle.on("pointerup", this._onUp, this);
            this.handle.on("pointermove", this._onMove, this);
            this.handle.on("pointerout", this._onOut, this);
            // コンテナに追加
            this.container.add(this.handle);
        }

        // ゲージ部分の初期化
        {
            // 四角形の表示パラメータの設定
            this.guage = scene.add.rectangle(config.guage.pos.x, config.guage.pos.y,
                config.guage.size.w * this.soundVolume, config.guage.size.h, config.guage.color.normal);
            this.guage.setDepth(Consts.SoundVolume.Guage.DEPTH);
            this.guage.setOrigin(0.0, 0.5);
            // コンテナに追加
            this.container.add(this.guage);
        }

        // ゲージ背景の初期化
        {
            // 四角形の表示パラメータの設定
            this.guageBg = scene.add.rectangle(config.guage.pos.x, config.guage.pos.y,
                config.guage.size.w, config.guage.size.h, config.guage.color.bg);
            this.guageBg.setDepth(Consts.SoundVolume.GuageBg.DEPTH);
            this.guageBg.setOrigin(0.0, 0.5);
            // 入力を受け付ける
            this.guageBg.setInteractive();
            // 各種入力時のコールバックを設定
            this.guageBg.on("pointerdown", this._onDownGauge, this);
            // コンテナに追加
            this.container.add(this.guageBg);
        }

        // UIの背景
        {
            // 四角形の表示パラメータの設定
            this.panel = scene.add.rectangle(config.panel.pos.x, config.panel.pos.y,
                config.panel.size.w, config.panel.size.h, config.panel.color.normal, config.panel.alpha.normal);
            this.panel.setDepth(Consts.SoundVolume.Panel.DEPTH);
            this.panel.setOrigin(0.0, 0.5);
            // コンテナに追加
            this.container.add(this.panel);
        }
        // コンテナ内の表示順をdepthの値でソートする
        this.container.sort('depth');

        // 各種更新処理を一度呼び出しておく
        this._updateIcon();
        this._updateGuageSize();
        this._updateGuageColor();
        this._updateHandlePos();
        this._updateHandleColor();
    }

    /**
     * マスターボリュームを取得する
     * @returns 現在のマスターボリューム
     */
    public getMasterVolume(): number {
        return this.soundVolume;
    }

    /**
     * マスターボリュームを設定する
     * @param volume 設定するマスターボリュームの値
     */
    public setMasterVolume(volume: number): void {
        this.soundVolume = volume;
        this.scene.sound.volume = this.soundVolume;
        this._updateGuageSize();
        this._updateHandlePos();
        this._updateHandleColor();
    }

    /**
     * マスターボリュームのミュートを設定、解除する
     * @param muteFlag ミュートフラグ
     */
    public setMasterVolumeMute(muteFlag: boolean): void {
        this.isMute = muteFlag;
        this.scene.sound.mute = this.isMute;
        this._updateIcon();
        this._updateGuageColor();
        this._updateHandleColor();
    }

    /**
     * マスターボリュームがミュートされているか取得する
     * @returns 現在のミュートフラグを返す
     */
    public isMasterVolumeMute(): boolean {
        return this.isMute;
    }

    /**
     * アイコンがクリックされた際の処理。
     * ミュートの設定をトグルで切り替える。
     * @param pointer マウスパラメータ
     */
    private _onDownIcon(pointer: Phaser.Input.Pointer): void {
        let isMute = this.isMasterVolumeMute();
        this.setMasterVolumeMute(!isMute);
    }

    /**
     * サウンドボリュームのUI内でマウスが動いた際の処理。
     * @param pointer マウスパラメータ
     */
    private _onMove(pointer: Phaser.Input.Pointer): void {
        if (!this.clicked) {
            return; // マウスボタン押下中でなければなにもしない
        }

        // console.log("SoundVolume._onMove() x:" + pointer.x + " y:" + pointer.y);
        this._updateHandle(pointer.x, pointer.y);
    }

    /**
     * サウンドボリュームのUIから出た際の処理。
     * @param pointer マウスパラメータ
     */
    private _onOut(pointer: Phaser.Input.Pointer): void {
        if (!this.clicked) {
            return; // マウスボタン押下中でなければなにもしない
        }
        this.clicked = false;   // クリックフラグを下げる

        // console.log("SoundVolume._onOut() x:" + pointer.x + " y:" + pointer.y);
        this._updateHandle(pointer.x, pointer.y);
    }

    /**
     * サウンドボリュームのUI内でクリックされた際の処理。
     * @param pointer マウスパラメータ
     */
    private _onDown(pointer: Phaser.Input.Pointer): void {
        this.clicked = true;    // クリックフラグを立てる
        // console.log("SoundVolume._onDown");
    }

    /**
     * サウンドボリュームUIのゲージがクリックされた際の処理。
     * @param pointer マウスパラメータ
     */
    private _onDownGauge(pointer: Phaser.Input.Pointer): void {
        this._updateHandle(pointer.x, pointer.y);
    }

    /**
     * サウンドボリュームのUI内でマウスボタンが離された際の処理
     * @param pointer マウスパラメータ
     */
    private _onUp(pointer: Phaser.Input.Pointer): void {
        if (!this.clicked) {
            return;
        }
        this.clicked = false;

        // console.log("SoundVolume._onUp() x:" + pointer.x + " y:" + pointer.y);
        this._updateHandle(pointer.x, pointer.y);
    }

    /**
     * マウスの位置に応じてマスターボリュームを変更する
     * @param x マウスのX座標
     * @param y マウスのY座標
     */
    private _updateHandle(x: number, y: number): void {
        // 下限値より小さければボリュームを0にする
        if (this._isXMinLimit(x)) {
            // console.log("_updateHandle() xMinLImit. x:" + x);
            this.setMasterVolume(0);
        }
        // 上限値より大きければボリュームを1にする
        else if (this._isXMaxLimit(x)) {
            // console.log("_updateHandle() xMaxLImit is true. x:" + x);
            this.setMasterVolume(1);
        }
        // 現在の位置に応じてボリュームをセットする
        else {
            const ratio = this._toRatio(x, y);
            // console.log("_updateHandle ratio:" + ratio);
            this.setMasterVolume(ratio);
        }
    }

    /**
     * 下限値を取得
     * @returns 下限値
     */
    private _getXMinLimit(): number {
        const minX = this.container.x + this.guageBg.x - this.guageBg.originX * this.guageBg.width;
        return minX;
    }

    /**
     * 上限値を取得
     * @returns 上限値
     */
    private _getXMaxLimit(): number {
        const minX = this._getXMinLimit();
        const maxX = minX + this.guageBg.width;
        return maxX;
    }

    /**
     * 指定したX座標を下限値を下回っているかチェックする
     * @param x チェックするX座標
     * @returns x が下限値を下回っている場合は true 、そうでない場合は false を返す。
     */
    private _isXMinLimit(x: number): boolean {
        const minX = this._getXMinLimit();
        return (x < minX);
    }

    /**
     * 指定したX座標が上限値を上回っているかチェックする
     * @param x チェックするX座標
     * @returns x が上限値を上回っている場合は true 、そうでない場合は false を返す。
     */
    private _isXMaxLimit(x: number): boolean {
        const maxX = this._getXMaxLimit();
        return (x > maxX);
    }

    /**
     * 指定した座標がUI内でどれくらいの位置にあるか、0-1の範囲で値を返す
     * @param x X座標
     * @param y Y座標
     * @returns 指定された座標のUIサイズに対する割合（0-1）
     */
    private _toRatio(x: number, y: number): number {
        let ratio = (x - (this.container.x + this.config.guage.pos.x)) / this.config.guage.size.w;
        if (ratio < 0) {
            ratio = 0;
        }
        if (ratio > 1) {
            ratio = 1;
        }
        return ratio;
    }

    /**
     * 現在のサウンドボリュームに合わせてゲージのサイズを変更する
     */
    private _updateGuageSize(): void {
        if (this.isMasterVolumeMute()) {
            return;
        }
        this.guage.setSize(this.config.guage.size.w * this.soundVolume, this.config.guage.size.h);
    }

    /**
     * 現在のミュート状況に応じて、ゲージの色を変更する
     */
    private _updateGuageColor(): void {
        if (this.isMasterVolumeMute()) {
            this.guage.setFillStyle(this.config.guage.color.disabled);
        }
        else {
            this.guage.setFillStyle(this.config.guage.color.normal);
        }
    }

    /**
     * 現在のサウンドボリュームに合わせてつまみの位置を変更する
     */
    private _updateHandlePos(): void {
        if (this.isMasterVolumeMute()) {
            return;
        }

        this.handle.setPosition(this.config.guage.pos.x + this.config.guage.size.w * this.soundVolume, this.config.guage.pos.y);
    }

    /**
     * 現在のミュート状況に応じて、つまみの色を変更する
     */
    private _updateHandleColor(): void {
        if (this.isMasterVolumeMute()) {
            this.handle.setFillStyle(this.config.handle.color.disabled);
        }
        else {
            if (this.clicked) {
                this.handle.setFillStyle(this.config.handle.color.grabed);
            }
            else {
                this.handle.setFillStyle(this.config.handle.color.normal);
            }
        }
    }

    /**
     * 現在のミュート状況に応じて、アイコン画像を変更する
     */
    private _updateIcon(): void {
        if (this.isMasterVolumeMute()) {
            this.icon.setFrame(this.config.icon.frame.mute);
        }
        else {
            this.icon.setFrame(this.config.icon.frame.volume);
        }
    }
}
