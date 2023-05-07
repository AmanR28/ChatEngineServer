import { UserProfile } from '../models/profile.user.model';
import { IRequest, NextFunction, Response } from '../interface/request.interface';
import { ApplicationError, BadRequest, ErrorTypes, UnAuthorizedError } from '../errors';

const getProfile = async (req: IRequest, res: Response) => {
    let userId = req.query.userId ? req.query.userId : req.JWT_USER!.id!;

    const profile = await UserProfile.findOne({ userId });
    res.status(200).json({ data: profile });
};

const updateProfile = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let userId = req.body.userId ? req.body.userId : req.JWT_USER!.id!;

        if (userId != req.JWT_USER!.id) throw new UnAuthorizedError(ErrorTypes.UNAUTHORIZED);

        let { name, email, avatar } = req.body;
        if (!name && !email && !avatar) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const profile = await UserProfile.findOne({ userId });

        if (!profile) throw new Error(`Profile not Register for user ${userId}`);

        if (name) profile.name = name;
        if (email) profile.email = email;
        if (avatar) profile.avatar = avatar;
        await profile.save();

        res.send({
            data: profile,
        });
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('getConnection', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

export default {
    getProfile,
    updateProfile,
};
