import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Account, AccountRepository } from '../types/account';
import { LocalAccountRepository } from '../repositories/AccountRepository';

interface AccountContextType {
  accounts: Account[];
  activeAccount: Account | null;
  isLoading: boolean;
  addAccount: (account: Omit<Account, 'id'>) => Promise<void>;
  updateAccount: (account: Account) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  selectAccount: (id: string) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

const repository: AccountRepository = new LocalAccountRepository();

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await repository.getAll();
      setAccounts(data);
      // Restore active account from session/local if desired, or just first one
      if (data.length > 0 && !activeAccount) {
         // Optionally auto-select first one, or leave null
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const addAccount = async (accountData: Omit<Account, 'id'>) => {
    const newAccount = await repository.add(accountData);
    setAccounts(prev => [...prev, newAccount]);
    // Auto-select if it's the first one
    if (!activeAccount) {
      setActiveAccount(newAccount);
    }
  };

  const updateAccount = async (account: Account) => {
    await repository.update(account);
    setAccounts(prev => prev.map(a => a.id === account.id ? account : a));
    if (activeAccount?.id === account.id) {
      setActiveAccount(account);
    }
  };

  const deleteAccount = async (id: string) => {
    await repository.delete(id);
    setAccounts(prev => prev.filter(a => a.id !== id));
    if (activeAccount?.id === id) {
      setActiveAccount(null);
    }
  };

  const selectAccount = (id: string) => {
    const account = accounts.find(a => a.id === id);
    setActiveAccount(account || null);
  };

  return (
    <AccountContext.Provider value={{
      accounts,
      activeAccount,
      isLoading,
      addAccount,
      updateAccount,
      deleteAccount,
      selectAccount
    }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
