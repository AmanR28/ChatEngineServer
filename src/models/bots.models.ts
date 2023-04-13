import { Schema, model } from 'mongoose';

export enum TypesBot {
    GPT3 = 'GPT3',
}

export interface IBot {
    botId: string;
    type: TypesBot;
    updates: Map<string, string[]>;
    connections: Map<string, string>;
}

const botSchema = new Schema<IBot>({
    botId: {
        type: String,
        required: true,
        index: true,
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(TypesBot),
    },
    updates: {
        type: Map,
        of: [String],
        default: {},
    },
    connections: {
        type: Map,
        of: String,
        default: {},
    },
});

export const Bots = model<IBot>('Bots', botSchema, 'bots');
