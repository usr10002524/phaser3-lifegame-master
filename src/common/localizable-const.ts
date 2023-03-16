import { Consts } from "../consts";

export class LocalizableConst {
    public static GetLocalizableFile(type: number): string {
        switch (type) {
            case Consts.Localizable.ENGLISH: return Consts.Assets.Localizable.File.ENGLISH;
            case Consts.Localizable.JAPANEASE: return Consts.Assets.Localizable.File.JAPANEASE;
            default: return Consts.Assets.Localizable.File.ENGLISH;
        }
    }
}