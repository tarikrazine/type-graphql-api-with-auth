import {
  CreateProductInput,
  GetProductInput,
  ProductModel,
} from '../schema/product.schema';
import { User } from '../schema/user.schema';

export default class ProductService {
  createProduct(input: CreateProductInput & { user: User['_id'] }) {
    return ProductModel.create(input);
  }

  async findProducts() {
    return ProductModel.find().lean();
  }

  findSingleProduct(input: GetProductInput) {
    return ProductModel.findOne(input).lean();
  }
}
