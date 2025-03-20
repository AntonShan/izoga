import type { CommandInterface } from "./command.interface";

export type Constructable<T extends CommandInterface = any> = new (...args: any[]) => T;
