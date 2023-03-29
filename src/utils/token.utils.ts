export interface IJwtToken {
    expiry: string;
    type: string;
    id: number;
}

export const JwtToken = {
    create: (expiry: string, type: string, id: number): IJwtToken => {
        return {
            expiry,
            type,
            id,
        } as IJwtToken;
    },

    // Verify Token
    process: (jwtToken: IJwtToken): string | null => {
        if (
            !jwtToken.expiry ||
            new Date(jwtToken.expiry).getTime() < Date.now()
        ) {
            return 'TOKEN_EXPIRED';
        }

        if (jwtToken.type !== 'TYPE_AUTH') {
            return 'INVALID_TOKEN';
        }

        return null;
    },
};
