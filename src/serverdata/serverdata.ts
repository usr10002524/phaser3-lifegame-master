/**
 * データ1つあたりのデータ
 */
export type ServerData = {
    key: string;
    value: string;
}

/**
 * 内部データ
 */
type innerSaverData = {
    value: string;
    dirty: boolean;
}

/**
 * サーバデータマネージャ
 */
export class ServerDataManager {

    private serverData: Map<string, innerSaverData>;

    /**
     * コンストラクタ
     */
    constructor() {
        this.serverData = new Map<string, innerSaverData>();
    }

    /**
     * 更新データをセットする
     * @param data 更新したいデータ
     */
    set(data: ServerData): void {

        if (this.serverData.has(data.key)) {
            const cur = this.serverData.get(data.key);
            if (cur?.value === data.value) {
                return; //同じデータなので保存の必要なし
            }
        }

        const innerData: innerSaverData = {
            value: data.value,
            dirty: true,
        };
        this.serverData.set(data.key, innerData);
    }

    /**
     * サーバデータを取得する
     * @param key 首都するデータのキー
     * @returns サーバデータ
     */
    get(key: string): string {
        const data = this.serverData.get(key);
        if (data) {
            return data.value;
        }
        else {
            return "";
        }
    }

    /**
     * キーが存在するかチェックする
     * @param key キー
     * @returns キーが存在する場合は true 、そうでない場合は
     */
    has(key: string): boolean {
        return this.serverData.has(key);
    }

    /**
     * 更新フラグの立っているデータを取得する
     * @returns サーバーデータの配列
     */
    getDirtyValues(): ServerData[] {
        let data: ServerData[] = [];

        this.serverData.forEach((value: innerSaverData, key: string) => {
            if (value.dirty) {
                data.push({ key: key, value: value.value });
            }
        })

        return data;
    }

    /**
     * 更新フラグをクリアする
     */
    clearDitry(): void {
        this.serverData.forEach((value: innerSaverData, key: string) => {
            value.dirty = false;
        })
    }
}