import express from 'express';
import { get, identity, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['sessionToken'];

        if (!sessionToken) {
            return res.sendStatus(403);
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });

        return next();
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
} 

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params
        
        const currentUserId = get(req, 'identity._id') as String;

        if (!currentUserId) {
            return res.sendStatus(403);
        }

        if (currentUserId !== id) {
            return res.sendStatus(403);
        }

        next();
    } catch (error) {
        res.sendStatus(400);
    }
}