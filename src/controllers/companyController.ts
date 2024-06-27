import { Repository } from "typeorm";

import { Company } from "../entity/Company";
import { AppDataSource } from "../data-source";

export const createCompany = async (req, res) => {
  const companyRepository: Repository<Company> =
    AppDataSource.getRepository(Company);

  console.log("Inserting a new company into the database...");

  const company = await companyRepository.save(req.body);

  res.send(company);
};
