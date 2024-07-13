import { Repository } from "typeorm";

import { Company } from "../entity/Company";
import { AppDataSource } from "../data-source";

export const createCompany = async (server, req, res) => {
  // const companyRepository: Repository<Company> =
  //   AppDataSource.getRepository(Company);
  server.io.emit("messageFromServer1", "Hello");
  // const company = await companyRepository.save(req.body);

  res.send("company");
};
