const STEPS = [
  { step: "01", title: "Choose Your Style", desc: "Indoor, outdoor, hanging, or tabletop — browse our range of premium fiber planters." },
  { step: "02", title: "Select Size & Color", desc: "Each planter comes in multiple sizes and neutral tones. Mix and match to fit your space." },
  { step: "03", title: "Plant & Enjoy", desc: "Delivered in 7 days. UV-protected, weather-resistant. Just add your favourite plant." },
]

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
          <p className="text-gray-600">Three simple steps to transform your space</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#2D6A4F' }}>
                {s.step}
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
