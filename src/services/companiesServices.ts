import * as companyRepository from '../repositories/companiesRepository.js';
import * as errors from '../errors/index.js';

export async function getCompany(key: string) {
  const company = await companyRepository.findByApiKey(key);
  if (!company) throw errors.Unauthorized();

  return company;
}
