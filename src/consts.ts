import { Localizable } from "./common/localizable";

/**
 * 各種定数
 */
export const Consts = {
    //version
    VERSION: "202311222222",

    //画面サイズ
    Screen: {
        WIDTH: 800,
        HEIGHT: 600,
        BGCOLOR: 0xE0E0E0,
    },

    //ライフゲーム
    LifeGame: {
        Position: {
            X: 80,
            Y: 67,
        },

        // ワールドのサイズ
        Size: {
            // 小
            Small: {
                W: 512, // 横幅
                H: 512, // 縦幅
                ROW: 16,    // 縦のマス数
                COL: 16,    // 横のマス数
            },
            // 中
            Middle: {
                W: 512, // 横幅
                H: 512, // 縦幅
                ROW: 32,    // 縦のマス数
                COL: 32,    // 横のマス数
            },
            // 大
            Large: {
                W: 512, // 横幅
                H: 512, // 縦幅
                ROW: 64,    // 縦のマス数
                COL: 64,    // 横のマス数
            },
        },

        //セル関連
        Cell: {
            //セルの状態
            Stat: {
                NONE: 0,     //未定義
                ALIVE: 1,    //生存
                DEAD: 2,     //死亡
            },
            //セルの色関連
            Color: {
                ON: 0x00FF7F,       //セルが生存時の色
                OFF: 0x000080,      //セルが死亡時の色
                DURATION: 80,       //色変更時の所要時間
            },
        },
    },

    //制御用定義
    Control: {
        //再生状態
        PlayBack: {
            STOP: 0,
            PLAY: 1,
        },
        //編集モード
        EditMode: {
            NONE: 0,
            EDIT: 1,
            ERASE: 2,
        },
        //進行速度
        Speed: {
            MIN: 1, //SLOW
            MAX: 5, //FAST
            DEFAULT: 2,
        },
    },

    Button: {
        //ボタンの種別
        Type: {
            NONE: 0,
            EDIT: 1,
            ERASE: 2,
            PLAY: 3,
            PAUSE: 4,
            CLEAR: 5,
            SPEEDUP: 6,
            SPEEDDWON: 7,
            RETURN: 8,
            SAVE: 9,
            SCREENSHOT: 10,
        },

        //ボタン状態
        Stat: {
            NONE: 0,
            OFF: 1,
            ON: 2,
            OVER: 3,
            GRAY: 4,
        },

        //アイコン 1 x N のときのボタン配置
        Position_1: {
            ORIG_X: 732,
            ORIG_Y: 90,
            PAD_X: 0,
            PAD_Y: 10,
            W: 50,
            H: 50,
        },

        //パネルの色
        Color: {
            ON: 0x00FF7F,
            OFF: 0x0000FF,
            OVER: 0x0000FF,
            GRAY: 0x808080,
        },

        //描画優先度
        Depth: {
            PANEL: 1,
            ICON: 2,
        },
    },

    //背景
    Base: {
        DEPTH: 0,
    },

    //パネル
    Panel: {
        DEPTH: 1,
    },

    //グリッド
    Grid: {
        LINE_WIDTH: 1,
        COLOR: 0xFFFFFF,
        DEPTH: 2,
    },

    //モード表示
    Mode: {
        Position: {
            X: 68,
            Y: 41,
        },
        Size: {
            W: 126,
            H: 18,
        },
        Panel: {
            DEPTH: 1
        },
        Text: {
            DEPTH: 2
        },
    },

    //メッセージ表示
    Message: {
        Position: {
            X: 133,
            Y: 41,
        },
        Size: {
            W: 662,
            H: 18,
        },
        Origin: {
            X: 0,
            Y: 0.5,
        },
        DEPTH: 1,
    },

    //タイトル表示
    Title: {
        Position: {
            X: 400,
            Y: 18,
        },
        Size: {
            W: 790,
            H: 24,
        },
        Origin: {
            X: 0.5,
            Y: 0.5,
        },
        DEPTH: 1,
    },

    //スピード表示
    Speed: {
        Position: {
            x: 706,
            y: 41,
        },
        Padding: {
            x: 12,
        },
        SCALE: 1.0,
        DEPTH: 2,
    },

    //ボリューム表示
    SoundVolume: {
        Base: {
            Pos: {
                X: 732,
                Y: 560,
            },
        },
        Icon: {
            Pos: {
                X: -40,
                Y: 0,
            },
            Scale: {
                X: 0.6,
                Y: 0.6,
            },
            DEPTH: 2,
        },
        Handle: {
            Size: {
                W: 10,
                H: 25,
            },
            Color: {
                NORMAL: 0xF0F0F0,
                DISABLED: 0x808080,
                GRABED: 0xA0A0A0,
            },
            DEPTH: 4,
        },
        Guage: {
            Pos: {
                X: -24,
                Y: 0,
            },
            Size: {
                W: 72,
                H: 10,
            },
            Color: {
                NORMAL: 0xFFFFFF,
                DISABLED: 0x808080,
            },
            DEPTH: 3,
        },
        GuageBg: {
            COLOR: 0x000000,
            DEPTH: 2,
        },
        Panel: {
            Pos: {
                X: -58,
                Y: 0,
            },
            Size: {
                W: 116,
                H: 40,
            },
            COLOR: 0x404040,
            ALPHA: 0.5,
            DEPTH: 1,
        },
    },


    //アツマール用
    Atsumaru: {
        Data: {
            KEY: "cells",
        },
        CommStat: {
            NONE: 0,    //通信していない
            DURING: 1,  //通信中
            SUCCESS: 2, //成功
            FAIL: 3,     //失敗
        },
    },

    // 言語
    Localizable: {
        ENGLISH: 1,
        JAPANEASE: 2,
    },


    //アセット定義
    Assets: {
        //ベースディレクトリ
        BasePath: "assets/",

        //画像
        Graphic: {
            //背景
            Base: {
                FILE: "image/base.png",
                NAME: "base",
            },

            //タイトル
            Title: {
                FILE: "image/title.png",
                NAME: "title",
            },
            //スタート
            Start: {
                FILE: "image/start.png",
                NAME: "start",
            },

            //タイトル画面
            Titles: {
                Atlas: {
                    NAME: "titles",
                    FILE: "image/titles.png",
                    ATLAS: "image/titles_atlas.json",
                },

                Title: "title",
                Start: "start",
                Continue: {
                    OK: "continue",
                    NG: "continue_g",
                },
            },

            //アイコン
            Icon: {
                Atlas: {
                    NAME: "icons",
                    FILE: "image/icons.png",
                    ATLAS: "image/icons_atlas.json",
                },

                Edit: {
                    ON: "edit_w",
                    OFF: "edit_w",
                    GRAY: "edit_w",
                },
                Erase: {
                    ON: "erase_w",
                    OFF: "erase_w",
                    GRAY: "erase_w",
                },
                Play: {
                    ON: "play_w",
                    OFF: "play_w",
                    GRAY: "play_w",
                },
                Pause: {
                    ON: "pause_w",
                    OFF: "pause_w",
                    GRAY: "pause_w",
                },
                Clear: {
                    ON: "clear_w",
                    OFF: "clear_w",
                    GRAY: "clear_w",
                },
                SpeedUp: {
                    ON: "speedup_w",
                    OFF: "speedup_w",
                    GRAY: "speedup_w",
                },
                SpeedDown: {
                    ON: "speeddown_w",
                    OFF: "speeddown_w",
                    GRAY: "speeddown_w",
                },
                Return: {
                    ON: "return_w",
                    OFF: "return_w",
                    GRAY: "return_w",
                },
                Speed: {
                    ON: "play_on_18",
                    OFF: "",
                    GRAY: "play_g_18",
                },
                Save: {
                    ON: "save_w",
                    OFF: "save_w",
                    GRAY: "save_w",
                },
                ScreenShot: {
                    ON: "screenshot_w",
                    OFF: "screenshot_w",
                    GRAY: "screenshot_w",
                },
            },

            // サウンドボリューム
            SoundIcons: {
                Atlas: {
                    NAME: "sound_icons",
                    FILE: "image/sound_icons.png",
                    ATLAS: "image/sound_icons_atlas.json",
                },

                Volume: {
                    ON: "sound_w",
                    OFF: "sound_w",
                    GRAY: "sound_g",
                },
                Mute: {
                    ON: "mute_w",
                    OFF: "mute_w",
                    GRAY: "mute_g",
                },
            },

            PipeLine: {
                Blur: {
                    NAME: "blur",
                }
            },
        },

        //サウンド
        Audio: {
            // ニコニコ
            // SE: {
            //     NAME: "se",
            //     JSON: "audio/se/se.json",
            //     MP3: "audio/se/se.mp3",
            //     OGG: "audio/se/se.ogg",

            //     START: "start",
            //     SELECT: "over",
            //     DECIDE: "on",
            // },

            // ニコニコ以外
            SE: {
                NAME: "se",
                JSON: "audio/se2/se.json",
                MP3: "audio/se2/se.mp3",
                OGG: "audio/se2/se.ogg",

                START: "se_01_13",
                SELECT: "se_01_12",
                DECIDE: "se_01_26",
            },

            //BGM
            BGM: {
                NAME: "bgm",
                MP3: "audio/bgm/bgm.mp3",
                OGG: "audio/bgm/bgm.ogg",
            }
        },

        //言語
        Localizable: {
            KEY: "localizable",
            File: {
                ENGLISH: "lang/lang-en.json",
                JAPANEASE: "lang/lang-jp.json",
                DEFAULT: "lang/lang-en.json",
            },

            Sentence: {
                EDIT: "edit",
                ERASE: "erase",
                PLAY: "play",
                PAUSE: "pause",
                CLEAR: "clear",
                SPEEDUP: "speedup",
                SPEEDDOWN: "speeddown",
                RETURN: "return",
                SAVE: "save",
                SCREENSHOT: "screenshot",
                LETSPUT: "letsput",
                LETSPLAY: "letsplay",
                LETSWATCH: "letswatch",
                EDITMODE: "editmode",
                PLAYMODE: "playmode",
            },
        },
    },
}
