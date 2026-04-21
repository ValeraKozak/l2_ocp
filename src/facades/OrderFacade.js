import { BicycleDirector } from "../domain/builders/BicycleDirector.js";
import { BuilderRegistry } from "../domain/builders/BuilderRegistry.js";
import { OrderRepository } from "../data/repositories/OrderRepository.js";
import { UserRepository } from "../data/repositories/UserRepository.js";
import { ProductCatalogService } from "../services/ProductCatalogService.js";
import { ValidationService } from "../services/ValidationService.js";

export class OrderFacade {
  constructor() {
    this.director = new BicycleDirector();
    this.builderRegistry = new BuilderRegistry();
    this.orderRepository = new OrderRepository();
    this.userRepository = new UserRepository();
    this.catalogService = new ProductCatalogService();
    this.validationService = new ValidationService();
  }

  async createOrder(data) {
    const normalizedData = {
      customerName: data.customerName?.trim(),
      email: data.email?.trim().toLowerCase(),
      phone: data.phone?.trim(),
      productId: data.productId
    };

    const errors = this.validationService.validateOrder(normalizedData);
    if (errors.length > 0) {
      return { success: false, errors };
    }

    const registeredUser = await this.userRepository.findByEmail(normalizedData.email);
    if (!registeredUser) {
      return {
        success: false,
        errors: ["Спочатку зареєструйтеся на сайті з цією електронною адресою."]
      };
    }

    const productSelection = this.catalogService.findProductById(normalizedData.productId);
    if (!productSelection) {
      return { success: false, errors: ["Обраний велосипед не знайдено."] };
    }

    const builder = this.builderRegistry.create(productSelection.type);
    const product = this.director.construct(builder, productSelection);

    const order = await this.orderRepository.create({
      customerName: normalizedData.customerName,
      email: normalizedData.email,
      phone: normalizedData.phone,
      type: product.kind,
      model: product.model,
      brand: product.brand,
      color: product.color,
      frameMaterial: product.frameMaterial,
      wheelSize: product.wheelSize,
      price: product.price,
      motorPower: product.motorPower,
      batteryCapacity: product.batteryCapacity
    });

    return { success: true, order };
  }
}
