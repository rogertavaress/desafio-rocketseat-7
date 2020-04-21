import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import {
  Container,
  CardContainer,
  Card,
  TableContainer,
  ButtonArrow,
} from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [orderBy, setOrderBy] = useState({
    title: '',
    orientation: 'cresc',
  });

  useEffect(() => {
    api.get('/transactions').then(response => {
      const { data } = response;
      const transactionsData = data.transactions.map(
        (transaction: Transaction) => {
          return {
            ...transaction,
            formattedDate: formatDate(transaction.created_at),
            formattedValue:
              transaction.type === 'income'
                ? `${formatValue(transaction.value)}`
                : `- ${formatValue(transaction.value)}`,
          };
        },
      );

      const balanceData: Balance = {
        income: formatValue(data.balance.income) || 'R$ 0,00',
        outcome: formatValue(data.balance.outcome) || 'R$ 0,00',
        total: formatValue(data.balance.total) || 'R$ 0,00',
      };

      setTransactions(transactionsData);
      setBalance(balanceData);
    });
  }, []);

  const byTitle = async (value: 'cresc' | 'decr'): Promise<Transaction[]> => {
    const newTransactionOrder = await transactions.sort(
      (a: Transaction, b: Transaction) => {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        // a must be equal to b
        return 0;
      },
    );
    if (value === 'cresc') {
      return newTransactionOrder;
    }
    return newTransactionOrder.reverse();
  };

  const byPrice = async (value: 'cresc' | 'decr'): Promise<Transaction[]> => {
    const newTransactionOrder = await transactions.sort(
      (a: Transaction, b: Transaction) => {
        if (a.value > b.value) {
          return 1;
        }
        if (a.value < b.value) {
          return -1;
        }
        // a must be equal to b
        return 0;
      },
    );
    if (value === 'cresc') {
      return newTransactionOrder;
    }
    return newTransactionOrder.reverse();
  };

  const byCategory = async (
    value: 'cresc' | 'decr',
  ): Promise<Transaction[]> => {
    const newTransactionOrder = await transactions.sort(
      (a: Transaction, b: Transaction) => {
        if (a.category.title > b.category.title) {
          return 1;
        }
        if (a.category.title < b.category.title) {
          return -1;
        }
        // a must be equal to b
        return 0;
      },
    );
    if (value === 'cresc') {
      return newTransactionOrder;
    }
    return newTransactionOrder.reverse();
  };

  const byDate = async (value: 'cresc' | 'decr'): Promise<Transaction[]> => {
    const newTransactionOrder = await transactions.sort(
      (a: Transaction, b: Transaction) => {
        if (a.created_at > b.created_at) {
          return 1;
        }
        if (a.created_at < b.created_at) {
          return -1;
        }
        // a must be equal to b
        return 0;
      },
    );
    if (value === 'cresc') {
      return newTransactionOrder;
    }
    return newTransactionOrder.reverse();
  };

  const handleOrderBy = async (title: string): Promise<void> => {
    let newOrder: Transaction[] = [];
    if (title === 'Título') {
      if (orderBy.title !== title) {
        newOrder = await byTitle('cresc');
        setOrderBy({ title, orientation: 'cresc' });
      } else {
        newOrder = await byTitle(
          orderBy.orientation === 'cresc' ? 'decr' : 'cresc',
        );
        setOrderBy({
          title,
          orientation: orderBy.orientation === 'cresc' ? 'decr' : 'cresc',
        });
      }
    }
    if (title === 'Preço') {
      if (orderBy.title !== title) {
        newOrder = await byPrice('cresc');
        setOrderBy({ title, orientation: 'cresc' });
      } else {
        newOrder = await byPrice(
          orderBy.orientation === 'cresc' ? 'decr' : 'cresc',
        );
        setOrderBy({
          title,
          orientation: orderBy.orientation === 'cresc' ? 'decr' : 'cresc',
        });
      }
    }
    if (title === 'Categoria') {
      if (orderBy.title !== title) {
        newOrder = await byCategory('cresc');
        setOrderBy({ title, orientation: 'cresc' });
      } else {
        newOrder = await byCategory(
          orderBy.orientation === 'cresc' ? 'decr' : 'cresc',
        );
        setOrderBy({
          title,
          orientation: orderBy.orientation === 'cresc' ? 'decr' : 'cresc',
        });
      }
    }
    if (title === 'Data') {
      if (orderBy.title !== title) {
        newOrder = await byDate('cresc');
        setOrderBy({ title, orientation: 'cresc' });
      } else {
        newOrder = await byDate(
          orderBy.orientation === 'cresc' ? 'decr' : 'cresc',
        );
        setOrderBy({
          title,
          orientation: orderBy.orientation === 'cresc' ? 'decr' : 'cresc',
        });
      }
    }

    await setTransactions(newOrder);
  };

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>
                  Título
                  <ButtonArrow
                    type="button"
                    id="Título"
                    onClick={() => handleOrderBy('Título')}
                    buttonSelected={orderBy}
                  >
                    <FiChevronDown size={14} />
                  </ButtonArrow>
                </th>
                <th>
                  Preço
                  <ButtonArrow
                    type="button"
                    id="Preço"
                    onClick={() => handleOrderBy('Preço')}
                    buttonSelected={orderBy}
                  >
                    <FiChevronDown size={14} />
                  </ButtonArrow>
                </th>
                <th>
                  Categoria
                  <ButtonArrow
                    type="button"
                    id="Categoria"
                    onClick={() => handleOrderBy('Categoria')}
                    buttonSelected={orderBy}
                  >
                    <FiChevronDown size={14} />
                  </ButtonArrow>
                </th>
                <th>
                  Data
                  <ButtonArrow
                    type="button"
                    id="Data"
                    onClick={() => handleOrderBy('Data')}
                    buttonSelected={orderBy}
                  >
                    <FiChevronDown size={14} />
                  </ButtonArrow>
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions &&
                transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.formattedValue}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
