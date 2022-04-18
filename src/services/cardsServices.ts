import * as repository from '../repositories/cardsRepository.js';
import * as rechargesServices from '../services/rechargesServices.js';
import * as paymentsServices from '../services/paymentsServices.js';
import * as errors from '../errors/index.js';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';

interface Employee {
  id: number;
  fullName: string;
  cpf: string;
  email: string;
  companyId: number;
}

export async function getData(card: repository.Card) {
  const { isVirtual, originalCardId } = card;
  let { id: cardId } = card;

  if (isVirtual) cardId = originalCardId;

  const balance = await getBalance(cardId);
  const transactions = await paymentsServices.listPayments(cardId);
  const recharges = await rechargesServices.listRecharges(cardId);

  const data = {
    balance,
    transactions,
    recharges,
  };

  return data;
}

export async function create(
  employee: Employee,
  cardType: repository.TransactionTypes
) {
  const { id: employeeId, fullName } = employee;

  await verifyType(cardType, employeeId);

  const cardholderName: string = createCardHolderName(fullName);
  const { number, securityCodeHash, expirationDate, securityCode } =
    await createCardInfo();

  const persistedCard = {
    employeeId,
    number,
    cardholderName,
    securityCode: securityCodeHash,
    expirationDate,
    isVirtual: false,
    isBlocked: false,
    type: cardType,
  };

  const {
    rows: [{ id }],
  } = await repository.insert(persistedCard);

  return {
    id,
    employeeId,
    number: number,
    cardholderName,
    securityCode,
    expirationDate,
    type: cardType,
  };
}

export async function createVirtual(card: repository.Card) {
  const {
    employeeId,
    cardholderName,
    password,
    id: originalCardId,
    type,
  } = card;

  const { number, securityCodeHash, expirationDate, securityCode } =
    await createCardInfo();

  const persistedVirtualCard = {
    employeeId,
    number,
    cardholderName,
    securityCode: securityCodeHash,
    password: password,
    expirationDate,
    isVirtual: true,
    isBlocked: false,
    type,
    originalCardId,
  };

  const {
    rows: [{ id }],
  } = await repository.insert(persistedVirtualCard);

  return {
    id,
    employeeId,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    isVirtual: true,
    isBlocked: false,
    type,
    originalCardId,
  };
}

export async function activate(
  securityCode: string,
  password: string,
  card: repository.Card
) {
  const { id: cardId } = card;

  if (password.length !== 4)
    throw errors.UnprocessableEntity('Password must have 4 digits.');

  verifySecurityCode(securityCode, card);
  verifyIfVirtual(card);
  verifyIfInactive(card);
  verifyIfExpired(card);

  const passwordHash = await bcrypt.hash(password, 10);

  const updateCard = {
    password: passwordHash,
  };

  await repository.update(cardId, updateCard);
}

export async function block(card: repository.Card) {
  if (card.isBlocked) throw errors.Forbidden('Card is already blocked.');

  verifyIfExpired(card);

  const update = { isBlocked: true };

  await repository.update(card.id, update);
}

export async function unblock(card: repository.Card) {
  if (!card.isBlocked) throw errors.Forbidden('Card is not blocked.');

  verifyIfExpired(card);

  const update = { isBlocked: false };

  await repository.update(card.id, update);
}

export async function remove(card: repository.Card) {
  if (!card.isVirtual) throw errors.Forbidden(`Can't delete physical cards.`);

  await repository.remove(card.id);
}

export async function getBalance(cardId: number) {
  const recharges = await rechargesServices.sumRecharges(cardId);
  const payments = await paymentsServices.sumPayments(cardId);
  const balance = recharges - payments;

  return balance;
}

export async function getById(cardId: number) {
  if (!cardId || cardId === NaN || cardId % 1 !== 0) throw errors.NotFound();
  const card = await repository.findById(cardId);
  if (!card) throw errors.NotFound();

  return card;
}

export async function getByCardDetails(
  number: string,
  cardholderName: string,
  expirationDate: string
) {
  const card = await repository.findByCardDetails(
    number,
    cardholderName,
    expirationDate
  );
  if (!card) throw errors.NotFound();

  return card;
}

export async function verifyPassword(card: repository.Card, password: string) {
  if (!card.password) throw errors.Unauthorized();

  const passwordValidation = await bcrypt.compare(password, card.password);
  if (!passwordValidation) throw errors.Unauthorized();
}

export async function verifySecurityCode(
  securityCode: string,
  card: repository.Card
) {
  const isAuthorized = await bcrypt.compare(securityCode, card.securityCode);
  if (!isAuthorized) throw errors.Unauthorized();
}

export async function verifyCardId(cardId: number) {
  const card = await repository.findById(cardId);
  if (!card) throw errors.NotFound();
}

export function verifyIfExpired(card: repository.Card) {
  const expirationDate = dayjs(card.expirationDate);
  if (expirationDate.diff() > 0) throw errors.Forbidden('Card is expired.');
}

export function verifyIfVirtual(card: repository.Card) {
  if (card.isVirtual)
    throw errors.Forbidden(`Can't do that with virtual cards.`);
}

export function verifyIfBlocked(card: repository.Card) {
  if (card.isBlocked) throw errors.Forbidden('Card is blocked.');
}

export function verifyIfActive(card: repository.Card) {
  if (!card.password) throw errors.Forbidden('Card is inactive.');
}

export function verifyIfInactive(card: repository.Card) {
  if (card.password) throw errors.Forbidden('Card is active.');
}

async function createCardInfo() {
  const number: string = await createCardNumber();

  const expirationDate = dayjs().add(5, 'years').format('MM/YY');

  const securityCode = faker.finance.creditCardCVV();
  const securityCodeHash = await bcrypt.hash(securityCode, 10);
  return { number, securityCodeHash, expirationDate, securityCode };
}

async function createCardNumber() {
  let isCardNumberUnique: repository.Card;
  let cardNumber = '';

  do {
    cardNumber = faker.finance.creditCardNumber('mastercard');
    isCardNumberUnique = await repository.findByNumber(cardNumber);
  } while (isCardNumberUnique);

  return cardNumber;
}

async function verifyType(
  cardType: repository.TransactionTypes,
  employeeId: number
) {
  const transactionTypes = [
    'groceries',
    'restaurant',
    'transport',
    'education',
    'health',
  ];

  if (!transactionTypes.includes(cardType))
    throw errors.Forbidden('Invalid card type.');

  const doesCardExist = await repository.findByTypeAndEmployeeId(
    cardType,
    employeeId
  );
  if (doesCardExist) {
    const article = cardType[0] === 'e' ? 'an' : 'a';
    throw errors.Conflict(`Employee already owns ${article} ${cardType} card.`);
  }
}

function createCardHolderName(name: string): string {
  const splitName = name.split(' ');
  const firstName = splitName.shift() + ' ';
  const lastName = splitName.pop();

  const middleNames = splitName.filter((middlename) => middlename.length >= 3);

  let middleNamesInitial = middleNames
    .map((middlename) => middlename[0])
    .join(' ');

  if (middleNamesInitial.length > 0) middleNamesInitial += ' ';

  const cardHolderName =
    `${firstName}${middleNamesInitial}${lastName}`.toUpperCase();

  return cardHolderName;
}
