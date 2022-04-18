import Joi from 'joi';

const createCardSchema = Joi.object({
  cardType: Joi.string().required(),
  employeeId: Joi.string().required(),
});

const activateCardSchema = Joi.object({
  securityCode: Joi.string().required(),
  password: Joi.number().required(),
});

const createRecharge = Joi.object({
  cardId: Joi.string().required(),
  amount: Joi.number().required(),
});

const createPaymentSchema = Joi.object({
  cardId: Joi.string().required(),
  password: Joi.string().required(),
  businessId: Joi.string().required(),
  amount: Joi.number().required(),
});

const createOnlinePaymentSchema = Joi.object({
  cardHolderName: Joi.string().required(),
  number: Joi.string().required(),
  expirationDate: Joi.string().required(),
  securityCode: Joi.string().required(),
  businessId: Joi.string().required(),
  amount: Joi.number().required(),
});

const schemas = {
  createCardSchema,
  activateCardSchema,
  createRecharge,
  createPaymentSchema,
  createOnlinePaymentSchema,
};
export default schemas;
