import React, {PropsWithChildren, useEffect} from "react";
import GetStats from "./services/GetStats.tsx";
import {Stat} from "./data/Stat.tsx";

class Cache {
    private statCaches: Stat[] = [];

    public getStatCache(name: string): Stat | undefined {
        return this.statCaches.find(cache => cache.name === name);
    }

    public getStatCaches(): Stat[] {
        return this.statCaches;
    }

    public setStatCaches(statCaches: Stat[]): void {
        this.statCaches = statCaches;
    }
}

export const CacheContext = React.createContext<
    [Cache, React.Dispatch<React.SetStateAction<Cache>>]
>([new Cache(), () => {}]);

export const CacheContextProvider: React.FC<PropsWithChildren<NonNullable<unknown>>> = (props) => {
    const [cache, setCache] = React.useState<Cache>(new Cache());

    useEffect(() => {
        fetchStatCaches().then();
    })

    return (
        <CacheContext.Provider value={[cache, setCache]}>
            {props.children}
        </CacheContext.Provider>
    );

    async function fetchStatCaches() {
        const json = await GetStats();
        if (json) {
            // setCache((prev) => {
            //     prev.setStatCaches(json);
            //     return prev;
            // })
            const newCache = new Cache();
            newCache.setStatCaches(json);
            setCache(newCache);
        }
    }
}
