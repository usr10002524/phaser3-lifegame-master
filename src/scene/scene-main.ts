import { LifeGame, LifeGameConfig } from "../life-game/life-game";
import { Control } from "../life-game/control";
import { Consts } from "../consts";
import { uiButtonManager } from "../life-game/ui/button/ui-button-manager";
import { uiGrid, uiGridConfig } from "../life-game/ui/ui-grid";
import { uiMode, uiModeConfig } from "../life-game/ui/ui-mode";
import { uiString, uiStringConfig } from "../life-game/ui/ui-string";
import { uiMessage } from "../life-game/ui/ui-message";
import { uiSpeed, uiSpeedConfig } from "../life-game/ui/ui-speed";
import { atsumaru_getVolume, atsumaru_isValid, atsumaru_onChangeVolume, atsumaru_saveServerData, atsumaru_setScreenshoScene } from "../atsumaru/atsumaru";
import { Globals } from "../globals";
import { SoundVolume, SoundVolumeConfig } from "../common/sound-volume";
import { LocalStorage } from "../common/local-storage";
import { Localizable } from "../common/localizable";

/**
 * メインシーン
 */
export class SceneMain extends Phaser.Scene {

    // コアとUIのつなぎ
    private control: Control | null;
    // ライフゲームコア
    private lifeGame: LifeGame | null;

    // UI関連
    private ui: uiButtonManager | null;
    private uiGrid: uiGrid | null;
    private uiMode: uiMode | null;
    private uiMessage: uiMessage | null;
    private uiBackGround: Phaser.GameObjects.Image | null;
    private uiTitle: uiString | null;
    private uiSpeed: uiSpeed | null;
    // サウンド関連
    private bgm: Phaser.Sound.BaseSound | null;
    // サーバデータ
    private atsumaruSaveResult: number;
    // サウンドボリューム
    private soundVolume: SoundVolume | null;
    // ローカライズ
    private localizable: Localizable | null;

    /**
     * コンストラクタ
     */
    constructor() {
        super({ key: "Main" });

        this.control = null;
        this.lifeGame = null;
        this.ui = null;
        this.uiGrid = null;
        this.uiMode = null;
        this.uiMessage = null;
        this.uiTitle = null;
        this.uiSpeed = null;
        this.uiBackGround = null;
        this.bgm = null;

        this.soundVolume = null;
        this.localizable = null;

        this.atsumaruSaveResult = Consts.Atsumaru.CommStat.NONE;
    }

    preload() {
    }

    /**
     * 初期化
     */
    create() {
        // 背景色設定
        this.cameras.main.setBackgroundColor(0x101010);

        // 各種初期化
        this._setupLocalizable();
        this._createControl();
        this._createUI();
        this._createUIBackGround();
        this._createLifeGame();
        this._createGrid();
        this._createUIMode();
        this._createUIMessage();
        this._createUITitle();
        this._createUISpeed();
        this._createSound();

        //スクリーンショット撮影のシーン登録
        atsumaru_setScreenshoScene(this);
    }

    /**
     * 更新処理
     */
    update(): void {

        // 各種更新処理
        this.control?.update();
        this.lifeGame?.update();
        this.ui?.update();
        this.uiMode?.update();
        this.uiMessage?.update();
        this.uiSpeed?.update();

        // タイトルに戻る指示が来ていれば、BGMを止めてタイトルシーンに戻る
        if (this.control?.isReturnTitle()) {
            this.bgm?.stop();
            this.scene.start("Title");
        }

        // データ保存指示がきていれば、データの保存を行う
        if (this.control?.isDataSave()) {
            //保存ボタンが押された
            if (this.lifeGame) {
                const text = this.lifeGame.toString();
                Globals.get().serverDataMan.set({ key: Consts.Atsumaru.Data.KEY, value: text });
            }
            this._saveData();
        }
    }


    /**
     * ローカライズの初期化
     */
    private _setupLocalizable(): void {
        const localizableData = this.cache.json.get(Consts.Assets.Localizable.KEY);
        this.localizable = new Localizable();
        this.localizable.initialize(localizableData);
    }

    /**
     * 制御クラスの初期化
     */
    private _createControl(): void {
        this.control = new Control(this);
    }

    /**
     * ライフゲームのコアを初期化
     */
    private _createLifeGame(): void {
        //復帰用データが有るか確認
        let restoreData: string = "";
        let restored: boolean = false;
        if (Globals.get().continue) {
            // タイトルでContinueが選択されていればロードしたデータを使用する
            restoreData = Globals.get().serverDataMan.get(Consts.Atsumaru.Data.KEY)
            restored = (restoreData.length > 0);
        }

        // コアの初期化を行う
        const config: LifeGameConfig = {
            x: Consts.LifeGame.Position.X,
            y: Consts.LifeGame.Position.Y,
            w: Consts.LifeGame.Size.Middle.W,
            h: Consts.LifeGame.Size.Middle.H,
            core: {
                rows: Consts.LifeGame.Size.Middle.ROW,
                cols: Consts.LifeGame.Size.Middle.COL,
                loopEnable: true,
            },
            speed: Consts.Control.Speed.DEFAULT,
            use_mask: true,
            use_blur: false,
            blur_name: "",
            restored: restored,
            restoreData: restoreData,
        }
        if (this.control !== null) {
            this.lifeGame = new LifeGame(this, this.control, config);
        }
    }

    // ボタンUIを作成
    private _createUI(): void {
        if (this.control !== null) {
            this.ui = new uiButtonManager(this, this.control);
        }
    }

    // グリッドを作成
    private _createGrid(): void {

        const cell_w = Consts.LifeGame.Size.Middle.W / Consts.LifeGame.Size.Middle.ROW;
        const cell_h = Consts.LifeGame.Size.Middle.H / Consts.LifeGame.Size.Middle.COL;
        const config: uiGridConfig = {
            x: Consts.LifeGame.Position.X,
            y: Consts.LifeGame.Position.Y,
            w: Consts.LifeGame.Size.Middle.W,
            h: Consts.LifeGame.Size.Middle.H,
            cell_w: cell_w,
            cell_h: cell_h,
            lineWidth: Consts.Grid.LINE_WIDTH,
            color: Consts.Grid.COLOR,
        };

        this.uiGrid = new uiGrid(this, config);
    }

    // モード選択UIを作成
    private _createUIMode(): void {
        if (this.localizable == null) {
            return;
        }
        const editMode = this.localizable.get(Consts.Assets.Localizable.Sentence.EDITMODE);
        const playMode = this.localizable.get(Consts.Assets.Localizable.Sentence.PLAYMODE);

        const config: uiModeConfig = {
            x: Consts.Mode.Position.X,   //center pos
            y: Consts.Mode.Position.Y,    //center pos
            w: Consts.Mode.Size.W,
            h: Consts.Mode.Size.H,
            editModeColor: Consts.LifeGame.Cell.Color.OFF,
            editModeText: editMode,
            editModeTextColor: Consts.LifeGame.Cell.Color.ON,
            showModeColor: Consts.LifeGame.Cell.Color.ON,
            showModeText: playMode,
            showModeTextColor: Consts.LifeGame.Cell.Color.OFF,
        };
        if (this.control !== null) {
            this.uiMode = new uiMode(this, this.control, config);
        }
    }

    // メッセージ部分のUIを作成
    private _createUIMessage(): void {
        const config: uiStringConfig = {
            x: Consts.Message.Position.X,
            y: Consts.Message.Position.Y,  //center ops
            w: Consts.Message.Size.W,
            h: Consts.Message.Size.H,
            origin_x: Consts.Message.Origin.X,
            origin_y: Consts.Message.Origin.Y,
            font: "18px Arial",
            depth: Consts.Message.DEPTH,
            text: "",
            textColor: 0xFFFFFF,
        };
        if (this.control !== null
            && this.localizable !== null) {
            this.uiMessage = new uiMessage(this, this.control, this.localizable, config);
        }
    }

    // タイトル部分のUIを作成
    private _createUITitle(): void {
        const config: uiStringConfig = {
            x: Consts.Title.Position.X, //center pos
            y: Consts.Title.Position.Y,  //center ops
            w: Consts.Title.Size.W,
            h: Consts.Title.Size.H,
            origin_x: Consts.Title.Origin.X,
            origin_y: Consts.Title.Origin.Y,
            font: "22px Arial",
            depth: Consts.Title.DEPTH,
            text: "=== LIFE GAME ===",
            textColor: Consts.LifeGame.Cell.Color.ON,
        };
        this.uiTitle = new uiString(this, config);
    }

    // 進行速度変更のUIを作成
    private _createUISpeed(): void {
        const config: uiSpeedConfig = {
            x: Consts.Speed.Position.x,
            y: Consts.Speed.Position.y,
            pad_x: Consts.Speed.Padding.x,
            depth: Consts.Speed.DEPTH,
            scale: Consts.Speed.SCALE,
            count: Consts.Control.Speed.MAX - Consts.Control.Speed.MIN + 1,
            atlas: Consts.Assets.Graphic.Icon.Atlas.NAME,
            onIcon: Consts.Assets.Graphic.Icon.Speed.ON,
            disableIcon: Consts.Assets.Graphic.Icon.Speed.GRAY,
        }

        if (this.control !== null) {
            this.uiSpeed = new uiSpeed(this, this.control, config);
        }
    }

    // 背景を作成
    private _createUIBackGround(): void {
        this.uiBackGround = this.add.image(0, 0, Consts.Assets.Graphic.Base.NAME);
        this.uiBackGround.setOrigin(0, 0);
        this.uiBackGround.setDepth(Consts.Base.DEPTH);
    }

    // サウンドを初期化
    private _createSound(): void {
        this.bgm = this.sound.add(Consts.Assets.Audio.BGM.NAME);
        this.bgm.play({ loop: true });

        if (atsumaru_isValid()) {
            //現在のボリュームを取得し設定
            const volume = atsumaru_getVolume();
            if (volume) {
                this.sound.volume = volume;
            }
            //ボリュームが変わったときのコールバックを設定
            atsumaru_onChangeVolume((volume: number) => {
                this.sound.volume = volume;
                // console.log("_onChangeVolume volume:" + volume);
            });
        }
        else {
            // AtsumaruAPIが使用できない場合は、サウンドボリューム変更UIを作成
            this._createSoundVolume();
        }
    }

    // サウンドボリューム変更UIを作成
    private _createSoundVolume(): void {
        const config: SoundVolumeConfig = {
            pos: {
                x: Consts.SoundVolume.Base.Pos.X,
                y: Consts.SoundVolume.Base.Pos.Y,
            },

            icon: {
                atlas: Consts.Assets.Graphic.SoundIcons.Atlas.NAME,
                frame: {
                    volume: Consts.Assets.Graphic.SoundIcons.Volume.ON,
                    mute: Consts.Assets.Graphic.SoundIcons.Mute.ON,
                },
                pos: {
                    x: Consts.SoundVolume.Icon.Pos.X,
                    y: Consts.SoundVolume.Icon.Pos.Y,
                },
                scale: {
                    x: Consts.SoundVolume.Icon.Scale.X,
                    y: Consts.SoundVolume.Icon.Scale.Y,
                },
            },

            guage: {
                pos: {
                    x: Consts.SoundVolume.Guage.Pos.X,
                    y: Consts.SoundVolume.Guage.Pos.Y,
                },
                size: {
                    w: Consts.SoundVolume.Guage.Size.W,
                    h: Consts.SoundVolume.Guage.Size.H,
                },
                color: {
                    normal: Consts.SoundVolume.Guage.Color.NORMAL,
                    disabled: Consts.SoundVolume.Guage.Color.DISABLED,
                    bg: Consts.SoundVolume.GuageBg.COLOR,
                }
            },

            handle: {
                size: {
                    w: Consts.SoundVolume.Handle.Size.W,
                    h: Consts.SoundVolume.Handle.Size.H,
                },
                color: {
                    normal: Consts.SoundVolume.Handle.Color.NORMAL,
                    disabled: Consts.SoundVolume.Handle.Color.DISABLED,
                    grabed: Consts.SoundVolume.Handle.Color.GRABED,
                }
            },

            panel: {
                pos: {
                    x: Consts.SoundVolume.Panel.Pos.X,
                    y: Consts.SoundVolume.Panel.Pos.Y,
                },
                size: {
                    w: Consts.SoundVolume.Panel.Size.W,
                    h: Consts.SoundVolume.Panel.Size.H,
                },
                color: {
                    normal: Consts.SoundVolume.Panel.COLOR,
                },
                alpha: {
                    normal: Consts.SoundVolume.Panel.ALPHA,
                },
            },
        }
        this.soundVolume = new SoundVolume(this, config);
    }

    // データの保存を行う
    private _saveData(): void {
        this.atsumaruSaveResult = Consts.Atsumaru.CommStat.NONE;
        if (this.lifeGame) {

            // 保存データ作成
            // 更新のあったデータを取得
            const saveData = Globals.get().serverDataMan.getDirtyValues();
            if (saveData.length > 0) {
                if (atsumaru_isValid()) {
                    atsumaru_saveServerData(saveData, (result: number) => {
                        this.atsumaruSaveResult = result;
                        console.log("Atsumaru ServerDataSave result:" + result);
                    });
                }
                else {
                    LocalStorage.saveLocalData(saveData, (result: number) => {
                        this.atsumaruSaveResult = result;
                        console.log("saveLocalData result:" + result);
                    });
                }
            }
            Globals.get().serverDataMan.clearDitry();
        }
    }
}