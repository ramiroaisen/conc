"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function* generate(list) {
    let i = 0;
    for (const item of list) {
        yield [i++, item];
    }
}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.options = {
    startTimeout: 0,
    timeout: 0
};
exports.concurrent = (concurrency, opts = {}) => {
    const { startTimeout, timeout } = { ...exports.options, ...opts };
    return async (iterable, run) => {
        const iter = generate(iterable);
        const next = async () => {
            const { value, done } = iter.next();
            if (done) {
                return;
            }
            // ts complaining about ! flag but value is never null
            const [i, item] = value;
            await run(item, i);
            timeout && await sleep(timeout);
            await next();
        };
        const poll = [];
        for (let i = 0; i < concurrency; i++) {
            poll.push(new Promise(async (resolve) => {
                await sleep(i * startTimeout);
                await next();
                resolve();
            }));
        }
        await Promise.all(poll);
    };
};
//# sourceMappingURL=index.js.map