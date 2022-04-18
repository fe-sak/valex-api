import { Company } from '../repositories/companiesRepository.js';
import * as cardServices from './cardsServices.js';
import * as emplooyeeServices from './employeesServices.js';
import * as rechargeRepository from '../repositories/rechargesRepository.js';
import verifyAmount from '../utils/verifyAmount.js';
import { Card } from '../repositories/cardsRepository.js';

interface Recharge {
  cardId: number;
  amount: number;
}

export async function listRecharges(cardId: number) {
  const recharges = await rechargeRepository.findByCardId(cardId);

  return recharges;
}

export async function recharge(
  recharge: Recharge,
  company: Company,
  card: Card
) {
  const { cardId, amount } = recharge;

  await emplooyeeServices.getById(card.employeeId, company);
  cardServices.verifyIfVirtual(card);
  cardServices.verifyIfBlocked(card);
  cardServices.verifyIfExpired(card);
  verifyAmount(amount);

  const insertRecharge = { cardId, amount };
  await rechargeRepository.insert(insertRecharge);
}

export async function sumRecharges(cardId: number) {
  const recharges = await rechargeRepository.findByCardId(cardId);

  const initialValue = 0;
  const sum = recharges.reduce(
    (acc, current) => acc + current.amount,
    initialValue
  );

  return sum;
}
