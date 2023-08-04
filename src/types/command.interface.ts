export interface CommandInterface<Return = void> {
    execute(...args: any[]): Promise<Return>;
}
