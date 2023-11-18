import "phaser";
import { GameConfig } from "./config"

window.addEventListener("load", () => {
    // タイトル + バージョンを起動時にログに出力
    let text = "";
    if (GameConfig.title) {
        text += GameConfig.title;
    }
    text += ":";
    if (GameConfig.version) {
        text += GameConfig.version;
    }

    console.log(text);

    // ゲームを起動する
    var game: Phaser.Game = new Phaser.Game(GameConfig);
});

