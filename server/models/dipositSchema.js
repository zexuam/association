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
    depositDate: {
      type: Date,
      required: [true, "date and time is required"],
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
