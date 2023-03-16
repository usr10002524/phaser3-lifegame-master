type LocalizableItem = {
    key: string,
    value: string
};

type LocalizableData = {
    data: LocalizableItem[];
}

type Dict = {
    [key: string]: string;
};

export class Localizable {

    private dict: Dict;

    constructor() {
        this.dict = {};
    }

    public initialize(data: LocalizableData): void {

        data.data.forEach(element => {
            this.dict[element.key] = element.value;
        });
    }

    public get(key: string): string {
        if (this.dict.hasOwnProperty(key)) {
            return this.dict[key];
        }
        else {
            return "";
        }
    }

}