import "reflect-metadata";
import "@total-typescript/ts-reset";
import { bootstrap } from "./bootstrap";
import { ListUnused } from "./commands/list-unused";
import { Add } from "./commands/add";
import { ListMissing } from "./commands/list-missing";

bootstrap([Add, ListUnused, ListMissing]);
