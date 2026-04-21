import { ProductCatalogService } from "../services/ProductCatalogService.js";
import { UserRepository } from "../data/repositories/UserRepository.js";
import { OrderRepository } from "../data/repositories/OrderRepository.js";

export class HomeController {
  constructor() {
    this.catalogService = new ProductCatalogService();
    this.userRepository = new UserRepository();
    this.orderRepository = new OrderRepository();
  }

  index = async (req, res) => {
    const products = this.catalogService.getProducts();
    const registrations = await this.userRepository.listLatest();
    const orders = await this.orderRepository.listLatest();

    res.render("index", {
      errors: [],
      successMessage: null,
      orderMessage: null,
      formData: {},
      orderFormData: {},
      products,
      registrations,
      orders
    });
  };
}
