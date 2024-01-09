"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("../../config/mongoose"));
const godSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    pantheon: {
        type: String,
        enum: [
            "Arturiano",
            "Babilónico",
            "Chino",
            "Celta",
            "Egipcio",
            "Griego",
            "Grandes Antiguos",
            "Hindú",
            "Japonés",
            "Maya",
            "Nórdico",
            "Polinesio",
            "Romano",
            "Eslavo",
            "Vudú",
            "Yoruba",
        ],
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["Guardián", "Guerrero", "Cazador", "Mago", "Asesino"],
    },
    lore: {
        type: String,
        required: true,
    },
    abilities: [
        {
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            details: [
                {
                    label: {
                        type: String,
                        required: true,
                    },
                    value: {
                        type: String,
                        required: false,
                    },
                },
            ],
        },
    ],
    images: {
        main: {
            type: String,
            required: true,
        },
        card: {
            type: String,
            required: true,
        },
        skins: [
            {
                name: {
                    type: String,
                    required: false,
                },
                image: {
                    type: String,
                    required: false,
                },
            },
        ],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isNewGod: {
        type: Boolean,
        default: false,
    },
    isFreeToPlay: {
        type: Boolean,
        default: false, // Puedes ajustar el valor predeterminado según tus necesidades
    },
}, {
    versionKey: false,
    timestamps: true,
});
const God = mongoose_1.default.model("God", godSchema);
exports.default = God;
//# sourceMappingURL=model.js.map