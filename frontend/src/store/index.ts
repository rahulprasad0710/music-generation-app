const storeResetFns = new Set<() => void>();

export const registerReset = (fn: () => void) => storeResetFns.add(fn);

export const resetAllStores = () => {
    storeResetFns.forEach((reset) => reset());
};
