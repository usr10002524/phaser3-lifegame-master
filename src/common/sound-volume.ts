import { Consts } from "../consts";

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

export class SoundVolume {

    private scene: Phaser.Scene;
    private config: SoundVolumeConfig;
    private container: Phaser.GameObjects.Container;
    private icon: Phaser.GameObjects.Image;
    private handle: Phaser.GameObjects.Rectangle;
    private guage: Phaser.GameObjects.Rectangle;
    private guageBg: Phaser.GameObjects.Rectangle;
    private panel: Phaser.GameObjects.Rectangle;

    private soundVolume: number;
    private clicked: boolean;

    constructor(scene: Phaser.Scene, config: SoundVolumeConfig) {
        this.scene = scene;
        this.config = config;
        this.soundVolume = 0.5;
        this.clicked = false;

        this.container = scene.add.container(config.pos.x, config.pos.y);
        this.container.setDepth(Consts.SoundVolume.Panel.DEPTH);

        {
            this.icon = scene.add.image(config.icon.pos.x, config.icon.pos.y, config.icon.atlas, config.icon.frame.volume);
            this.icon.setScale(config.icon.scale.x, config.icon.scale.y);
            this.icon.setDepth(Consts.SoundVolume.Icon.DEPTH);
            this.icon.setInteractive();
            this.icon.on("pointerdown", this._onDownIcon, this)
            this.container.add(this.icon);
        }

        {
            this.handle = scene.add.rectangle(config.guage.pos.x + config.guage.size.w * this.soundVolume, config.guage.pos.y,
                config.handle.size.w, config.handle.size.h, config.handle.color.normal);
            this.handle.setDepth(Consts.SoundVolume.Handle.DEPTH);
            this.handle.setOrigin(0.5, 0.5);
            this.handle.setInteractive();
            this.handle.on("pointerdown", this._onDown, this);
            this.handle.on("pointerup", this._onUp, this);
            this.handle.on("pointermove", this._onMove, this);
            this.handle.on("pointerout", this._onOut, this);
            this.container.add(this.handle);
        }

        {
            this.guage = scene.add.rectangle(config.guage.pos.x, config.guage.pos.y,
                config.guage.size.w * this.soundVolume, config.guage.size.h, config.guage.color.normal);
            this.guage.setDepth(Consts.SoundVolume.Guage.DEPTH);
            this.guage.setOrigin(0.0, 0.5);
            this.container.add(this.guage);
        }

        {
            this.guageBg = scene.add.rectangle(config.guage.pos.x, config.guage.pos.y,
                config.guage.size.w, config.guage.size.h, config.guage.color.bg);
            this.guageBg.setDepth(Consts.SoundVolume.GuageBg.DEPTH);
            this.guageBg.setOrigin(0.0, 0.5);
            this.guageBg.setInteractive();
            this.guageBg.on("pointerdown", this._onDownGauge, this);

            this.container.add(this.guageBg);
        }

        {
            this.panel = scene.add.rectangle(config.panel.pos.x, config.panel.pos.y,
                config.panel.size.w, config.panel.size.h, config.panel.color.normal, config.panel.alpha.normal);
            this.panel.setDepth(Consts.SoundVolume.Panel.DEPTH);
            this.panel.setOrigin(0.0, 0.5);
            this.container.add(this.panel);
        }
        this.container.sort('depth');
    }

    public getMasterVolume(): number {
        return this.soundVolume;
    }

    public setMasterVolume(volume: number): void {
        this.soundVolume = volume;
        this.scene.sound.volume = this.soundVolume;
        this._updateGuageSize();
        this._updateHandlePos();
        this._updateHandleColor();
    }

    public setMasterVolumeMute(muteFlag: boolean): void {
        this.scene.sound.mute = muteFlag;
        this._updateIcon();
        this._updateGuageColor();
        this._updateHandleColor();
    }

    public isMasterVolumeMute(): boolean {
        return this.scene.sound.mute;
    }


    private _onDownIcon(pointer: Phaser.Input.Pointer): void {
        let isMute = this.isMasterVolumeMute();
        this.setMasterVolumeMute(!isMute);
    }

    private _onMove(pointer: Phaser.Input.Pointer): void {
        if (!this.clicked) {
            return;
        }

        // console.log("SoundVolume._onMove() x:" + pointer.x + " y:" + pointer.y);
        this._updateHandle(pointer.x, pointer.y);
    }

    private _onOut(pointer: Phaser.Input.Pointer): void {
        if (!this.clicked) {
            return;
        }
        this.clicked = false;

        // console.log("SoundVolume._onOut() x:" + pointer.x + " y:" + pointer.y);
        this._updateHandle(pointer.x, pointer.y);
    }

    private _onDown(pointer: Phaser.Input.Pointer): void {
        this.clicked = true;
        // console.log("SoundVolume._onDown");
    }

    private _onDownGauge(pointer: Phaser.Input.Pointer): void {
        this._updateHandle(pointer.x, pointer.y);
    }

    private _onUp(pointer: Phaser.Input.Pointer): void {
        if (!this.clicked) {
            return;
        }
        this.clicked = false;

        // console.log("SoundVolume._onUp() x:" + pointer.x + " y:" + pointer.y);
        this._updateHandle(pointer.x, pointer.y);
    }

    private _updateHandle(x: number, y: number): void {
        if (this._isXMinLimit(x)) {
            // console.log("_updateHandle() xMinLImit. x:" + x);
            this.setMasterVolume(0);
        }
        else if (this._isXMaxLimit(x)) {
            // console.log("_updateHandle() xMaxLImit is true. x:" + x);
            this.setMasterVolume(1);
        }
        else {
            const ratio = this._toRatio(x, y);
            // console.log("_updateHandle ratio:" + ratio);
            this.setMasterVolume(ratio);
        }
    }


    private _getXMinLimit(): number {
        const minX = this.container.x + this.guageBg.x - this.guageBg.originX * this.guageBg.width;
        return minX;
    }

    private _getXMaxLimit(): number {
        const minX = this._getXMinLimit();
        const maxX = minX + this.guageBg.width;
        return maxX;
    }

    private _isXMinLimit(x: number): boolean {
        const minX = this._getXMinLimit();
        return (x < minX);
    }

    private _isXMaxLimit(x: number): boolean {
        const maxX = this._getXMaxLimit();
        return (x > maxX);
    }

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

    private _updateGuageSize(): void {
        if (this.isMasterVolumeMute()) {
            return;
        }
        this.guage.setSize(this.config.guage.size.w * this.soundVolume, this.config.guage.size.h);
    }

    private _updateGuageColor(): void {
        if (this.isMasterVolumeMute()) {
            this.guage.setFillStyle(this.config.guage.color.disabled);
        }
        else {
            this.guage.setFillStyle(this.config.guage.color.normal);
        }
    }

    private _updateHandlePos(): void {
        if (this.isMasterVolumeMute()) {
            return;
        }

        this.handle.setPosition(this.config.guage.pos.x + this.config.guage.size.w * this.soundVolume, this.config.guage.pos.y);
    }

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

    private _updateIcon(): void {
        if (this.isMasterVolumeMute()) {
            this.icon.setFrame(this.config.icon.frame.mute);
        }
        else {
            this.icon.setFrame(this.config.icon.frame.volume);
        }
    }
}
