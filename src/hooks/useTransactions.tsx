import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsCoxtext =  createContext<TransactionsContextData>({} as TransactionsContextData);

export const TransactionsProvider = ({ children }: TransactionsProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    api.get('transactions')
    .then(response => setTransactions(response.data.transactions));
  }, []);

  const createTransaction = async (transactionInput: TransactionInput ) => {
    const response = await api.post('transactions', {
      ...transactionInput, 
      createdAt: new Date()
    });
    
    const { transaction } = response.data;

    setTransactions([
      ...transactions,
      transaction
    ]);
  }
 

  return (
    <TransactionsCoxtext.Provider value={{transactions, createTransaction}}>
      {children}
    </TransactionsCoxtext.Provider>
  )
}


export const useTransactions = () => useContext(TransactionsCoxtext);


