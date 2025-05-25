export default function formatCurrency(
    amount: number,
    style: "decimal" | "currency" = "currency"
) {
    return new Intl.NumberFormat("id-ID", {
        style: style,
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);
}
