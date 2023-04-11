import { UserProfile } from '../models/profile.user.model';
import { IRequest, Response } from '../interface/request.interface';
import { BadRequest, ErrorTypes, UnAuthorizedError } from '../errors';

const getProfile = async (req: IRequest, res: Response) => {
    let userId = req.body.userId ? req.body.userId : req.JWT_USER!.id!;

    const profile = await UserProfile.findOne({ userId });
    res.status(200).json({ data: profile });
};

const updateProfile = async (req: IRequest, res: Response) => {
    let userId = req.body.userId ? req.body.userId : req.JWT_USER!.id!;

    if (userId != req.JWT_USER!.id) throw new UnAuthorizedError(ErrorTypes.UNAUTHORIZED);

    let { name, email } = req.body;
    if (!(name || email)) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

    const profile = await UserProfile.findOne({ userId });

    if (!profile) throw new Error(`Profile not Register for user ${userId}`);

    if (name) profile.name = name;
    if (email) profile.email = email;
    await profile.save();

    res.send({
        data: profile,
    });
};

export default {
    getProfile,
    updateProfile,
};
