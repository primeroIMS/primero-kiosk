import { del, get, set } from "idb-keyval";

const idbStorage = {
    getItem: async (name: string) => {
        const value = await get(name);
        return value ?? null;
    },
    removeItem: async (name: string) => {
        await del(name);
    },
    setItem: async (name: string, value: any) => {
        await set(name, value);
    },
};

export default idbStorage;
