import { Container } from "inversify";
import { AddonsService } from "../common/addons";
import { StoreService } from "../common/store";
import { MinionService } from "../common/minion";

export function createContainer() {
    const container = new Container();

    container.bind(StoreService).toConstantValue(new StoreService());
    container.bind(AddonsService).toSelf();
    container.bind(MinionService).toSelf();

    return container;
}
