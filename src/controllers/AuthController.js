import { RegistrationFacade } from "../facades/RegistrationFacade.js";
import { ProductCatalogService } from "../services/ProductCatalogService.js";
import { UserRepository } from "../data/repositories/UserRepository.js";
import { OrderRepository } from "../data/repositories/OrderRepository.js";

export class AuthController {
  constructor() {
    this.registrationFacade = new RegistrationFacade();
    this.catalogService = new ProductCatalogService();
    this.userRepository = new UserRepository();
    this.orderRepository = new OrderRepository();
  }

  register = async (req, res, next) => {
    try {
      const result = await this.registrationFacade.register(req.body);
      const products = this.catalogService.getProducts();
      const registrations = await this.userRepository.listLatest();
      const orders = await this.orderRepository.listLatest();

      res.status(result.success ? 201 : 400).render("index", {
        errors: result.success ? [] : result.errors,
        successMessage: result.success
          ? result.emailResult.delivered
            ? "Реєстрацію завершено, лист підтвердження надіслано на email."
            : `Реєстрацію завершено. SMTP не налаштовано, тому лист збережено локально: ${result.emailResult.previewFile}`
          : null,
        orderMessage: null,
        formData: req.body,
        orderFormData: {},
        products,
        registrations,
        orders
      });
    } catch (error) {
      next(error);
    }
  };
}
