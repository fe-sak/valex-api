import { findById } from '../repositories/employeeRepository.js';

export async function getById(employeeId: number) {
  const employee = await findById(employeeId);

  return employee;
}
