import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
import Express from "express-session";

type UserSession = {
    session: Express.Session & { userId?: number }
}

export type MyContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
    req: Request & UserSession,
    res: Response
}