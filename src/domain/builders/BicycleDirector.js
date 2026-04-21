export class BicycleDirector {
  construct(builder, selection) {
    builder.reset();
    builder.setBaseProperties(selection);
    builder.setElectricProperties(selection);
    return builder.getProduct();
  }
}
