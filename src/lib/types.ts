export type QuoteStatus = "Draft" | "Accepted" | "Rejected";

export interface Quote {
  _id?: string;
  quoteNumber: string; // e.g. SMR-0001
  status: QuoteStatus;
  date: string; // ISO date (yyyy-mm-dd)
  city: string; // Kondapur, Hyderabad
  projectName: string; // SMR VINAY

  // Guest details
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;

  // Flat details
  flatId?: string; // "{block}-{flatNo}", links to the vacant plot's _id
  flatNo: string;
  extentSft: number;
  bhk: string; // "3 BHK"
  block: string;
  facing: string; // East / West / North / South
  paymentOption: string; // Loan / Outright

  // Cost rates
  basicRate: number; // per sft — fixed by tower (LOGAN 9999 / HAMILTON 10499)
  discountPerSft: number; // per sft (0 = no discount, hidden on the printed quote)

  // Signatory (fixed, printed directly — not editable in the form)
  signatoryName: string;
  signatoryTitle: string;

  notes?: string;

  createdAt?: string;
  updatedAt?: string;
}

export type QuoteInput = Omit<
  Quote,
  "_id" | "quoteNumber" | "createdAt" | "updatedAt"
> & { quoteNumber?: string };

export const emptyQuote: QuoteInput = {
  status: "Draft",
  date: new Date().toISOString().slice(0, 10),
  city: "Kondapur, Hyderabad",
  projectName: "SMR VINAY",

  firstName: "",
  lastName: "",
  phone: "",
  address: "",

  flatId: "",
  flatNo: "",
  extentSft: 0,
  bhk: "",
  block: "",
  facing: "",
  paymentOption: "Loan",

  basicRate: 0,
  discountPerSft: 0,

  signatoryName: "ASRK REDDY",
  signatoryTitle: "EXECUTIVE DIRECTOR",

  notes: "",
};
