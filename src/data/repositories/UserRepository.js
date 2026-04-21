import { User } from "../models/User.js";

export class UserRepository {
  findByEmail(email) {
    return User.findOne({ email: email.toLowerCase().trim() });
  }

  create(payload) {
    return User.create(payload);
  }

  deleteById(id) {
    return User.findByIdAndDelete(id);
  }

  listLatest(limit = 5) {
    return User.find().sort({ createdAt: -1 }).limit(limit).lean();
  }
}
