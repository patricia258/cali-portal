const sanitizeFilenamePart = (value) => String(value ?? "")
  .normalize("NFKC")
  .replace(/[<>:"/\\|?*\u0000-\u001F]/g, " ")
  .replace(/\s+/g, " ")
  .replace(/[. ]+$/g, "")
  .trim();

export function proposalPdfBaseName({ serviceName, contactName, companyName, protocol }) {
  const contact = sanitizeFilenamePart(contactName);
  const company = sanitizeFilenamePart(companyName);
  const clientParts = [contact];
  if (company && company.toLocaleLowerCase("pt-BR") !== contact.toLocaleLowerCase("pt-BR")) clientParts.push(company);

  return [
    "Proposta CALI RH",
    sanitizeFilenamePart(serviceName),
    clientParts.filter(Boolean).join(" e "),
    sanitizeFilenamePart(protocol),
  ].filter(Boolean).join(" - ");
}

export function proposalPdfFileName(data) {
  return `${proposalPdfBaseName(data)}.pdf`;
}
