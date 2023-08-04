import "reflect-metadata";
import "@total-typescript/ts-reset";
import { ListUnused } from "./commands/list-unused";
import { Add } from "./commands/add";
import { bootstrap } from "./bootstrap";

bootstrap([Add, ListUnused]);
