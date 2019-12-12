interface Observer<Target, Options> {
    observe(target: Target, options?: Options): void;
    unobserve?(target: Target): void;
}
interface ObserverEntry<Target> {
    target: Target;
}
declare type ObserverCallback<Target, Entry extends ObserverEntry<Target>> = (entries: Entry[]) => void;
declare type TargetListener<Target, Entry extends ObserverEntry<Target>> = (entry: Entry) => void;
interface ObserveCallback<Target, Options, Entry extends ObserverEntry<Target>, Listener extends TargetListener<Target, Entry>> {
    (target: Target, listener: Listener): UnobserveCallback;
    (target: Target, options: Options, listener: Listener): UnobserveCallback;
}
declare type UnobserveCallback = () => void;
declare const InsularObserver: <Target extends object, Options, Entry extends ObserverEntry<Target>, Listener extends TargetListener<Target, Entry>>(ObserverConstructor: new (callback: ObserverCallback<Target, Entry>, options?: Options | undefined) => Observer<Target, Options>, options?: Options | undefined) => ObserveCallback<Target, Options, Entry, Listener>;
export = InsularObserver;
//# sourceMappingURL=index.d.ts.map