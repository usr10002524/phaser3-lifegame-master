/**
 * コンフィグ
 */
export type uiStringConfig = {
    x: number;  // X座標
    y: number;  // Y座標
    w: number;  // 幅（未使用）
    h: number;  // 高さ（未使用）
    font: string;   // フォント
    text: string;   // 表示する文字列
    textColor: number;  // 色
    origin_x: number;   // 中心座標(0-1)
    origin_y: number;   // 中心座標(0-1)
    depth: number;  // 表示順
}

/**
 * 文字列UIクラス
 */
export class uiString {
    protected scene: Phaser.Scene;
    protected config: uiStringConfig;
    protected text: Phaser.GameObjects.Text;

    /**
     * コンストラクタ
     * @param scene シーン
     * @param config コンフィグ
     */
    constructor(scene: Phaser.Scene, config: uiStringConfig) {
        this.scene = scene;
        this.config = config;

        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            font: this.config.font,
            color: this._toColorCodeString(config.textColor),
        };
        this.text = scene.add.text(config.x, config.y, config.text, textStyle);
        this.text.setOrigin(config.origin_x, config.origin_y);
        this.text.setDepth(config.depth);
    }

    /**
     * 更新処理
     */
    update() {

    }

    /**
     * 文字列を設定する
     * @param text 表示する文字列
     */
    setText(text: string): void {
        this.text.setText(text);
    }

    // カラーコード(#rrggbb)に変換する
    protected _toColorCodeString(color: number): string {
        const colorCode = "#" + color.toString(16);
        return colorCode;
    }
}