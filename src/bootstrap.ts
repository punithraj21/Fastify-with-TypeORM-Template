import { AppDataSource } from "./data-source";

export const app = async () => {
  // Initialize TypeORM
  await AppDataSource.initialize();
};
