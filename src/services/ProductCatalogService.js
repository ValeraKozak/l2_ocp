export class ProductCatalogService {
  getProducts() {
    return [
      {
        id: "urban-classic",
        type: "standard",
        model: "Urban Classic",
        brand: "VeloCity",
        price: 18999,
        frameMaterial: "Алюміній",
        wheelSize: 28,
        color: "Графітовий"
      },
      {
        id: "trail-pro",
        type: "standard",
        model: "Trail Pro",
        brand: "VeloCity",
        price: 23999,
        frameMaterial: "Карбон",
        wheelSize: 29,
        color: "Оливковий"
      },
      {
        id: "volt-city",
        type: "electric",
        model: "Volt City",
        brand: "E-Motion",
        price: 47999,
        frameMaterial: "Алюміній",
        wheelSize: 28,
        color: "Синій",
        motorPower: 350,
        batteryCapacity: 480
      },
      {
        id: "volt-touring",
        type: "electric",
        model: "Volt Touring",
        brand: "E-Motion",
        price: 56999,
        frameMaterial: "Карбон",
        wheelSize: 29,
        color: "Чорний",
        motorPower: 500,
        batteryCapacity: 720
      }
    ];
  }

  findProductById(productId) {
    return this.getProducts().find(product => product.id === productId) || null;
  }
}
