import crypto from "crypto";

import { UserRepository } from "../data/repositories/UserRepository.js";
import { ValidationService } from "../services/ValidationService.js";
import { EmailService } from "../services/EmailService.js";

export class RegistrationFacade {
  constructor() {
    this.userRepository = new UserRepository();
    this.validationService = new ValidationService();
    this.emailService = new EmailService();
  }

  async register(data) {
    const normalizedData = {
      fullName: data.fullName?.trim(),
      email: data.email?.trim().toLowerCase(),
      phone: data.phone?.trim(),
      password: data.password || ""
    };

    const errors = this.validationService.validateRegistration(normalizedData);
    if (errors.length > 0) {
      return { success: false, errors };
    }

    const existingUser = await this.userRepository.findByEmail(normalizedData.email);
    if (existingUser) {
      return { success: false, errors: ["Користувач із такою електронною адресою вже існує."] };
    }

    const savedUser = await this.userRepository.create({
      ...normalizedData,
      password: this.hashPassword(normalizedData.password)
    });

    let emailResult;

    try {
      emailResult = await this.emailService.sendRegistrationConfirmation(savedUser);
    } catch (error) {
      await this.userRepository.deleteById(savedUser._id);
      return {
        success: false,
        errors: [`Не вдалося надіслати лист підтвердження: ${error.message}`]
      };
    }

    return {
      success: true,
      user: savedUser,
      emailResult
    };
  }

  hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
  }
}
