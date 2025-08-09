type Constructor<T = any> = new (...args: any[]) => T;
type AnyFunction<T = any> = (...args: any[]) => T;

class ArgsTrie<T> {
    private root = new Map<any, any>();

    get(args: any[]): T | undefined {
        let currentMap = this.root;
        for (const arg of args) {
            if (!currentMap.has(arg)) return undefined;
            currentMap = currentMap.get(arg);
        }
        return currentMap.get('__instance__');
    }

    set(args: any[], instance: T): void {
        let currentMap = this.root;
        for (const arg of args) {
            if (!currentMap.has(arg)) {
                currentMap.set(arg, new Map());
            }
            currentMap = currentMap.get(arg);
        }
        currentMap.set('__instance__', instance);
    }
}

export function singleton<T extends object>(
    target: Constructor<T>
): Constructor<T>;

export function singleton<T extends object>(
    target: AnyFunction<T>
): AnyFunction<T>;

export function singleton<T extends object>(
    target: Constructor<T> | AnyFunction<T>
): Constructor<T> | AnyFunction<T> {
    const argsTrie = new ArgsTrie<T>();

    return new Proxy(target, {
        construct(target: Constructor<T>, args: any[]): T {
            const cached = argsTrie.get(args);
            if (cached) return cached;
            const instance = Reflect.construct(target, args);
            argsTrie.set(args, instance);
            return instance;
        },

        apply(target: AnyFunction<T>, thisArg: any, args: any[]): T {
            const cached = argsTrie.get(args);
            if (cached) return cached;
            const instance = target.apply(thisArg, args);
            argsTrie.set(args, instance);
            return instance;
        },

        get(target, prop, receiver) {
            return Reflect.get(target, prop, receiver);
        }
    });
}
