import * as repository from '../repositories/cardRepository.js';
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

interface Company {
  id: number;
  name: string;
  apiKey: string;
}

export async function createCard(
  employee: Employee,
  company: Company,
  cardType: repository.TransactionTypes
) {
  const { id: employeeId, fullName, cpf, email, companyId } = employee;

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

  if (doesCardExist) throw errors.Conflict(`Employee's ${cardType} card`);

  const cardNumber: string = await generateCardNumber();

  const cardholderName: string = generateCardHolderName(employee.fullName);

  const securityCode = faker.finance.creditCardCVV();
  const securityCodeHashed = await bcrypt.hash(securityCode, 10);

  const expirationDate = dayjs().add(5, 'years').format('MM/YY');

  const persistedCard = {
    employeeId,
    number: cardNumber,
    cardholderName,
    securityCode: securityCodeHashed,
    expirationDate,
    isVirtual: false,
    isBlocked: false,
    type: cardType,
  };

  const {
    rows: [{ id: cardId }],
  } = await repository.insert(persistedCard);

  return {
    id: cardId,
    employeeId,
    number: cardNumber,
    cardholderName,
    securityCode,
    expirationDate,
    type: cardType,
  };
}

async function generateCardNumber() {
  let isCardNumberUnique: repository.Card;
  let cardNumber = '';

  do {
    cardNumber = faker.finance.creditCardNumber('mastercard');
    isCardNumberUnique = await repository.findByNumber(cardNumber);
  } while (isCardNumberUnique);

  return cardNumber;
}

function generateCardHolderName(name: string): string {
  const splitName = name.split(' ');
  const firstName = splitName[0] + ' ';
  const lastName = splitName[splitName.length - 1];

  let middleNames = splitName.slice(1, splitName.length - 1);
  middleNames = middleNames.filter((middlename) => middlename.length >= 3);

  let middleNamesInitial = middleNames
    .map((middlename) => middlename[0])
    .join(' ');

  if (middleNamesInitial.length > 0) middleNamesInitial += ' ';

  const cardHolderName =
    `${firstName}${middleNamesInitial}${lastName}`.toUpperCase();

  return cardHolderName;
}
