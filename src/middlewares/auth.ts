import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import authType from "../types/authType";
// @ts-ignore
import auth from "../config/auth";

const authConfig: authType = auth;

export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "Token não informado" });
  }

  //Separa o authHeader em duas partes, verificando se existe o cabeçalho Berear e o Hash
  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).send({ error: "Token mal formado" });
  }

  const [scheme, token] = parts;

  // Verificar se o scheme tem a palvra Bearer
  if (!/^Bearer$/i.test(scheme)) {
    return res
      .status(401)
      .send({ error: "Houve um problema na formação do token" });
  }

  jwt.verify(token, authConfig.secret, (err: any, decoded: any) => {
    if (err) return res.status(401).send({ error: "Token inválido" });
    if (decoded !== undefined) {
      req.userId = decoded.id;
    } else {
      return res.status(400).send({ error: "Id inválido" });
    }
    return next();
  });
};
