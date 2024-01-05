import mongoose from "mongoose";

const counterpickSchema = new mongoose.Schema({
  godId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "God",
    required: true,
  },
  description: {
    type: String, 
    required: false,
  },
});

const createdListSchema = new mongoose.Schema({
  listName: {
    type: String,
    required: true,
  },
  mainGods: [
    {
      godId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'God',
        required: true,
      },
      counterpicks: [counterpickSchema],
    },
  ],
});

const userSchema = new mongoose.Schema({
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
    select:false
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  birthday: {
    type: Date,
    required: true,
  },
  favoriteGods: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "God",
    },
  ],
  createdLists: [createdListSchema],
});

const User = mongoose.model("User", userSchema);

export default User;
