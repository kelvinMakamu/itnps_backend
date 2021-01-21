module.exports = {
    API_VERSION:'/api/v1',
    DB_URL: process.env.MONGODB_URI || 'mongodb://localhost:27017/itnps',
    DB_OPTIONS:{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        autoIndex: false, // Don't build indexes
        poolSize: 25, // Maintain up to 25 socket connections
        serverSelectionTimeoutMS: 15000, // Keep trying to send operations for X seconds
        socketTimeoutMS: 150000, // Close sockets after X seconds of inactivity
        family: 4 // Use IPv4, skip trying IPv6
    },
    COLS_USER: 'id first_name last_name email username level',
    CORS_OPTIONS: {
        origin: 'https://kelvinmakamu.github.io/itnps_frontend' || 'http://localhost:4200',
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204
    },
    ALLOWED_LEVELS: [0,1,2],
    SALT_ROUNDS: 12,
    SERVER_PORT: process.env.PORT || 8185,
    SECRET: 'CRAZY#%@LKJKS()**ˆTNPSCRA@!CRTiCA$%TREE1324QwZYSLAYKCKER',
    MAX_NPS_VALUE: 10,
    DEFAULT_MORGAN_FORMAT: ':remote-addr :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms ":referrer" ":user-agent"',
}