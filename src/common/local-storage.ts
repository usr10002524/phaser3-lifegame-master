import { Consts } from "../consts";

export type LocalStorageItem = {
    key: string;
    value: string;
};


export class LocalStorage {

    public static loadLocalData(fn: (result: number, data: LocalStorageItem[]) => void): void {

        this.getItems()
            .then(resp => {
                fn(Consts.Atsumaru.CommStat.SUCCESS, resp);
            })
            .catch(e => {
                fn(Consts.Atsumaru.CommStat.FAIL, []);
            });
    }

    public static saveLocalData(data: LocalStorageItem[], fn: (result: number) => void): void {

        this.setItems(data)
            .then(() => {
                fn(Consts.Atsumaru.CommStat.SUCCESS);
            })
            .catch(e => {
                fn(Consts.Atsumaru.CommStat.FAIL);
            });
    }

    public static deleteLocalData(key: string, fn: (result: number) => void): void {

        this.deleteItem(key)
            .then(() => {
                fn(Consts.Atsumaru.CommStat.SUCCESS);
            })
            .catch(e => {
                fn(Consts.Atsumaru.CommStat.FAIL);
            });
    }

    private static async getItems(): Promise<LocalStorageItem[]> {

        try {
            let result: LocalStorageItem[] = [];

            const keyCount = localStorage.length;
            for (let i = 0; i < keyCount; i++) {
                const key = localStorage.key(i);
                if (key == null) {
                    continue;
                }
                const value = localStorage.getItem(key);
                if (value == null) {
                    continue;
                }
                result.push({ key: key, value: value });
            }

            return result;
        }
        catch (e) {
            throw e;
        }
    }

    private static async setItems(data: LocalStorageItem[]): Promise<void> {
        try {
            data.forEach(element => {
                localStorage.setItem(element.key, element.value);
            });

            return;
        }
        catch (e) {
            throw e;
        }
    }

    private static async deleteItem(key: string): Promise<void> {
        try {
            localStorage.removeItem(key);
            return;
        }
        catch (e) {
            throw e;
        }
    }
}