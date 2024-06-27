import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum PaymentMethod {
  CREDIT = "credit",
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
}

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  InvoiceNumber: string;

  @Column()
  TotalAmount: string;

  @Column({
    type: "enum",
    enum: ["Paid", "Unpaid"],
    default: "Unpaid",
  })
  PaymentStatus: string;

  @Column({
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  PaymentMethod: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  CreatedAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
