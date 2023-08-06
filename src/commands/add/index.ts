// import datastore from "../../common/datastore/datastore";
import { Command, Parameter } from "../../decorators";
import { CommandInterface } from "../../types/command.interface";

@Command("add")
export class Add implements CommandInterface {
    async execute(
        @Parameter("path", { type: "string" }) path: string,
        @Parameter("name", { type: "string" }) name: string,
    ): Promise<void> {
        // const db = await datastore();
        console.dir({
            path,
            name,
        });
    }
}
