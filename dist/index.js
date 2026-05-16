"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const db_1 = __importDefault(require("./db/db"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
(0, dotenv_1.config)();
// Database connection
(0, db_1.default)();
// middleware
app.use((0, helmet_1.default)()); // security middleware to set various HTTP headers for app
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// cors
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
}));
// global error
app.use(globalErrorHandler_1.globalErrorHandler);
// log http req to console
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)("dev"));
}
const PORT = process.env.PORT || 4001;
// health check
app.get('/api/health', (req, res) => {
    return res.status(200).send({ success: true, message: 'Server running....' });
});
// all api endpoint
app.use('/api', routes_1.default);
app.listen(PORT, () => {
    console.log(`Server is started at ${PORT}`);
});
//# sourceMappingURL=index.js.map