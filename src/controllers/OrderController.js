import { OrderFacade } from "../facades/OrderFacade.js";
import { ProductCatalogService } from "../services/ProductCatalogService.js";
import { UserRepository } from "../data/repositories/UserRepository.js";
import { OrderRepository } from "../data/repositories/OrderRepository.js";

export class OrderController {
  constructor() {
    this.orderFacade = new OrderFacade();
    this.catalogService = new ProductCatalogService();
    this.userRepository = new UserRepository();
    this.orderRepository = new OrderRepository();
  }

  create = async (req, res, next) => {
    try {
      const result = await this.orderFacade.createOrder(req.body);
      const products = this.catalogService.getProducts();
      const registrations = await this.userRepository.listLatest();
      const orders = await this.orderRepository.listLatest();

      res.status(result.success ? 201 : 400).render("index", {
        errors: result.success ? [] : result.errors,
        successMessage: null,
        orderMessage: result.success
          ? `Замовлення оформлено: ${result.order.brand} ${result.order.model}.`
          : null,
        formData: {},
        orderFormData: req.body,
        products,
        registrations,
        orders
      });
    } catch (error) {
      next(error);
    }
  };
}
