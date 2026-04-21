import { Order } from "../models/Order.js";

export class OrderRepository {
  create(payload) {
    return Order.create(payload);
  }

  listLatest(limit = 5) {
    return Order.find().sort({ createdAt: -1 }).limit(limit).lean();
  }
}
