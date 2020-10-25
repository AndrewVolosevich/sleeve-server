const jwt = require('jsonwebtoken')
const config = require('config')
import { Request, Response, NextFunction } from 'express';

module.exports = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {

        const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"

        if (!token) {
            return res.status(401).json({ message: 'Нет авторизации' })
        }

        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.userId = decoded.userId
        next()

    } catch (e) {
        res.status(401).json({ message: 'Нет авторизации' })
    }
}
