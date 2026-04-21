export class ValidationService {
  validateRegistration(data) {
    const errors = [];

    if (!data.fullName?.trim()) {
      errors.push("Вкажіть ім'я та прізвище.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "")) {
      errors.push("Вкажіть коректну електронну адресу.");
    }

    if (!/^[\d+\-\s()]{10,}$/.test(data.phone || "")) {
      errors.push("Вкажіть коректний номер телефону.");
    }

    if (!data.password || data.password.length < 6) {
      errors.push("Пароль має містити щонайменше 6 символів.");
    }

    return errors;
  }

  validateOrder(data) {
    const errors = [];

    if (!data.customerName?.trim()) {
      errors.push("Для замовлення вкажіть ім'я клієнта.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "")) {
      errors.push("Для замовлення потрібна коректна електронна адреса.");
    }

    if (!/^[\d+\-\s()]{10,}$/.test(data.phone || "")) {
      errors.push("Для замовлення вкажіть коректний номер телефону.");
    }

    if (!data.productId) {
      errors.push("Оберіть велосипед зі списку.");
    }

    return errors;
  }
}
