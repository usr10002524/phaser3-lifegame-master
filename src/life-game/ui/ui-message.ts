import { Control } from "../control";
import { Consts } from "../../consts";
import { uiString, uiStringConfig } from "./ui-string";
import { Localizable } from "../../common/localizable";

/**
 * メッセージUIクラス
 */
export class uiMessage extends uiString {

    private control: Control;
    private localizable: Localizable;
    private mouseOverButton: number;
    private noMessageTimer: Phaser.Time.TimerEvent;
    private timerConfig: Phaser.Types.Time.TimerEventConfig;

    /**
     * コンストラクタ
     * @param scene シーン
     * @param control コントローラ
     * @param localizable ローカライズ
     * @param config コンフィグ
     */
    constructor(scene: Phaser.Scene, control: Control, localizable: Localizable, config: uiStringConfig) {
        super(scene, config);
        this.control = control;
        this.localizable = localizable;

        this.mouseOverButton = Consts.Button.Type.NONE;

        this.timerConfig = {
            delay: 5000,
        }

        this.noMessageTimer = scene.time.addEvent(this.timerConfig);
        // this.noMessageTimer.paused = true;
    }

    /**
     * 更新処理
     */
    update(): void {

        this.mouseOverButton = this.control.getMouseOverButton();
        this._updateMessage();
    }

    /**
     * メッセージ更新処理
     */
    private _updateMessage(): void {
        let message: string = "";

        //なにかのボタンに乗っていればタイマーを止める
        if (this.mouseOverButton !== Consts.Button.Type.NONE) {
            this.noMessageTimer.paused = true;
        }

        switch (this.mouseOverButton) {
            case Consts.Button.Type.EDIT:
                message = this.localizable.get(Consts.Assets.Localizable.Sentence.EDIT);    //"パネルに生命を配置します";
                break;

            case Consts.Button.Type.ERASE:
                message = this.localizable.get(Consts.Assets.Localizable.Sentence.ERASE);    //"パネルから生命を消去します";
                break;

            case Consts.Button.Type.PLAY:
                message = this.localizable.get(Consts.Assets.Localizable.Sentence.PLAY);    //"生命の行く末を見守ります";
                break;

            case Consts.Button.Type.PAUSE:
                message = this.localizable.get(Consts.Assets.Localizable.Sentence.PAUSE);    //"時を止めます";
                break;

            case Consts.Button.Type.CLEAR:
                message = this.localizable.get(Consts.Assets.Localizable.Sentence.CLEAR);    //"すべてをやり直します";
                break;

            case Consts.Button.Type.SPEEDUP:
                message = this.localizable.get(Consts.Assets.Localizable.Sentence.SPEEDUP);    //"時の流れを速くします";
                break;

            case Consts.Button.Type.SPEEDDWON:
                message = this.localizable.get(Consts.Assets.Localizable.Sentence.SPEEDDOWN);    //"時の流れを緩やかにします";
                break;

            case Consts.Button.Type.RETURN:
                message = this.localizable.get(Consts.Assets.Localizable.Sentence.RETURN);    //"タイトル画面に戻ります";
                break;

            case Consts.Button.Type.SAVE:
                message = this.localizable.get(Consts.Assets.Localizable.Sentence.SAVE);    //"現在の状態を保存します";
                break;

            case Consts.Button.Type.SCREENSHOT:
                message = this.localizable.get(Consts.Assets.Localizable.Sentence.SCREENSHOT);    //"スクリーンショットを投稿します";
                break;

            // マウスオーバー以外の処理
            default: {
                // 一定時間ごとにメッセージを切り替え
                if (this.noMessageTimer.paused) {
                    this.noMessageTimer.remove();
                    this.noMessageTimer = this.scene.time.addEvent(this.timerConfig);
                }
                else {
                    if (this.noMessageTimer.getRemaining() === 0) {
                        if (this.control.getPlayBack() === Consts.Control.PlayBack.STOP) {
                            const aliveCount = this.control.getAliveCellCount();
                            if (aliveCount < 10) {
                                message = this.localizable.get(Consts.Assets.Localizable.Sentence.LETSPUT);    //"下のパネルに生命を配置してみましょう";
                            }
                            else {
                                message = this.localizable.get(Consts.Assets.Localizable.Sentence.LETSPLAY);    //"▶ボタンで時を進め、生命の行く末を見守りましょう"
                            }
                        }
                        else {
                            message = this.localizable.get(Consts.Assets.Localizable.Sentence.LETSWATCH);    //"生命の行く末を見守りましょう"
                        }
                    }
                }
                break;
            }
        }

        this.setText(message);
    }
}