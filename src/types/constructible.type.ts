// eslint-disable-next-line @typescript-eslint/ban-types
import { CommandInterface } from "./command.interface";

export interface Constructable<T extends CommandInterface = any> extends Function {
    new (...args: any[]): T;
}
