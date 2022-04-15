import * as companyRepository from '../repositories/companiesRepository.js';

export async function getCompany(key: string) {
  const company = await companyRepository.findByApiKey(key);

  return company;
}
