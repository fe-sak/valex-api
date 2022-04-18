import { findById } from '../repositories/employeesRepository.js';
import * as errors from '../errors/index.js';
import { Company } from '../repositories/companiesRepository.js';

export async function getById(employeeId: number, company: Company) {
  const employee = await findById(employeeId);
  if (!employee) throw errors.NotFound();

  if (company.id !== employee.companyId) throw errors.NotFound();

  return employee;
}
