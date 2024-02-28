export default TextMode;
declare class TextMode extends Mode {
    static id: string;
    getTemplateOptions(): any;
    getLabelOpts(): any;
    name: string;
    shortName: string;
}
import Mode from "./Mode";
