import verifyAmount from '../utils/verifyAmount.js';
import * as businessesServices from '../services/businessesServices.js';
import * as cardsServices from '../services/cardsServices.js';
import * as paymentsRepository from '../repositories/paymentsRepository.js';
import * as errors from '../errors/index.js';
import bcrypt from 'bcrypt';

interface Payment {
  cardId: number;
  password: string;
  businessId: number;
  amount: number;
}

interface OnlinePayment {
  cardHolderName: string;
  number: string;
  expirationDate: string;
  securityCode: string;
  businessId: number;
  amount: number;
}

export async function readPayments(cardId: number) {
  const payments = await paymentsRepository.findByCardId(cardId);

  return payments;
}

export async function createPayment(payment: Payment) {
  const { cardId, businessId, amount } = payment;

  const business = await businessesServices.getById(businessId);
  const card = await cardsServices.getById(cardId);
  if (business.type !== card.type)
    throw errors.Forbidden("This card isn't allowed in this business.");

  cardsServices.verifyExpirationDate(card);

  verifyAmount(amount);

  await verifyBalance(cardId, amount);

  await paymentsRepository.insert(payment);
}

export async function createOnlinePayment(payment: OnlinePayment) {
  const {
    cardHolderName,
    number,
    expirationDate,
    securityCode,
    businessId,
    amount,
  } = payment;

  const card = await cardsServices.getByCardDetails(
    number,
    cardHolderName,
    expirationDate
  );

  if (card.isBlocked) throw errors.Forbidden('Card is blocked.');

  const isAuthorized = await bcrypt.compare(securityCode, card.securityCode);
  if (!isAuthorized) throw errors.Unauthorized();

  const business = await businessesServices.getById(businessId);
  if (business.type !== card.type)
    throw errors.Forbidden("This card isn't allowed in this business.");

  cardsServices.verifyExpirationDate(card);

  verifyAmount(amount);

  await verifyBalance(card.id, amount);

  const insertData = { cardId: card.id, businessId, amount };
  await paymentsRepository.insert(insertData);
}

export async function verifyBalance(cardId: number, amount: number) {
  const balance = await cardsServices.getBalance(cardId);

  if (amount > balance)
    throw errors.Forbidden(`Insufficient balance.
    Balance: ${balance}`);
}

export async function sumPayments(cardId: number) {
  const payments = await paymentsRepository.findByCardId(cardId);

  const initialValue = 0;
  const sum = payments.reduce(
    (acc, current) => acc + current.amount,
    initialValue
  );

  return sum;
}
