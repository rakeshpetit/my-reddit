import { Request, Response } from "express";
import Express from "express-session";

type UserSession = {
    session: Express.Session & { userId?: number }
}

export type MyContext = {
    req: Request & UserSession,
    res: Response
}