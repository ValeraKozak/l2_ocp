import { Product } from "./Product.js";

export class ElectricBicycle extends Product {
  constructor(config) {
    super({
      ...config,
      kind: "electric"
    });
  }
}
