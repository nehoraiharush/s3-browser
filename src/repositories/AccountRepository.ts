import type { Account, AccountRepository } from '../types/account';

const STORAGE_KEY = 's3-browser-accounts';

export class LocalAccountRepository implements AccountRepository {
  async getAll(): Promise<Account[]> {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async getById(id: string): Promise<Account | null> {
    const accounts = await this.getAll();
    return accounts.find((a) => a.id === id) || null;
  }

  async add(account: Omit<Account, 'id'>): Promise<Account> {
    const accounts = await this.getAll();
    const newAccount: Account = {
      ...account,
      id: crypto.randomUUID(),
    };
    accounts.push(newAccount);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    return newAccount;
  }

  async update(account: Account): Promise<void> {
    const accounts = await this.getAll();
    const index = accounts.findIndex((a) => a.id === account.id);
    if (index !== -1) {
      accounts[index] = account;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    }
  }

  async delete(id: string): Promise<void> {
    const accounts = await this.getAll();
    const filtered = accounts.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
}
