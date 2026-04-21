export class Product {
  constructor({
    kind,
    model,
    brand,
    price,
    frameMaterial,
    wheelSize,
    color,
    motorPower = null,
    batteryCapacity = null
  }) {
    this.kind = kind;
    this.model = model;
    this.brand = brand;
    this.price = price;
    this.frameMaterial = frameMaterial;
    this.wheelSize = wheelSize;
    this.color = color;
    this.motorPower = motorPower;
    this.batteryCapacity = batteryCapacity;
  }
}
