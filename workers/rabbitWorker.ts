import amqp from "amqplib";
import { Repository } from "typeorm";
import { Company } from "../src/entity/Company";
import AppDataSource from "../src/data-source";

const queue = "companyDetails";
const rabbitmqUrl = "amqp://guest:guest@localhost:5672";

const startWorker = async () => {
  try {
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {
      durable: true,
    });

    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, async (msg) => {
      try {
        if (msg !== null) {
          const messageContent = msg.content.toString();

          const companyRepository: Repository<Company> =
            AppDataSource.getRepository(Company);
          const companyDetails = JSON.parse(messageContent);

          //   await companyRepository.save({
          //     Name: companyDetails.companyName,
          //     Address: companyDetails.address.city,
          //     Strength: companyDetails.strength,
          //   });

          channel.ack(msg);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });
  } catch (error) {
    console.error("Error starting RabbitMQ worker:", error);
  }
};

startWorker().catch((error) => console.error("Error in worker:", error));
