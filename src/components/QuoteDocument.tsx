import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Quote } from "@/lib/types";
import { computeQuote, rupees, formatDateDots, AGREEMENT_PERCENT, BOOKING_AMOUNT } from "@/lib/calc";

const NAVY = "#10233f";
const GOLD = "#c6952f";
const MUTED = "#64748b";

// `compact` scales every size/spacing down slightly for denser quotes; the
// standard (non-compact) sizing is used by default since a spacer + footer
// stretch the layout to fill the A4 page regardless of content length.
function createStyles(compact: boolean) {
  return StyleSheet.create({
    page: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100%",
      paddingHorizontal: 46,
      paddingVertical: compact ? 34 : 44,
      fontSize: compact ? 9.8 : 10.5,
      color: "#1f2937",
      lineHeight: compact ? 1.3 : 1.45,
    },
    header: {
      borderBottomWidth: 2,
      borderBottomColor: GOLD,
      paddingBottom: compact ? 9 : 12,
      marginBottom: compact ? 12 : 18,
      textAlign: "center",
    },
    eyebrow: {
      fontSize: 8,
      letterSpacing: 3,
      color: GOLD,
      textTransform: "uppercase",
      fontFamily: "Helvetica-Bold",
    },
    title: {
      fontSize: compact ? 14.5 : 16,
      fontFamily: "Helvetica-Bold",
      color: NAVY,
      marginTop: 3,
    },
    subtitle: {
      fontSize: 9.5,
      fontFamily: "Helvetica-Bold",
      color: NAVY,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginTop: 4,
    },
    landlordShare: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      color: NAVY,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginTop: 3,
    },
    metaRow: { fontSize: 9, color: MUTED, marginTop: 5 },
    para: { marginBottom: compact ? 4 : 6 },
    greeting: {
      fontFamily: "Helvetica-Bold",
      color: NAVY,
      fontSize: compact ? 10.5 : 11,
      marginBottom: compact ? 4 : 6,
    },
    detailBox: {
      backgroundColor: "#f4f6fa",
      borderRadius: 6,
      padding: compact ? 9 : 12,
      marginTop: 6,
      marginBottom: compact ? 10 : 14,
      flexDirection: "row",
      flexWrap: "wrap",
    },
    detail: { width: "33%", marginBottom: compact ? 4 : 6 },
    detailK: {
      fontSize: 7.5,
      color: MUTED,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    detailV: { fontSize: compact ? 10.2 : 11, fontFamily: "Helvetica-Bold", color: NAVY },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: compact ? 1.5 : 2.5,
    },
    rowLabel: { flex: 1, paddingRight: 12 },
    rowVal: { fontFamily: "Helvetica-Bold" },
    strongRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: NAVY,
      paddingVertical: compact ? 3.5 : 5,
      marginVertical: compact ? 3.5 : 5,
    },
    strongText: { fontFamily: "Helvetica-Bold", color: NAVY, fontSize: compact ? 10.8 : 11.5 },
    subtotalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: "#d7dce5",
      paddingTop: compact ? 4 : 6,
      marginTop: compact ? 2 : 4,
    },
    subtotalText: {
      fontFamily: "Helvetica-Bold",
      color: NAVY,
      fontSize: compact ? 9.8 : 10.5,
    },
    grandTotalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: NAVY,
      borderRadius: 6,
      paddingVertical: compact ? 7 : 9,
      paddingHorizontal: 12,
      marginTop: compact ? 8 : 10,
    },
    grandTotalLabel: {
      fontFamily: "Helvetica-Bold",
      color: GOLD,
      fontSize: compact ? 8.5 : 9,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    grandTotalText: {
      fontFamily: "Helvetica-Bold",
      color: "#ffffff",
      fontSize: compact ? 12.5 : 13.5,
    },
    sectionTitle: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      color: NAVY,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginTop: compact ? 8 : 12,
      marginBottom: 3,
    },
    terms: {
      borderWidth: 1,
      borderColor: "#f3e6c8",
      backgroundColor: "#fdf8ee",
      borderRadius: 6,
      padding: compact ? 9 : 12,
      marginTop: compact ? 8 : 12,
    },
    muted: { color: MUTED },
    footer: {
      borderTopWidth: 2,
      borderTopColor: GOLD,
      paddingTop: 10,
      textAlign: "center",
    },
    footerText: {
      fontSize: 8,
      color: MUTED,
      letterSpacing: 0.4,
    },
  });
}

export default function QuoteDocument({ quote }: { quote: Quote }) {
  const c = computeQuote(quote);
  const guestName = `${quote.firstName} ${quote.lastName}`.trim();
  const s = createStyles(false);
  return (
    <Document
      title={`SMR VINAY Pvt Ltd - ${quote.quoteNumber}`}
      author="SMR VINAY Pvt Ltd"
    >
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.eyebrow}>QUOTATION</Text>
          <Text style={s.title}>SMR VINAY</Text>
          <Text style={s.landlordShare}>Landlord Share</Text>
          <Text style={s.metaRow}>
            {quote.city}   •   DATE: {formatDateDots(quote.date)}
          </Text>
        </View>

        <Text style={s.subtitle}>Warm Greetings from SMR VINAY Group</Text>
        <Text style={s.greeting}>Dear {guestName || "Prospective Buyer"},</Text>

        <Text style={[s.para, s.muted]}>
          Thank you very much for your interest to purchase a Flat in our
          Premium gated community project “{quote.projectName}”. As per your
          request, we are herewith sharing the details of the Flat chosen by
          you.
        </Text>

        <View style={s.detailBox}>
          <Detail s={s} k="Flat No" v={quote.flatNo} />
          <Detail s={s} k="Extent" v={`${quote.extentSft} Sft, ${quote.bhk}`} />
          <Detail s={s} k="Block" v={quote.block} />
          <Detail s={s} k="Facing" v={quote.facing} />
          <Detail s={s} k="Option" v={quote.paymentOption} />
        </View>

        <Row
          s={s}
          label={`Flat Cost  (@ Rs.${quote.basicRate}/- per Sft.) x ${quote.extentSft}`}
          value={rupees(c.basicCost)}
        />
        {quote.discountPerSft > 0 && (
          <Row
            s={s}
            label={`Discount  (@ Rs.${quote.discountPerSft}/- per Sft)`}
            value={`- ${rupees(c.discountAmount)}`}
            positive
          />
        )}
        <View style={s.strongRow}>
          <Text style={[s.rowLabel, s.strongText]}>FLAT COST</Text>
          <Text style={s.strongText}>{rupees(c.flatCost)}</Text>
        </View>

        {c.registrationCharges.length > 0 && (
          <>
            <Text style={s.sectionTitle}>
              Payable at the time of Registration
            </Text>
            {c.registrationCharges.map((r) => (
              <Row key={r.label} s={s} label={r.label} value={rupees(r.amount)} />
            ))}
            <View style={s.subtotalRow}>
              <Text style={[s.rowLabel, s.subtotalText]}>Subtotal</Text>
              <Text style={s.subtotalText}>{rupees(c.registrationTotal)}</Text>
            </View>
          </>
        )}

        <View style={s.grandTotalRow}>
          <Text style={s.grandTotalLabel}>Grand Total</Text>
          <Text style={s.grandTotalText}>{rupees(c.grandTotal)}</Text>
        </View>

        <View style={s.terms}>
          <Text style={s.para}>
            <Text style={s.rowVal}>Booking Amount</Text>{" "}
            {rupees(BOOKING_AMOUNT)}
          </Text>
          <Text style={s.para}>
            Agreement Amount ({AGREEMENT_PERCENT}% of Flat Cost) i.e{" "}
            <Text style={s.rowVal}>{rupees(c.agreementAmount)}</Text> to be made
            within a month from the date of Booking of Flat.
          </Text>
          <Text style={s.para}>
            Balance {100 - AGREEMENT_PERCENT}% payment to be made as per Loan
            / progress of construction.
          </Text>
          <Text style={[s.muted, { fontSize: 8.5, fontStyle: "italic" }]}>
            * GST + Registration Charges As Applicable.
          </Text>
          <Text style={[s.rowVal, { fontSize: 8.5 }]}>
            FLAT COST IS INCLUSIVE OF ALL AMENITIES
          </Text>
        </View>

        {quote.notes ? (
          <Text style={[s.muted, { marginTop: 8, fontStyle: "italic" }]}>
            {quote.notes}
          </Text>
        ) : null}

        <View style={{ flexGrow: 1 }} />

        <View style={s.footer}>
          <Text style={s.footerText}>
            This is a system-generated quotation from SMR VINAY Group.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

type QuoteStyles = ReturnType<typeof createStyles>;

function Detail({ s, k, v }: { s: QuoteStyles; k: string; v: string }) {
  return (
    <View style={s.detail}>
      <Text style={s.detailK}>{k}</Text>
      <Text style={s.detailV}>{v || "-"}</Text>
    </View>
  );
}

function Row({
  s,
  label,
  value,
  positive,
}: {
  s: QuoteStyles;
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={positive ? [s.rowVal, { color: "#059669" }] : s.rowVal}>
        {value}
      </Text>
    </View>
  );
}
