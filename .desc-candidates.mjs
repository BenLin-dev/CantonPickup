const cand = {
  home: "English-speaking private driver and airport transfer in Guangzhou. Baiyun Airport (CAN) pickup, half or full day drivers, fixed prices, no hidden fees.",
  airportTransfer: "Guangzhou Baiyun Airport (CAN) pickup by English-speaking driver. Flight monitoring, meet & greet with a name sign, 60 minutes free waiting.",
  cantonFairTransfer: "Canton Fair 2026 & 2027 private driver — hotel, airport or the Pazhou complex, April and October sessions. Fixed price per vehicle, English-speaking driver.",
  privateDriver: "Hire an English-speaking private driver in Guangzhou by the half day, full day or multi-day. Fuel, tolls, parking and vehicle included, hourly or daily.",
  multiDaySourcingTour: "Multi-day private driver for sourcing trips in Guangzhou, Foshan and the Delta. Same driver and vehicle for three to ten days at a discounted daily rate.",
  vehiclesPricing: "Our fleet and transparent Guangzhou car hire prices. Sedan airport pickup from $57, seven-seat MPV from $77, half-day from $97 per vehicle, all in USD.",
  factoryVisits: "Private driver for factory visits and sourcing trips in Guangzhou and Foshan. See several suppliers in one day with a driver who knows the districts.",
  about: "CantonPickup is a small local team based in Baiyun District, Guangzhou, providing safe, reliable transport and local support for international visitors.",
  intercityTransfer: "Fixed-price intercity transfer from Guangzhou to Foshan, Shenzhen, Dongguan, Zhongshan, Zhuhai and Huizhou. Flat rate per vehicle, tolls included.",
  faqs: "Answers about Guangzhou airport transfers, private drivers, factory visits, Canton Fair transport, visa-free transit, pricing, payment and booking.",
  blog: "Practical guides for buyers and business travellers in Guangzhou: wholesale markets, factory clusters, airport arrival, the Canton Fair and etiquette.",
  terms: "The terms that apply to airport transfers, private driver hire and factory visit transport booked with CantonPickup — payment, cancellation and liability.",
  contact: "Get a fast quote for Guangzhou airport transfers, private drivers and factory visits. WhatsApp, WeChat or email — we reply within 30 minutes.",
  privacy: "How CantonPickup collects, uses and protects the personal information you share when you request a quote or book an airport transfer in Guangzhou.",
  foshan: "Door-to-door private car between Guangzhou and Foshan from $57 per vehicle with an English-speaking driver, for factory visits and business trips.",
  shenzhen: "Private car between Guangzhou and Shenzhen. Fixed price from $137 per vehicle with an English-speaking driver, tolls and parking included, both directions.",
  dongguan: "Private car between Guangzhou and Dongguan. Fixed price from $97 per vehicle with an English-speaking driver, tolls and parking included, both directions.",
  zhongshan: "Private car between Guangzhou and Zhongshan. Fixed price from $127 per vehicle with an English-speaking driver, tolls and parking included, both directions.",
  zhuhai: "Private car between Guangzhou and Zhuhai. Fixed price from $147 per vehicle with an English-speaking driver, tolls and parking included, both directions.",
  huizhou: "Private car between Guangzhou and Huizhou. Fixed price from $157 per vehicle with an English-speaking driver, tolls and parking included, both directions.",
}

let over = 0
for (const [k, v] of Object.entries(cand)) {
  const n = v.length
  const flag = n > 155 ? '  <<< OVER' : n < 70 ? '  <<< SHORT' : ''
  if (flag) over++
  console.log(String(n).padStart(3) + '  ' + k + flag)
}
console.log('\nover/short(155 cap): ' + over)
