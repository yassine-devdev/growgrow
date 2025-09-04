import { RequestHandler } from 'express';
import { generateTokenAndUser } from '../../services/auth.service';
import { Role } from '../../../../types';

export const loginController: RequestHandler = async (req, res, next) => {
    try {
        // The role is guaranteed to be valid due to the validation middleware
        const { role } = req.body as { role: Role };

        const { token, user } = await generateTokenAndUser(role);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};
