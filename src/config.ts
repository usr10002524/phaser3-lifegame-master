import { Consts } from "./consts";
import { SceneLoading } from "./scene/scene-loading";
import { SceneTitle } from "./scene/scene-title";
import { SceneMain } from "./scene/scene-main";
// import { SceneGameClear } from "./scene/scene-gameclear";
// import { SceneGameOver } from "./scene/scene-gameover";
// import { SceneSoundTest } from "./scene/scene-soundtest";

export const GameConfig: Phaser.Types.Core.GameConfig = {
    // タイトル
    title: 'LifeGame',
    // バージョン
    version: Consts.VERSION,
    // レンダラーは自動設定
    type: Phaser.AUTO,
    // ウィンドウの幅
    width: Consts.Screen.WIDTH,
    // ウィンドウの高さ
    height: Consts.Screen.HEIGHT,
    // 物理シミュレーション設定（使用していないのでデフォルト）
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true
        }
    },
    // スクリーンのスケール設定
    scale: {
        mode: Phaser.Scale.ScaleModes.FIT,  // ウィンドウに追従
        autoCenter: Phaser.Scale.Center.CENTER_BOTH,    // 縦横合わせる
        // 最大はウィンドウサイズに合わせる
        max: {
            width: Consts.Screen.WIDTH,
            height: Consts.Screen.HEIGHT
        }
    },
    // 背景色
    backgroundColor: Consts.Screen.BGCOLOR,
    // サウンド
    audio: {
        disableWebAudio: true,  // html5 audio を使用する
    },
    // 使用するシーン
    scene: [SceneLoading, SceneTitle, SceneMain],
};

// export const TextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
//     font: "18px Arial",
//     color: "#0AD"
// };
