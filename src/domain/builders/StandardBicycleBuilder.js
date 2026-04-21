import { BicycleBuilder } from "./BicycleBuilder.js";
import { Bicycle } from "../products/Bicycle.js";

export class StandardBicycleBuilder extends BicycleBuilder {
  constructor() {
    super();
    this.reset();
  }

  reset() {
    this.product = null;
  }

  setBaseProperties(selection) {
    this.product = new Bicycle({
      model: selection.model,
      brand: selection.brand,
      price: selection.price,
      frameMaterial: selection.frameMaterial,
      wheelSize: selection.wheelSize,
      color: selection.color
    });
  }

  setElectricProperties() {
    return this;
  }

  getProduct() {
    const readyProduct = this.product;
    this.reset();
    return readyProduct;
  }
}
