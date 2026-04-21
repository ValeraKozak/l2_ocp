export class BicycleBuilder {
  reset() {
    throw new Error("Method reset() must be implemented in a concrete builder.");
  }

  setBaseProperties() {
    throw new Error("Method setBaseProperties() must be implemented in a concrete builder.");
  }

  setElectricProperties() {
    throw new Error("Method setElectricProperties() must be implemented in a concrete builder.");
  }

  getProduct() {
    throw new Error("Method getProduct() must be implemented in a concrete builder.");
  }
}
