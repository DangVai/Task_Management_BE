import { instanceToPlain } from 'class-transformer';

export function excludePassword<T extends Record<string, any>>(obj: T): T {
    const plain = instanceToPlain(obj);
    delete plain.password;
    return plain as T;
}
