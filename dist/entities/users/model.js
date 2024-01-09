"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const counterpickSchema = new mongoose_1.default.Schema({
    godId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "God",
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
});
const createdListSchema = new mongoose_1.default.Schema({
    listName: {
        type: String,
        required: true,
    },
    mainGods: [
        {
            godId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'God',
                required: true,
            },
            counterpicks: [counterpickSchema],
        },
    ],
});
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    favoriteGods: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "God",
        },
    ],
    createdLists: [createdListSchema],
}, {
    versionKey: false,
    timestamps: true,
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=model.js.map