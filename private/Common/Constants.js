module.exports = {

    ENVIRONMENTS: {
        HOMEMADE: 'homemade',
        RESTAURANT: 'restaurant'
    },

    COMMON: {
        DB_ID: '_id',
        ID: 'id',
        TYPE: 'type',
        PATH: 'path',
        SESSION: 'session',
        PASSPORT: 'passport',
        PROPS: 'props',
        METHODS: 'methods',
        LABEL: 'label',
        STATUS: 'status',
        INDEX: 'index',
        TEXT: 'text'
    },

    MODULES: {
        APP: 'App',
        DB: 'DB',
        AUTH: 'Auth',
        SMTP: 'SMTP',
        STORAGE: 'Storage',
        SERVER: 'Server'
    },

    TYPES: {
        FUNCTION: 'function',
        STRING: 'string',
        OBJECT: 'object'
    },

    DB_MODELS: {
        APP_USER: 'AppUser',
        PLATE: 'Plate',
        CHARITY: 'Charity',
        HASHTAG: 'Hashtag',
        FEEDBACK: 'Feedback'
    },

    REQ_PROPS: {
        HEADERS: 'headers',
        CONTENT_TYPE: 'content-type',
        BODY: 'body',
        PARAMS: 'params',
        QUERY: 'query',
        FORM: 'form',
        FIELDS: 'fields',
        FILES: 'files',
        LIMIT: 'limit',
        CURSOR: 'cursor'
    },

    REQ_METHODS: {
        GET: 'GET',
        POST: 'POST'
    },

    FILE_PROPS: {
        IMAGE: 'image',
        IMAGES: 'images',
        IMAGE_CONTENT_TYPE: 'contentType',
        IMAGE_SOURCE: 'imageSource',
        VIDEO: 'video',
        VIDEOS: 'videos',
        VIDEO_CONTENT_TYPE: 'videoContentType',
        VIDEO_SOURCE: 'videoSource',
        THUMBNAIL: 'thumbNail'
    },

    PROVIDERS: {
        LOCAL: 'local',
        FACEBOOK: 'facebook',
        GOOGLE: 'google',
        APPLE: 'apple'
    },

    ROUTES: {
        AUTHORIZATION: {
            LOGIN_LOCAL: 'login_local',
            CREATE_LOCAL_USER: 'create_local_user',
            TEST_AUTH: 'test_auth',
            LOGOUT: 'logout'
        },
        PROFILE: {
            GET_PROFILE: 'get_profile',
            UPDATE_PROFILE: 'update_profile',
            UPDATE_SUBSCRIPTIONS: 'update_subscriptions',
            UPDATE_PASSWORD: 'update_password'
        },
        CONTENT: {
            ADD_PLATE: 'add_plate',
            GET_PLATES: 'get_plates',
            GET_PLATE: 'get_plate',
            LIKE_PLATE: 'like_plate',
            DISLIKE_PLATE: 'dislike_plate',
            GET_LIKED_PlATES: 'get_liked_plates',
            GET_OWN_PLATES: 'get_own_plates'
        },
        FEEDBACK: {
            ADD_COMMENT: 'add_comment',
            ADD_REPORT: 'add_report',
            GET_COMMENTS: 'get_comments'
        },
        DEV: {
            CREATE_RANDOM_PLATES: 'create_random_plates'
        }
    },

    PROFILE: {
        USER: 'user',
        NAME: 'name',
        FIRST_NAME: 'firstName',
        LAST_NAME: 'lastName',
        GENDER: 'gender',
        EMAIL: 'email',
        PASSWORD: 'password',
        OLD_PASSWORD: 'oldPassword',
        HASHED_PASSWORD: 'hashedPassword',
        LAST_LOGGED: 'lastLogged',
        PROVIDER: 'provider',
        TOKEN: 'token',
        CURRENT_TOKEN: 'currentToken',
        UPLOADED_PLATES: 'uploadedPlates',
        LIKED_PLATES: 'likedPlates',
        CHARITY_VOTES: 'charityVotes',
        WARNINGS: 'warnings',
        CUSTOM_PROFILE: 'customProfile',
        SUBSCRIPTIONS: 'subscriptions',
        REPORTED_PLATES: 'reportedPlates',
        ADMIN: 'admin'
    },

    PLATE: {
        NAME: 'name',
        ENV: 'environment',
        WEEK: 'week',
        RECIPE: 'recipe',
        INGREDIENTS: 'ingredients',
        LIKES: 'likes',
        AUTHOR: 'author',
        HASHTAGS: 'hashtags',
        COMMENTS: 'comments',
        REPORTS: 'reports',
        RELATED_PLATES: 'relatedPlates'
    },

    FEEDBACK_TYPES: {
        COMMENT: 'comment',
        REPORT: 'report'
    },

    FEEDBACK: {
        AUTHOR: 'author',
        TARGET: 'target'
    },

    RESTAURANT: {
        NAME: 'restaurantName',
        GEO: 'geo',
        COUNTRY: 'country',
        CITY: 'city',
        ADDRESS: 'address'
    },

    STORAGE: {
        ROOT_DIR: 'storage',
        AVATAR_PREFIX: 'avatar',
        PLATE_PREFIX: 'plate',
        CHARITY_PREFIX: 'charity'
    },

    SPECIAL_KEYS: {
        EMPTY_STRING: '',
        COMMA_SEPARATOR: ',',
        IS_ROBOT: 'isRobot',
        IS_ADMIN: 'isAdmin',
        IS_SUSPENDED: 'isSuspended',
        IS_FIXED: 'isFixed',
        IS_TEST: 'isTest',
        IS_READY: 'isReady',
        IS_LIKED: 'isLiked',
        CAN_LIKE: 'canLike',
        CAN_VOTE: 'canVote',
        USED_IN: 'usedIn',
        CREATED_AT: 'createdAt'
    },

    SUBSCRIPTIONS: {
        ON_COMMENT: 'onComment',
        ON_RATE_CHANGE: 'onRateChange',
        ON_WARNING: 'onWarning'
    }
};

