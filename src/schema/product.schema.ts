import {
  getModelForClass,
  Index,
  modelOptions,
  prop,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import { IsNumber, MaxLength, Min, MinLength } from 'class-validator';
import { customAlphabet } from 'nanoid';
import { Field, InputType, ObjectType } from 'type-graphql';
import { User } from './user.schema';

const nanoID = customAlphabet('abcdefghijklmnopqrstuvwxyz123456789', 10);

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
@Index({ productI: 1 })
@ObjectType()
export class Product {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true })
  description: string;

  @Field(() => Number)
  @prop({ required: true })
  price: number;

  @Field(() => String)
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @Field(() => String)
  @prop({ required: true, unique: true, default: () => `product_${nanoID()}` })
  productID: string;
}

export const ProductModel = getModelForClass<typeof Product>(Product);

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @MinLength(50, {
    message: 'Description must be at least 50 characters',
  })
  @MaxLength(1000, {
    message: 'Description must not be more than 1000 characters',
  })
  @Field()
  description: string;

  @IsNumber()
  @Min(1)
  @Field()
  price: number;
}

@InputType()
export class GetProductInput {
  @Field()
  productID: string;
}
