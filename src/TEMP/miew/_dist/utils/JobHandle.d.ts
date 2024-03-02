export default class JobHandle extends EventDispatcher {
    _shouldCancel: boolean;
    cancel(): void;
    shouldCancel(): boolean;
    notify(event: any): void;
}
import EventDispatcher from "./EventDispatcher";
