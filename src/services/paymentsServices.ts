import verifyAmount from '../utils/verifyAmount.js';
import * as businessesServices from '../services/businessesServices.js';
import * as cardsServices from '../services/cardsServices.js';
import * as paymentsRepository from '../repositories/paymentsRepository.js';
import * as errors from '../errors/index.js';
import { Card } from '../repositories/cardsRepository.js';

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

export async function listPayments(cardId: number) {
  const payments = await paymentsRepository.findByCardId(cardId);

  return payments;
}

export async function pay(payment: Payment, card: Card) {
  const { cardId, businessId, amount } = payment;

  cardsServices.verifyIfBlocked(card);
  cardsServices.verifyIfExpired(card);
  cardsServices.verifyIfVirtual(card);
  await verifyBusinessType(businessId, card);
  verifyAmount(amount);
  await verifyBalance(cardId, amount);

  await paymentsRepository.insert(payment);
}

export async function onlinePay(payment: OnlinePayment) {
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

  cardsServices.verifyIfBlocked(card);
  cardsServices.verifyIfExpired(card);
  await cardsServices.verifySecurityCode(securityCode, card);
  verifyAmount(amount);
  await verifyBusinessType(businessId, card);

  if (card.isVirtual) card.id = card.originalCardId;

  await verifyBalance(card.id, amount);

  const insertData = { cardId: card.id, businessId, amount };
  await paymentsRepository.insert(insertData);
}

export async function verifyBalance(cardId: number, amount: number) {
  const balance = await cardsServices.getBalance(cardId);

  if (amount > balance)
    throw errors.Forbidden(`Insufficient balance.
    Current balance: ${balance}`);
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

async function verifyBusinessType(businessId: number, card: Card) {
  const business = await businessesServices.getById(businessId);
  if (business.type !== card.type)
    throw errors.Forbidden("This card isn't allowed in this business.");
}
