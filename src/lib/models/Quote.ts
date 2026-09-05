import mongoose, { Schema, model, models } from "mongoose";

/** _id is the quoteNumber (e.g. "SMR-0001"), not an auto-generated ObjectId. */
const QuoteSchema = new Schema(
  {
    _id: { type: String, required: true },
    quoteNumber: { type: String, required: true },
    status: { type: String, enum: ["Draft", "Accepted", "Rejected"], default: "Draft" },
    date: { type: String, required: true },
    city: { type: String, default: "Kondapur, Hyderabad" },
    projectName: { type: String, default: "SMR VINAY" },

    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },

    flatId: { type: String, default: "" },
    flatNo: { type: String, default: "" },
    extentSft: { type: Number, default: 0 },
    bhk: { type: String, default: "" },
    block: { type: String, default: "" },
    facing: { type: String, default: "" },
    paymentOption: { type: String, default: "Loan" },

    basicRate: { type: Number, default: 0 },
    discountPerSft: { type: Number, default: 0 },

    signatoryName: { type: String, default: "" },
    signatoryTitle: { type: String, default: "" },

    notes: { type: String, default: "" },
  },
  { _id: false, versionKey: false, timestamps: true },
);

/** Generates the next sequential quote number (SMR-0001, SMR-0002, ...). */
export async function nextQuoteNumber(): Promise<string> {
  const last = await QuoteModel.findOne({}, { _id: 1 })
    .sort({ createdAt: -1 })
    .lean<{ _id?: string } | null>();
  let n = 0;
  if (last?._id) {
    const m = last._id.match(/(\d+)$/);
    if (m) n = parseInt(m[1], 10);
  }
  return `SMR-${String(n + 1).padStart(4, "0")}`;
}

export const QuoteModel =
  (models.Quote as mongoose.Model<mongoose.InferSchemaType<typeof QuoteSchema>>) ||
  model("Quote", QuoteSchema);
