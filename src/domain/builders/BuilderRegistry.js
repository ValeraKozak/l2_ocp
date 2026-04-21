import { StandardBicycleBuilder } from "./StandardBicycleBuilder.js";
import { ElectricBicycleBuilder } from "./ElectricBicycleBuilder.js";

export class BuilderRegistry {
  constructor() {
    this.builders = new Map();

    this.register("standard", StandardBicycleBuilder);
    this.register("electric", ElectricBicycleBuilder);
  }

  register(type, BuilderClass) {
    this.builders.set(type, BuilderClass);
  }

  create(type) {
    const BuilderClass = this.builders.get(type);

    if (!BuilderClass) {
      throw new Error(`Builder for type "${type}" is not registered.`);
    }

    return new BuilderClass();
  }
}
