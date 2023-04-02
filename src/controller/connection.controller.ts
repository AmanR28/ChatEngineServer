import { Request, Response } from 'express';

const getConnections = async (req: Request, res: Response) => {
    const user = req.user;
};

const getUpdate = async (req: Request, res: Response) => {};

const createConnection = async (req: Request, res: Response) => {};

export default {
    getConnections,
    getUpdate,
    createConnection,
};
