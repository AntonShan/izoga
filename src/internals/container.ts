import { Container } from "inversify";
import { AddonsService } from "../common/addons";
import { StoreService } from "../common/store";

export function createContainer() {
    const container = new Container();

    container.bind(StoreService).toSelf();
    container.bind(AddonsService).toSelf();

    return container;
}
