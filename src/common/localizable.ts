
/**
 * 文字列変換アイテム１つあたりのデータ
 */
type LocalizableItem = {
    key: string,
    value: string
};

/**
 * 文字列変換アイテムをまとめたもの
 */
type LocalizableData = {
    data: LocalizableItem[];
}

/**
 * 変換辞書
 */
type Dict = {
    [key: string]: string;
};

/**
 * 多言語対応クラス
 */
export class Localizable {

    private dict: Dict; // 変換辞書

    /**
     * コンストラクタ
     */
    constructor() {
        this.dict = {};
    }

    /**
     * 初期化を行う
     * @param data 文字列変換データ
     */
    public initialize(data: LocalizableData): void {

        data.data.forEach(element => {
            this.dict[element.key] = element.value;
        });
    }

    /**
     * キーから、設定された言語の文字列を取得する
     * @param key 文字列を取得するためのキー
     * @returns きーたに対応した文字列を返す
     */
    public get(key: string): string {
        if (this.dict.hasOwnProperty(key)) {
            return this.dict[key];
        }
        else {
            return "";
        }
    }

}