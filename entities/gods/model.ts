import mongoose from "../../config/mongoose";

const godSchema = new mongoose.Schema({
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
},
{
  versionKey: false,
  timestamps: true,
});

const God = mongoose.model("God", godSchema);

export default God;
