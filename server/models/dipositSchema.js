import mongoose from "mongoose";

const diposit = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    dipositDate: {
      type: Date,
      default: Date.now(),
    },
    dipositTimes: {
      type: Number,
    },
    note: {
      type: String,
      default: "write a note",
    },
  },
  {
    timestamps: true,
  },
);

export default function dipositSchema(connection) {
  return connection.models.diposits || connection.model("diposits", diposit);
}
