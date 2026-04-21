import { Product } from "./Product.js";

export class Bicycle extends Product {
  constructor(config) {
    super({
      ...config,
      kind: "standard",
      motorPower: null,
      batteryCapacity: null
    });
  }
}
