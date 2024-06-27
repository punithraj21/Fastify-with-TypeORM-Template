import { Repository } from "typeorm";

import { AppDataSource } from "../data-source";
import { Invoice, PaymentMethod } from "../entity/Invoice";

export const createInvoice = async (req, res) => {
  const invoiceRepository: Repository<Invoice> =
    AppDataSource.getRepository(Invoice);

  try {
    const sampleInvoices = [
      {
        InvoiceNumber: "INV-1001",
        TotalAmount: "1500",
        PaymentStatus: "Paid",
        PaymentMethod: PaymentMethod.CASH,
        CreatedAt: new Date("2024-06-01T10:00:00Z"),
        updatedAt: new Date("2024-06-01T10:00:00Z"),
      },
      {
        InvoiceNumber: "INV-1002",
        TotalAmount: "2500",
        PaymentStatus: "Unpaid",
        PaymentMethod: PaymentMethod.CREDIT,
        CreatedAt: new Date("2024-06-15T10:00:00Z"),
        updatedAt: new Date("2024-06-15T10:00:00Z"),
      },
      {
        InvoiceNumber: "INV-1003",
        TotalAmount: "3500",
        PaymentStatus: "Paid",
        PaymentMethod: PaymentMethod.BANK_TRANSFER,
        CreatedAt: new Date("2024-04-01T10:00:00Z"),
        updatedAt: new Date("2024-04-01T10:00:00Z"),
      },
      {
        InvoiceNumber: "INV-1004",
        TotalAmount: "4500",
        PaymentStatus: "Unpaid",
        PaymentMethod: PaymentMethod.CASH,
        CreatedAt: new Date("2024-05-15T10:00:00Z"),
        updatedAt: new Date("2024-05-15T10:00:00Z"),
      },
      {
        InvoiceNumber: "INV-1005",
        TotalAmount: "5500",
        PaymentStatus: "Paid",
        PaymentMethod: PaymentMethod.CREDIT,
        CreatedAt: new Date("2023-03-01T10:00:00Z"),
        updatedAt: new Date("2023-03-01T10:00:00Z"),
      },
    ];

    // for (const invoiceData of sampleInvoices) {
    //   const newInvoice = invoiceRepository.create(invoiceData);
    //   await invoiceRepository.save(newInvoice);
    // }

    const newInvoice = invoiceRepository.create(req.body);

    await invoiceRepository.save(newInvoice);

    return res.send({
      success: true,
      message: "Invoice saved successfully...",
      data: newInvoice,
    });
  } catch (err) {
    console.log("err: ", err);
    return res.send({
      success: false,
      message: err.message,
    });
  }
};

export const getDashboardInvoices = async (req, res) => {
  const invoiceRepository: Repository<Invoice> =
    AppDataSource.getRepository(Invoice);

  try {
    // Daily Aggregation
    const dailyData = await invoiceRepository
      .createQueryBuilder("invoice")
      .select("DATE_TRUNC('day', invoice.CreatedAt)::date", "date")
      .addSelect("SUM(CAST(invoice.TotalAmount AS NUMERIC))", "totalAmount")
      .groupBy("DATE_TRUNC('day', invoice.CreatedAt)")
      .orderBy("DATE_TRUNC('day', invoice.CreatedAt)")
      .getRawMany();

    // Weekly Aggregation (Monday to Sunday)
    const weeklyData = await invoiceRepository
      .createQueryBuilder("invoice")
      .select("DATE_TRUNC('week', invoice.CreatedAt)::date", "week")
      .addSelect("SUM(CAST(invoice.TotalAmount AS NUMERIC))", "totalAmount")
      .groupBy("DATE_TRUNC('week', invoice.CreatedAt)")
      .orderBy("DATE_TRUNC('week', invoice.CreatedAt)")
      .getRawMany();

    // Monthly Aggregation
    const monthlyData = await invoiceRepository
      .createQueryBuilder("invoice")
      .select("DATE_TRUNC('month', invoice.CreatedAt)::date", "month")
      .addSelect("SUM(CAST(invoice.TotalAmount AS NUMERIC))", "totalAmount")
      .groupBy("DATE_TRUNC('month', invoice.CreatedAt)")
      .orderBy("DATE_TRUNC('month', invoice.CreatedAt)")
      .getRawMany();

    console.log("Daily Data:", dailyData);
    console.log("Weekly Data:", weeklyData);
    console.log("Monthly Data:", monthlyData);

    return res.send({
      success: true,
      message: "Invoice saved successfully...",
      data: {
        daily: dailyData.map((data) => ({
          x: data.date.toISOString().split("T")[0],
          y: parseFloat(data.totalAmount),
        })),
        weekly: weeklyData.map((data) => ({
          x: data.week.toISOString().split("T")[0],
          y: parseFloat(data.totalAmount),
        })),
        monthly: monthlyData.map((data) => ({
          x: data.month.toISOString().split("T")[0],
          y: parseFloat(data.totalAmount),
        })),
      },
    });
  } catch (err) {
    console.log("err: ", err);
    return res.send({
      success: false,
      message: err.message,
    });
  }
};
