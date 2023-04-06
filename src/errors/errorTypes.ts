enum ErrorTypes {
    /* 
        UnAuthorized 
    */
    UNAUTHORIZED = 'UNAUTHORIZED',
    // Token Relate
    TOKEN_UNAVAILABLE = 'TOKEN_UNAVAILABLE',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    TOKEN_INVALID = 'TOKEN_INVALID',

    /*
        Bad Request
     */
    BAD_REQUEST = 'BAD_REQUEST',

    // Missing Fields
    MISSING_FIELDS = 'MISSING_FIELDS',

    /* 
        Not Found
    */
    NOT_FOUND = 'NOT_FOUND',
}

export default ErrorTypes;
