export interface Account {
  id: string;
  name: string; // Display Name
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string; // Optional custom endpoint (e.g., http://localhost:4568)
  region?: string; // Optional region
}

export interface AccountRepository {
  getAll(): Promise<Account[]>;
  getById(id: string): Promise<Account | null>;
  add(account: Omit<Account, 'id'>): Promise<Account>;
  update(account: Account): Promise<void>;
  delete(id: string): Promise<void>;
}
