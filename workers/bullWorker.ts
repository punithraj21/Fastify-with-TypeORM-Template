import { Worker } from "bullmq";
import { Repository } from "typeorm";

import { Company } from "../src/entity/Company";
import AppDataSource from "../src/data-source";

const connection = {
  host: "127.0.0.1",
  port: 6379,
};

const worker = new Worker(
  "userDetails",
  async (job) => {
    const companyRepository: Repository<Company> =
      AppDataSource.getRepository(Company);
    const companyDetails = job.data;
    await companyRepository.save({
      Name: companyDetails.companyName,
      Address: companyDetails.address.city,
      Strength: companyDetails.strength,
    });
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} has been completed`);
});

worker.on("failed", (job: any, err) => {
  console.error(`Job ${job.id} has failed with error ${err.message}`);
});
