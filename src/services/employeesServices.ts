import { findById } from '../repositories/employeesRepository.js';
import * as errors from '../errors/index.js';

export async function getById(employeeId: number) {
  const employee = await findById(employeeId);

  if (!employee) throw errors.NotFound();

  return employee;
}
