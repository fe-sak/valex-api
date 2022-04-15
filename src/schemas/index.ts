import Joi from 'joi';

const createCardSchema = Joi.object({
  cardType: Joi.string().required(),
  employeeId: Joi.number().required(),
});

const schemas = { createCardSchema };
export default schemas;
