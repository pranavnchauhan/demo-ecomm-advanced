interface TariffNoticeProps {
  countryCode: string
  show: boolean
}

export function TariffNotice({ countryCode, show }: TariffNoticeProps) {
  if (!show || countryCode !== "US") return null

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <p>
        🌏 <span className="font-medium">Important Notice for US Orders:</span> Due to recent
        changes in US import tariff regulations, all shipments to the US are now subject to customs
        duties and taxes upon delivery. These charges are not included in your order total and are
        the responsibility of the buyer. Please factor this into your purchase decision.
      </p>
    </div>
  )
}
