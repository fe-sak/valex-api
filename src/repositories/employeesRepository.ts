import { connection } from '../database.js';

export interface Employee {
  id: number;
  fullName: string;
  cpf: string;
  email: string;
  companyId: number;
}

export async function findById(id: number) {
  const result = await connection.query<Employee, [number]>(
    'SELECT * FROM employees WHERE id=$1',
    [id]
  );

  return result.rows[0];
}

export async function findByCompanyId(companyId: number) {
  const result = await connection.query<Employee, [number]>(
    "SELECT * FROM employees WHERE 'companyId'=$1",
    [companyId]
  );

  return result.rows[0];
}
