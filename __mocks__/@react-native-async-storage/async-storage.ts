// Mock manual do AsyncStorage para os testes.
// Simula o comportamento real usando um Map em memória.
// O Jest vai usar esse arquivo automaticamente no lugar da lib real.

const storage = new Map<string, string>();

const AsyncStorage = {
  setItem: jest.fn((key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve();
  }),
  getItem: jest.fn((key: string) => {
    return Promise.resolve(storage.get(key) ?? null);
  }),
  removeItem: jest.fn((key: string) => {
    storage.delete(key);
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    storage.clear();
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => {
    return Promise.resolve(Array.from(storage.keys()));
  }),
};

export default AsyncStorage;
