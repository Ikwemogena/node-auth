import express from "express";

import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers";


export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')

        if (!user) {
            res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password)

        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403);
        }

        const salt = random()
        user.authentication.sessionToken = authentication(salt, user._id.toString())

        await user.save()

        res.cookie('sessionToken', user.authentication.sessionToken, { domain: 'localhost', path: '/', expires: new Date(Date.now() + 1000 * 60 * 60) })

        return res.status(200).json(user).end();
    } catch (error) {
        return res.sendStatus(400);
    }
}

export const registerUser = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body

        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email)

        if (existingUser) {
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })

        return res.status(201).json(user).end();
    } catch (error) {
        return res.sendStatus(400);
    }
}