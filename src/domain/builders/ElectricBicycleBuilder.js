import { BicycleBuilder } from "./BicycleBuilder.js";
import { ElectricBicycle } from "../products/ElectricBicycle.js";

export class ElectricBicycleBuilder extends BicycleBuilder {
  constructor() {
    super();
    this.reset();
  }

  reset() {
    this.product = null;
  }

  setBaseProperties(selection) {
    this.product = new ElectricBicycle({
      model: selection.model,
      brand: selection.brand,
      price: selection.price,
      frameMaterial: selection.frameMaterial,
      wheelSize: selection.wheelSize,
      color: selection.color,
      motorPower: null,
      batteryCapacity: null
    });
  }

  setElectricProperties(selection) {
    this.product.motorPower = selection.motorPower;
    this.product.batteryCapacity = selection.batteryCapacity;
    return this;
  }

  getProduct() {
    const readyProduct = this.product;
    this.reset();
    return readyProduct;
  }
}
