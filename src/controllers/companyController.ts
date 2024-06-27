import { Repository } from "typeorm";

import { Company } from "../entity/Company";
import { AppDataSource } from "../data-source";

export const createCompany = async (req, res) => {
  const companyRepository: Repository<Company> =
    AppDataSource.getRepository(Company);

  console.log("Inserting a new company into the database...");

  const company = new Company();
  company.Name = req.params.name;
  company.Address = "Bangalore";
  company.Strength = 25;

  await companyRepository.save(company);
  console.log("Saved a new company with id: " + company.id);

  res.send(company);
};
