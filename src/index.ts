function* generate<T>(list: Iterable<T>) {
  let i = 0;
  for(const item of list) {
    yield [i++, item] as [number, T];
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type ConcurrentOptions = {
  startTimeout: number,
  timeout: number
}

export const options: ConcurrentOptions = {
  startTimeout: 0,
  timeout: 0
}

export const concurrent = (concurrency: number, opts: Partial<ConcurrentOptions> = {}) => {
    
  const { startTimeout, timeout } = { ...options, ...opts };

  return async <T>(iterable: Iterable<T>, run: (item: T, i: number) => Promise<void>) => {

    const iter = generate(iterable);

    const next = async () => {
      const { value, done } = iter.next();
      if (done) {
        return;
      }

      // ts complaining about ! flag but value is never null
      const [i, item] = (value as [number, T]);
      
      await run(item, i);
      timeout && await sleep(timeout);
      await next();
    }

    const poll = [];
    for (let i = 0; i < concurrency; i++) {
      poll.push(new Promise(async resolve => {
        await sleep(i * startTimeout);
        await next();
        resolve();
      }))
    }

    await Promise.all(poll);

  }
}