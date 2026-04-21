import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    type: { type: String, enum: ["standard", "electric"], required: true },
    model: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    frameMaterial: { type: String, required: true, trim: true },
    wheelSize: { type: Number, required: true },
    price: { type: Number, required: true },
    motorPower: { type: Number, default: null },
    batteryCapacity: { type: Number, default: null }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
