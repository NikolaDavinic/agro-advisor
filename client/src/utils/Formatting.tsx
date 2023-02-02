export function FormatCurrency(amount: number, currency: string) {
  return (
    <>
      {amount < 0 ? "-" : "+"}
      <strong> {currency}</strong> {Math.abs(amount).toLocaleString()}
    </>
  );
}

export function shortenText(text: string, number: number) {
  return text.length > number ? `${text.slice(0, number)}...` : text;
}
