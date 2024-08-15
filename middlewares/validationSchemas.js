import Joi from "joi";
import JoiDate from "@joi/date";

const JoiExtended = Joi.extend(JoiDate);

const joiGetDailyRateSchema = JoiExtended.object({
  currentWeight: JoiExtended.number().required(),
  height: JoiExtended.number().required(),
  age: JoiExtended.number().required(),
  desiredWeight: JoiExtended.number().required(),
  bloodType: JoiExtended.number().required(),
});

const joiUpdateDailyRateSchema = JoiExtended.object({
  currentWeight: JoiExtended.number().required(),
  height: JoiExtended.number().required(),
  age: JoiExtended.number().required(),
  desiredWeight: JoiExtended.number().required(),
  bloodType: JoiExtended.number().required(),
  dailyRate: JoiExtended.number().required(),
  notAllowedProducts: JoiExtended.array().items(JoiExtended.string()),
  notAllowedProductsAll: JoiExtended.array().items(JoiExtended.string()),
});

const joiSignupSchema = JoiExtended.object({
  name: JoiExtended.string().required(),
  email: JoiExtended.string().required(),
  password: JoiExtended.string().min(6).required(),
  phone: JoiExtended.string(),
  currentWeight: JoiExtended.number(),
  height: JoiExtended.number(),
  age: JoiExtended.number(),
  desiredWeight: JoiExtended.number(),
  bloodType: JoiExtended.number(),
  dailyRate: JoiExtended.number(),
  notAllowedProducts: JoiExtended.array().items(JoiExtended.string()),
  notAllowedProductsAll: JoiExtended.array().items(JoiExtended.string()),
});

const joiLoginSchema = JoiExtended.object({
  email: JoiExtended.string().required(),
  password: JoiExtended.string().min(6).required(),
});

const joiAddMyProductSchema = JoiExtended.object({
  productName: JoiExtended.string().required(),
  productWeight: JoiExtended.number().integer().min(5).max(5000).required(),
  date: JoiExtended.date().format("DD.MM.YYYY").required(),
});

const joiDeleteMyProductSchema = JoiExtended.object({
  date: JoiExtended.date().format("DD.MM.YYYY").required(),
});

const joiGetMyProductSchema = JoiExtended.object({
  date: JoiExtended.date().format("DD.MM.YYYY").required(),
});

export {
  joiGetDailyRateSchema,
  joiUpdateDailyRateSchema,
  joiSignupSchema,
  joiLoginSchema,
  joiAddMyProductSchema,
  joiDeleteMyProductSchema,
  joiGetMyProductSchema,
};
