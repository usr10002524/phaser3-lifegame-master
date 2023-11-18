import { ServerDataManager } from "./serverdata/serverdata";

/**
 * グローバルで使用する変数
 */
export class Globals {

    //シングルトンで使用するインスタンス
    private static instance: Globals | null = null;

    //シングルトンのインスタンスを取得
    static get(): Globals {
        if (Globals.instance === null) {
            Globals.instance = new Globals();
        }
        return Globals.instance;
    }

    //--------------------------------------------
    // サーバデータ
    serverDataMan: ServerDataManager;
    // タイトルで「CONTINUE」を選んだかどうか
    continue: boolean;


    //外部からインスタンス化できないようにコンストラクタは private にする
    private constructor() {
        this.serverDataMan = new ServerDataManager();
        this.continue = false;

        this.reset();
    }

    reset(): void {
        this.continue = false;
    }


}