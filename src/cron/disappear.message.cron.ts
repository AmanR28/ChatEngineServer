import cron from 'node-cron';

import { DisappearMessage } from '../models/disappering.messages.model';
import { connTypes } from '../interface/types.connections.interface';
import { DirectMessages } from '../models/direct.messages.model';
import { GroupMessages } from '../models/group.messages.model';

const deleteDisappearMsg = cron.schedule('* * * * *', async () => {
    try {
        const result = await DisappearMessage.find({ expiry: { $lt: new Date() } });

        console.log('Expired messages:', result);

        for (const msg of result) {
            let updates = 'messages.' + msg.msgId;
            switch (msg.type) {
                case connTypes.DIRECT:
                    await DirectMessages.updateOne(
                        { connId: msg.connId },
                        { $unset: { [updates]: 1 } }
                    );
                    break;
                case connTypes.GROUP:
                    await GroupMessages.updateOne(
                        { connId: msg.connId },
                        { $unset: { [updates]: 1 } }
                    );
                    break;
                default:
                    console.error('Invalid connection type:', msg.type);
                    return;
            }
        }
        // delete messages
        let ids = result.map(x => x._id);
        await DisappearMessage.deleteMany({ _id: { $in: ids } });
    } catch (error) {
        console.error('Error while deleting expired messages:', error);
    }
});

export default deleteDisappearMsg;
