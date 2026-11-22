import { useFinance } from '../hooks/useFinance';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

let nextId = Date.now();

export default function TransactionsPage() {
  const { transactions, dispatch } = useFinance();

  const handleSubmit = (data) => {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: { id: `tx-${++nextId}`, ...data },
    });
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-white">Transactions</h1>
      <TransactionForm onSubmit={handleSubmit} />
      <TransactionList transactions={transactions} onDelete={handleDelete} />
    </div>
  );
}
