import * as companyRepository from '../repositories/companyRepository.js';

export async function getCompany(key: string) {
  const company = await companyRepository.findByApiKey(key);

  return company;
}
