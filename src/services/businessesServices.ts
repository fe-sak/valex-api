import * as businessesRepository from '../repositories/businessesRepository.js';
import * as errors from '../errors/index.js';

export async function getById(businessId: number) {
  const business = await businessesRepository.findById(businessId);
  if (!business) throw errors.NotFound();

  return business;
}
