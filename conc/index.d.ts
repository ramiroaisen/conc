export declare type ConcurrentOptions = {
    startTimeout: number;
    timeout: number;
};
export declare const options: ConcurrentOptions;
export declare const concurrent: (concurrency: number, opts?: Partial<ConcurrentOptions>) => <T>(iterable: Iterable<T>, run: (item: T, i: number) => Promise<void>) => Promise<void>;
//# sourceMappingURL=index.d.ts.map