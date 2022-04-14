import * as companyRepository from '../repositories/companyRepository.js';
import * as errors from '../errors/index.js';

export async function validateKey(key: string) {
  const company = await companyRepository.findByApiKey(key);

  if (!company) throw errors.UnprocessableEntity();

  return company;
}
