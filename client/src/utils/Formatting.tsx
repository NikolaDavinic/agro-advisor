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

export function getFileName(path: string) {
  const noExtension: string = path.replace(/\.[^/.]+$/, "");
  const fileName = path.substring(noExtension.lastIndexOf(".") + 1);

  return fileName;
}
