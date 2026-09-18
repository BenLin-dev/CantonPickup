/**
 * Page copy and per-page SEO metadata.
 * Text follows the approved layout reference (`布局以及文案.png` / `页面布局.txt`).
 */

export const pages = {
  home: {
    path: '/',
    title: 'CantonPickup | Guangzhou & Foshan Airport Transfers & Private Driver',
    description:
      'English-speaking private driver and airport transfer service in Guangzhou and Foshan. Baiyun Airport pickup, Guangzhou South Station transfers, full-day private drivers and factory visit transport. Fixed prices, no hidden fees.',
    keywords: 'guangzhou airport transfer, private driver guangzhou, guangzhou to foshan private transfer',
    h1: 'Your Ride in Foshan Made Simple',
    lead:
      'Airport transfers, private drivers and factory visits. Reliable, safe and easy — so you can focus on what matters.',
  },

  airportTransfer: {
    path: '/airport-transfer',
    title: 'Guangzhou Baiyun Airport Transfer & Pickup | CantonPickup',
    description:
      'Book a Guangzhou Baiyun Airport (CAN) transfer or pickup with an English-speaking driver. Flight monitoring, meet & greet with a name sign, free waiting time and fixed prices to Foshan and Guangzhou.',
    keywords:
      'guangzhou airport transfer, guangzhou airport pickup, guangzhou baiyun airport transfer, baiyun airport transfer, CAN airport transfer, guangzhou arrival transfer, guangzhou south station pickup',
    h1: "From Airport to Foshan — We've Got You",
    lead: 'On-time pickups, flight monitoring, and a friendly driver waiting for you.',
  },

  privateDriver: {
    path: '/private-driver',
    title: 'Private Driver in Guangzhou & Foshan — Half Day & Full Day | CantonPickup',
    description:
      'Hire an English-speaking private driver in Guangzhou or Foshan by the half day, full day or multi-day. Fuel, tolls, parking and a comfortable vehicle included. Flexible itineraries for business and sourcing trips.',
    keywords:
      'private driver guangzhou, guangzhou private driver, private driver foshan, english speaking driver guangzhou, full day private driver guangzhou, full day private driver foshan, private driver in china',
    h1: 'Your Own Driver When You Need One',
    lead:
      'Flexible hourly and daily private driver service in Guangzhou and Foshan — for business, meetings, or your own schedule.',
  },

  factoryVisits: {
    path: '/factory-visits',
    title: 'Factory Visit Transport in Foshan & Guangzhou | CantonPickup',
    description:
      'Private driver and transport for factory visits and sourcing trips in Foshan, Guangzhou and the Pearl River Delta. Visit several factories in one day with an English-speaking driver who knows the area.',
    keywords:
      'private driver for factory visits guangzhou, private driver for foshan factory visits, foshan sourcing trip private driver, private driver foshan',
    h1: 'Visit Factories with Confidence',
    lead: 'We arrange transport and coordinate your factory visits in Foshan and nearby areas.',
  },

  vehiclesPricing: {
    path: '/vehicles-pricing',
    title: 'Vehicles & Pricing — Sedan and MPV Hire | CantonPickup',
    description:
      'See our fleet and transparent Guangzhou & Foshan car hire prices. Sedan airport pickup from $57, seven-seat MPV from $77, half-day hire from $97 and full-day hire from $187 per vehicle.',
    keywords:
      'guangzhou car hire with driver, guangzhou mpv hire, foshan airport transfer price, guangzhou airport transfer price',
    h1: 'The Right Vehicle for Your Trip',
    lead: 'From sedan transfers to larger groups, we have the right vehicle for you.',
  },

  about: {
    path: '/about',
    title: 'About Us — A Local Team in Foshan | CantonPickup',
    description:
      'CantonPickup is a small, friendly local team based in Foshan providing safe, reliable transport and local support for international visitors and business travellers in the Pearl River Delta.',
    keywords: 'english speaking driver guangzhou, private driver in china, cantonpickup',
    h1: 'A Local Team You Can Count On',
    lead:
      "We're a small, friendly team based in Foshan, with a focus on providing safe and reliable transportation and local support for international visitors.",
  },

  faqs: {
    path: '/faqs',
    title: 'Frequently Asked Questions | CantonPickup',
    description:
      'Answers to common questions about Guangzhou and Foshan airport transfers, private drivers, factory visit transport, pricing, payment and booking with CantonPickup.',
    keywords: 'guangzhou airport transfer faq, guangzhou private driver booking',
    h1: 'Quick Answers to Your Questions',
    lead:
      'Find quick answers to the most common questions about our services, pricing and booking.',
  },

  contact: {
    path: '/contact',
    title: 'Contact & Get a Quote | CantonPickup Guangzhou & Foshan',
    description:
      'Tell us your travel details and get a fast quote for airport transfers, private drivers and factory visit transport in Guangzhou and Foshan. WhatsApp, WeChat or email — we reply quickly.',
    keywords: 'guangzhou airport transfer quote, book private driver guangzhou',
    h1: 'Get in Touch',
    lead: "Tell us your travel details and we'll send you a quote as soon as possible.",
  },

  privacy: {
    path: '/privacy-policy',
    title: 'Privacy Policy | CantonPickup',
    description:
      'How CantonPickup collects, uses and protects the personal information you share when you request a quote or book an airport transfer or private driver in Guangzhou and Foshan.',
    keywords: 'cantonpickup privacy policy',
    h1: 'Privacy Policy',
    lead:
      'This policy explains, in plain English, what information we collect when you request a quote or book a trip, why we collect it, and the choices you have.',
  },

  terms: {
    path: '/terms',
    title: 'Terms & Conditions | CantonPickup',
    description:
      'The terms that apply to airport transfers, private driver hire and factory visit transport booked with CantonPickup in Guangzhou and Foshan — bookings, payment, cancellation and liability.',
    keywords: 'cantonpickup terms and conditions',
    h1: 'Terms & Conditions',
    lead:
      'These terms cover every booking we accept. We have kept them short and readable — if anything is unclear, ask us before you book and we will explain it.',
  },
}

/**
 * Legal pages — written as heading/paragraph pairs so the content is easy to
 * keep up to date. Update `updated` whenever the wording changes.
 */
export const legalUpdated = 'September 2026'

export const privacySections = [
  {
    title: 'Who we are',
    body: [
      'CantonPickup is a private car and driver service based in Foshan, Guangdong, providing airport transfers, private driver hire and factory visit transport in Guangzhou, Foshan and the surrounding Pearl River Delta.',
      'For the purposes of the EU General Data Protection Regulation (GDPR) and comparable laws, we are the controller of the personal information described below.',
    ],
  },
  {
    title: 'Information we collect',
    body: [
      'Information you give us directly: your name, email address, phone or WhatsApp number, travel dates, flight number, pickup and drop-off addresses, passenger numbers, and any details you write in the quote form or send us by WhatsApp, WeChat or email.',
      'Booking records: the service you booked, the agreed price, payment method and payment status. We do not see or store your full card number — card payments are handled by our payment providers.',
      'Technical information collected automatically: standard server and analytics data such as your approximate location, device and browser type, the pages you view and how you arrived at the site. This is collected through cookies and similar technologies such as Google Tag Manager.',
    ],
  },
  {
    title: 'Why we use it',
    body: [
      'To reply to your enquiry and prepare your quote.',
      'To provide the transport service you booked — including passing your name, pickup details and phone number to the driver assigned to you.',
      'To monitor flights and adjust pickup times when a flight is delayed.',
      'To take payment, issue receipts and keep accounting records as required by Chinese law.',
      'To improve the website and, where you have consented or where permitted by law, to measure the performance of our advertising.',
    ],
  },
  {
    title: 'Sharing your information',
    body: [
      'We share only what is necessary: your driver receives the details needed to complete your trip, and our payment providers process your payment. We use established service providers for website hosting, email and form delivery, and advertising measurement.',
      'We do not sell your personal information, and we do not share it for other companies to market to you.',
    ],
  },
  {
    title: 'How long we keep it',
    body: [
      'Booking and payment records are kept for as long as required for accounting and tax purposes. Enquiries that do not become bookings are kept for a reasonable period so we can pick up the conversation, then deleted. Analytics data is retained according to the settings of the relevant provider.',
    ],
  },
  {
    title: 'Your rights',
    body: [
      'You can ask us for a copy of the personal information we hold about you, ask us to correct or delete it, object to certain processing, or withdraw consent you previously gave. Email ' +
        'Jackguoyingjie@gmail.com and we will respond within 30 days.',
      'If you are in the EU or the UK and believe we have not handled your request properly, you also have the right to complain to your local data protection authority.',
    ],
  },
  {
    title: 'Cookies',
    body: [
      'We use cookies and similar technologies to keep the site working and to understand how it is used. Analytics and advertising cookies are only set where permitted by your browser settings and applicable law. You can block or delete cookies in your browser at any time — the site will still work.',
    ],
  },
  {
    title: 'Security',
    body: [
      'The site is served over an encrypted (HTTPS) connection, and form submissions are transmitted to our form provider over an encrypted connection. Access to booking information is limited to the people who need it to deliver your service.',
    ],
  },
  {
    title: 'Changes and contact',
    body: [
      'If we make a material change to this policy we will update the date at the top of the page.',
      'Questions about privacy? Email Jackguoyingjie@gmail.com or message us on WhatsApp at +86 13202442074.',
    ],
  },
]

export const termsSections = [
  {
    title: '1. Booking and confirmation',
    body: [
      'A quote is an offer to provide the service described, at the price stated, for the dates and times you gave us. A booking is confirmed when we acknowledge it in writing and, where a deposit applies, the deposit has been received.',
      'Please check the confirmation carefully. Tell us immediately if a pickup time, address, flight number or passenger count is wrong — changes are usually free before the day of travel.',
      'The price covers the vehicle and driver, fuel, highway tolls and parking within the city area, as described on our pricing page. Anything else is agreed in writing before you travel.',
    ],
  },
  {
    title: '2. Payment',
    body: [
      'A 20% deposit confirms your booking and is payable online by PayPal or credit or debit card. The remaining balance is payable after the service by card, PayPal, Alipay, WeChat Pay or cash.',
      'Multi-day bookings may be settled day by day on request. For corporate bookings we can issue an invoice.',
      'All prices are quoted in US dollars (USD). The figure we confirm on your quote is the amount charged — nothing is converted on the day.',
    ],
  },
  {
    title: '3. Cancellation and changes',
    body: [
      'More than 48 hours before your pickup: cancel free of charge and your deposit is refunded in full.',
      'Within 48 hours of your pickup: a 50% cancellation fee applies.',
      'No-show on a confirmed booking: the full amount is charged.',
      'If we have to cancel for a reason within our control, you receive a full refund of anything already paid. If a delay is caused by weather, road closures, industrial action or another event outside our control, we will do our best to get you to your destination and no additional charge is made for the delay itself.',
    ],
  },
  {
    title: '4. Waiting time and flight delays',
    body: [
      'For airport pickups we monitor your flight. If it lands late, your driver waits and the pickup time moves with it — there is no extra charge. Standard free waiting time at the airport is 60 minutes from landing.',
      'For other pickups, 15 minutes of waiting time is included. Additional waiting time is charged at the hourly overtime rate shown on our pricing page, in 30-minute blocks.',
    ],
  },
  {
    title: '5. Passengers, luggage and vehicles',
    body: [
      'Each vehicle has a maximum passenger and luggage capacity, shown on our fleet pages. This is a legal limit as well as a comfort limit, so we cannot carry more people than the vehicle is registered for.',
      'If you arrive with more passengers or more luggage than declared and the booked vehicle cannot carry them, we will try to arrange a second or larger vehicle, which will be charged separately. Please tell us your luggage and group size in advance — it is the most common reason a trip starts badly, and it is easy to avoid.',
      'Child seats and booster seats are provided free of charge on request.',
    ],
  },
  {
    title: '6. Passenger responsibilities',
    body: [
      'All passengers must wear a seatbelt where one is fitted, and must not ask the driver to break traffic or other laws.',
      'Smoking, vaping and the consumption of alcohol are not permitted in any vehicle. Illegal substances are not permitted in any vehicle at any time.',
      'You are responsible for your own belongings. Please check the vehicle before you leave — if you leave something behind, tell us and we will try to return it, but we cannot guarantee it.',
      'Any damage caused deliberately to the interior or equipment of a vehicle may be charged at repair cost.',
    ],
  },
  {
    title: '7. Insurance and liability',
    body: [
      'Our vehicles carry the insurance required by Chinese law for passenger transport, including compulsory passenger liability cover for accidents.',
      'We are not liable for delays or failures caused by events outside our reasonable control, nor for indirect losses such as a missed flight or missed meeting where the delay was not caused by us.',
      'Nothing in these terms limits any liability that cannot be limited under applicable law.',
    ],
  },
  {
    title: '8. Conduct and refusal of service',
    body: [
      'The driver may refuse to continue a journey if a passenger is abusive, intoxicated to the point of being a risk, or behaving in a way that endangers the driver or other passengers. In those circumstances no refund is due.',
    ],
  },
  {
    title: '9. Governing law',
    body: [
      'These terms are governed by the laws of the People\u2019s Republic of China, and disputes are subject to the jurisdiction of the competent court in Guangdong. We will always try to resolve a complaint directly with you first — contact us and we will respond quickly.',
    ],
  },
  {
    title: '10. Changes to these terms',
    body: [
      'We may update these terms from time to time. The version that applies to your booking is the one published on this page on the date your booking was confirmed.',
    ],
  },
]

/** Home page — the four headline services. */
export const homeServices = [
  {
    icon: 'plane',
    title: 'Airport Transfer',
    subtitle: 'Pick up & drop off',
    to: '/airport-transfer',
    text: 'Baiyun Airport and railway station transfers with flight monitoring and a driver waiting for you.',
  },
  {
    icon: 'user',
    title: 'Private Driver',
    subtitle: 'Half day / Full day',
    to: '/private-driver',
    text: 'Hire a car and English-speaking driver by the hour, day or week — your schedule, your itinerary.',
  },
  {
    icon: 'factory',
    title: 'Factory Visits',
    subtitle: 'Meetings & suppliers',
    to: '/factory-visits',
    text: 'Reliable transport between hotels, showrooms and factories across Foshan and the Pearl River Delta.',
  },
  {
    icon: 'shield',
    title: 'Business Support',
    subtitle: 'Local help & coordination',
    to: '/contact',
    text: 'Local coordination, translation and practical help to make your trip run smoothly.',
  },
]

/** Reusable trust strip. */
export const trustStrip = [
  { icon: 'shield', title: 'Safe & Reliable', text: 'Professional drivers' },
  { icon: 'wallet', title: 'Transparent Pricing', text: 'No hidden fees' },
  { icon: 'chat', title: '24/7 Support', text: 'WhatsApp, WeChat or email' },
]

/** Home page process. */
export const homeSteps = [
  { n: 1, title: 'Tell us your plan', text: 'Share your details' },
  { n: 2, title: 'Get a quote', text: "We'll reply quickly" },
  { n: 3, title: 'Confirm & pay', text: 'Secure and easy' },
  { n: 4, title: 'Enjoy your trip', text: 'We handle the rest' },
]

/** Airport transfer page — why choose us. */
export const airportAdvantages = [
  {
    icon: 'plane',
    title: 'Flight Monitoring',
    text: 'We track your flight. If it is early, late or delayed, your driver adjusts.',
  },
  {
    icon: 'user',
    title: 'Meet & Greet',
    text: 'Your driver waits in the arrivals hall holding a sign with your name.',
  },
  {
    icon: 'clock',
    title: 'Flexible Pickup',
    text: 'Free waiting time included, so you are never rushed through the airport.',
  },
  {
    icon: 'wallet',
    title: 'Fixed Price',
    text: 'The price we quote is the price you pay. Fuel, tolls and parking included.',
  },
]

/** Airport transfer page — what happens after you land. */
export const airportSteps = [
  { n: 1, title: 'Book online', text: 'Send us your flight number and destination.' },
  { n: 2, title: 'We confirm', text: 'You receive your driver details and meeting point.' },
  { n: 3, title: 'Meet your driver', text: 'Your driver waits with a name sign in arrivals.' },
  { n: 4, title: 'Relax and ride', text: 'Sit back for a comfortable, direct journey.' },
]

/** Private driver page — hire options. */
export const driverOptions = [
  {
    icon: 'clock',
    title: 'Half Day',
    hours: '5 hours',
    from: 97,
    text: 'Perfect for a morning of meetings or a half-day of factory visits.',
  },
  {
    icon: 'sun',
    title: 'Full Day',
    hours: '10 hours',
    from: 187,
    text: 'The most popular option — a full day of appointments, sourcing or sightseeing.',
  },
  {
    icon: 'calendar',
    title: 'Multi-Day',
    hours: 'Custom plan',
    from: null,
    text: 'Keep the same driver for your whole trip. Ideal for longer sourcing visits.',
  },
]

/** Private driver page — what's included. */
export const driverIncluded = [
  'Professional English-speaking driver',
  'Fuel, tolls and parking',
  'Clean and comfortable vehicles',
  'Flexible itinerary — change plans any time',
  'Bottled water on board',
  'Phone charging in every vehicle',
]

/** Private driver page — common use cases. */
export const driverUseCases = [
  { icon: 'briefcase', title: 'Business meetings', text: 'On time, every time.' },
  { icon: 'factory', title: 'Factory visits', text: 'Multiple stops in one day.' },
  { icon: 'map', title: 'City tours', text: 'See Guangzhou and Foshan.' },
  { icon: 'building', title: 'Hotel transfers', text: 'Door-to-door, luggage handled.' },
]

/** Factory visits page — how we support you. */
export const factorySupport = [
  {
    icon: 'map',
    title: 'Local Knowledge',
    text: 'We know Foshan and the Pearl River Delta well, including the industrial districts.',
  },
  {
    icon: 'factory',
    title: 'Factory Coordination',
    text: 'We help you plan a realistic schedule between widely spread-out factories.',
  },
  {
    icon: 'calendar',
    title: 'Multiple Visits',
    text: 'Two, three or four factories in one day — we build the route so you arrive on time.',
  },
  {
    icon: 'chat',
    title: 'Business Support',
    text: 'Translation, local phone calls and practical help to keep your trip moving.',
  },
]

/** Factory visits page — visit flow. */
export const factorySteps = [
  { n: 1, title: 'Share your list', text: 'Send us the factories and dates you have in mind.' },
  { n: 2, title: 'We plan the route', text: 'We group visits to save you hours on the road.' },
  { n: 3, title: 'Visit day', text: 'Your driver waits at each stop and keeps you on schedule.' },
  { n: 4, title: 'Wrap up', text: 'Back to your hotel, the airport or your next meeting.' },
]

/** About page — why choose us. */
export const aboutAdvantages = [
  { icon: 'map', title: 'Local Expertise', text: 'Based in Foshan, working across the region daily.' },
  { icon: 'shield', title: 'Reliable Service', text: 'On-time pickups and a driver who keeps in touch.' },
  { icon: 'wallet', title: 'Fair Transparent Pricing', text: 'Quoted up front, with no hidden extras.' },
  { icon: 'chat', title: 'Customer-First Support', text: 'Real people answering, 24 hours a day.' },
]

/** About page — service principles. */
export const aboutPrinciples = [
  {
    title: 'Clear communication',
    text: 'Everything confirmed in English before you travel, with your driver contact details sent in advance.',
  },
  {
    title: 'Comfortable, clean vehicles',
    text: 'Every car is checked and cleaned before each trip, with air conditioning and charging on board.',
  },
  {
    title: 'Fair, fixed pricing',
    text: 'One clear price per vehicle. Fuel, tolls and parking inside the city area are already included.',
  },
  {
    title: 'Flexible when plans change',
    text: 'Flights are delayed and meetings run long. We build waiting time in and stay flexible.',
  },
]

/** FAQ groups rendered on the FAQ page and inline on service pages. */
export const faqGroups = [
  {
    id: 'airport',
    title: 'Airport Transfer',
    items: [
      {
        q: 'How do I find my driver at Baiyun Airport?',
        a: 'Your driver will be waiting in the arrivals hall holding a sign with your name. We send you the driver name, phone number and a photo of the meeting point by WhatsApp before you land. If you cannot find each other, call or message the number we send you and we will help immediately.',
      },
      {
        q: 'Do you monitor my flight if it is delayed?',
        a: 'Yes. We ask for your flight number when you book and track it in real time. If your flight arrives early or late, your pickup time adjusts automatically at no extra charge.',
      },
      {
        q: 'How much waiting time is included?',
        a: 'For airport arrivals we include 60 minutes of free waiting time from the moment your flight lands, and 30 minutes for departures and railway station pickups. If you are held up in immigration or baggage claim, just let us know.',
      },
      {
        q: 'Which airports and stations do you cover?',
        a: 'Guangzhou Baiyun International Airport (CAN), Guangzhou South Railway Station, Guangzhou East and Guangzhou Railway Station, Foshan West Station, Shenzhen Bao\u2019an Airport, Shenzhen North Station and Hong Kong West Kowloon connections on request.',
      },
      {
        q: 'Can you do a one-way transfer from Guangzhou to Foshan?',
        a: 'Absolutely — this is one of our most common bookings. A one-way private transfer from Baiyun Airport to Foshan city starts at $87 for a sedan and $117 for a seven-seat MPV, including tolls.',
      },
    ],
  },
  {
    id: 'driver',
    title: 'Private Driver',
    items: [
      {
        q: 'What is included in a half-day or full-day hire?',
        a: 'Your vehicle, an English-speaking driver, fuel, tolls and parking within the city area, plus bottled water. A half day covers 5 hours and 120 km; a full day covers 10 hours and 250 km.',
      },
      {
        q: 'What happens if we go over the time or distance?',
        a: 'Overtime is charged at $24 per hour for a sedan and $30 per hour for an MPV. Extra distance is $1.50 per km for a sedan and $2.00 per km for an MPV on a half day, or $0.70 and $0.85 per km on a full day. Your driver will always tell you before you exceed the limit.',
      },
      {
        q: 'Can the driver wait with us at a factory or meeting?',
        a: 'Yes. Waiting time is included in the hire period, so your driver stays with the vehicle and is ready whenever you finish.',
      },
      {
        q: 'Do your drivers speak English?',
        a: 'Yes. Our drivers speak conversational English and are used to working with international business travellers. For complex technical discussions we can also arrange a translator on request.',
      },
      {
        q: 'Can I book a driver for several days?',
        a: 'Yes. Multi-day hire is very popular for sourcing trips. You keep the same driver and vehicle throughout, and we offer a better daily rate for three days or more.',
      },
    ],
  },
  {
    id: 'factory',
    title: 'Factory Visits',
    items: [
      {
        q: 'Can you take us to several factories in one day?',
        a: 'Yes. We plan the route in advance so the driving between Foshan, Guangzhou and Dongguan is as short as possible. Three visits in a full day is comfortable; four is possible if the factories are close together.',
      },
      {
        q: 'Do you know where the industrial districts are?',
        a: 'We work in this region every day and know the main manufacturing districts, including Shunde, Nanhai, Chancheng and Sanshui in Foshan, plus Baiyun, Panyu and Huangpu in Guangzhou.',
      },
      {
        q: 'Can you help us communicate with the factory?',
        a: 'Our drivers can help with basic communication and phone calls. For negotiations or technical meetings we can arrange an interpreter for an additional fee.',
      },
      {
        q: 'What if our schedule changes during the day?',
        a: 'Just tell your driver. Extra hours are billed at the standard overtime rate, and we will always confirm any additional cost with you first.',
      },
    ],
  },
  {
    id: 'pricing',
    title: 'Pricing & Payment',
    items: [
      {
        q: 'Are prices per person or per vehicle?',
        a: 'All prices are per vehicle, not per person. The quoted price covers the whole car, so a family or a group of colleagues travelling together pays the same as one person.',
      },
      {
        q: 'Are tolls and parking included?',
        a: 'Yes — fuel, tolls and parking within the city area are included in the quoted price. Remote-area surcharges and airport parking beyond the included waiting time are listed separately and always agreed in advance.',
      },
      {
        q: 'How do I pay?',
        a: 'International guests usually pay by PayPal or credit / debit card (Visa, Mastercard, Amex) through our secure payment link. You can also pay by Alipay, WeChat Pay, bank transfer or in cash directly to your driver. Corporate bookings can be invoiced.',
      },
      {
        q: 'Do I need to pay a deposit?',
        a: 'A 20% deposit confirms your booking and is paid online by PayPal or credit card. The remaining balance is settled after the service — by card, cash, Alipay or WeChat Pay. For multi-day bookings you are welcome to settle day by day.',
      },
      {
        q: 'What is your cancellation policy?',
        a: 'Cancel more than 48 hours before your pickup and your deposit is refunded in full. Cancel within 48 hours and a 50% cancellation fee applies. If you do not show up for a confirmed booking, the full amount is charged. Plans change — just tell us as early as you can and we will do our best to help.',
      },
      {
        q: 'Will the price change after I book?',
        a: 'No. The price we confirm is the price you pay for the service described. The only extras are clearly listed overtime, extra distance, or a change of destination that you request.',
      },
    ],
  },
  {
    id: 'general',
    title: 'General Questions',
    items: [
      {
        q: 'How far in advance should I book?',
        a: 'For airport transfers, 24 hours\u2019 notice is usually enough, but booking a few days ahead is safer in peak season and around Chinese public holidays. For multi-day driver hire we recommend booking at least a week in advance.',
      },
      {
        q: 'What are your payment hours and availability?',
        a: 'We operate 24 hours a day, 7 days a week, including public holidays. Early-morning and late-night airport pickups are no problem at all.',
      },
      {
        q: 'Do you provide child seats?',
        a: 'Yes, child seats and booster seats are available free of charge. Just mention your child\u2019s age and weight when you book so we bring the right one.',
      },
      {
        q: 'How much luggage can you carry?',
        a: 'A sedan takes 2–3 suitcases and a seven-seat MPV takes 4–6 suitcases. If you are travelling with oversized items or more luggage than usual, tell us in advance and we will recommend the right vehicle.',
      },
      {
        q: 'Do you travel outside Guangzhou and Foshan?',
        a: 'Yes. We regularly drive to Shenzhen, Dongguan, Huizhou, Qingyuan, Zhuhai and beyond. Longer trips are quoted individually — just send us the details.',
      },
    ],
  },
]

/**
 * Vehicles & Pricing page — payment options.
 * Follows the same structure as the reference site so international guests
 * can see a payment route they already use before they ask.
 */
export const paymentMethods = [
  {
    icon: 'wallet',
    label: 'PayPal',
    hint: 'The easiest option for guests from Europe, the US and Australia. Deposit and balance.',
    badge: 'International',
  },
  {
    icon: 'wallet',
    label: 'Credit / Debit Card',
    hint: 'Visa, Mastercard and American Express through our secure Stripe payment link.',
    badge: 'International',
  },
  {
    icon: 'chat',
    label: 'Alipay',
    hint: 'Scan the driver\u2019s QR code — handy if you already have a Chinese wallet set up.',
  },
  {
    icon: 'chat',
    label: 'WeChat Pay',
    hint: 'Scan to pay from your WeChat wallet. Popular with guests from Singapore, Malaysia and Hong Kong, China.',
  },
  {
    icon: 'building',
    label: 'Bank Transfer',
    hint: 'For corporate bookings and travel agencies. An invoice can be issued.',
  },
  {
    icon: 'wallet',
    label: 'Cash',
    hint: 'Pay the driver directly in cash when the trip ends.',
  },
]

/**
 * Vehicles & Pricing page — how payment works.
 * 20% to confirm, the balance after the service.
 */
export const paymentSteps = [
  {
    n: '1',
    title: 'Pay a 20% deposit',
    text: 'A 20% deposit confirms your booking. Pay it online by PayPal or credit card — no account with a Chinese payment app needed.',
  },
  {
    n: '2',
    title: 'Get your driver details',
    text: 'We confirm within a few hours, send your driver\u2019s name, phone number and vehicle details, and monitor your flight if you are arriving by air.',
  },
  {
    n: '3',
    title: 'Pay the balance after the trip',
    text: 'Settle the remaining 80% after the service — by card, PayPal, Alipay, WeChat Pay or cash. Multi-day bookings can be settled day by day.',
  },
]

/** Vehicles & Pricing page — cancellation policy. */
export const cancellationPolicy = [
  {
    icon: 'shield',
    label: 'More than 48 hours before pickup',
    value: 'Free cancellation — deposit refunded in full',
    tone: 'good',
  },
  {
    icon: 'clock',
    label: 'Within 48 hours of pickup',
    value: '50% cancellation fee',
    tone: 'warn',
  },
  {
    icon: 'close',
    label: 'No-show on a confirmed booking',
    value: 'Full amount charged',
    tone: 'bad',
  },
]

/** Vehicles & Pricing page — what the quoted price already covers. */
export const pricingIncluded = [
  'Professional English-speaking driver',
  'Fuel and highway tolls',
  'Parking inside the city area',
  'Air-conditioned, cleaned vehicle',
  'Bottled water on board',
  'Phone charging cables',
  'Child seat on request',
  '24/7 support by WhatsApp, WeChat or email',
]

/** Vehicles & Pricing page — the costs that sit outside the quoted price. */
export const pricingExcluded = [
  'Overtime beyond the included hours — $24/h sedan, $30/h MPV',
  'Extra distance — $1.50/km sedan and $2.00/km MPV on a half day; $0.70 and $0.85 on a full day',
  'Destinations beyond the intercity routes listed above (quoted on request)',
  'Airport parking beyond the free waiting time',
  'Interpreter or translation service',
]

/** About page — the short story behind the business. */
export const aboutStory = [
  'We started CantonPickup to make travel easier for international visitors and business travellers arriving in the Pearl River Delta. Guangzhou and Foshan are two of the busiest manufacturing regions in the world, and every week thousands of buyers, engineers and families land at Baiyun Airport with a full schedule ahead of them.',
  'Public transport is not always practical when you are carrying samples, moving between factories in different districts, or arriving late at night. Our answer was simple: a small team of local drivers who speak English, know the industrial districts by heart, and quote one fixed price per vehicle.',
  'Today we drive guests from all over the world — sourcing agents visiting Foshan furniture and ceramics factories, engineers auditing suppliers, families on holiday, and business people who simply need to get to a meeting on time.',
]

/** Contact page — the ways to reach us. */
export const contactChannels = [
  {
    icon: 'whatsapp',
    label: 'WhatsApp',
    value: '+86 13202442074',
    hint: 'Fastest reply — usually within 30 minutes',
    href: 'https://wa.me/8613202442074',
    external: true,
  },
  {
    icon: 'wechat',
    label: 'WeChat',
    value: '+86 13202442074',
    hint: 'Scan or add us by phone number',
    href: '',
  },
  {
    icon: 'mail',
    label: 'Email',
    value: 'Jackguoyingjie@gmail.com',
    hint: 'Best for detailed itineraries and invoices',
    href: 'mailto:Jackguoyingjie@gmail.com',
  },
  {
    icon: 'phone',
    label: 'Phone',
    value: '+86 13202442074',
    hint: 'Available 24 hours, 7 days a week',
    href: 'tel:+8613202442074',
  },
]

/** Service-page CTAs. */
export const ctaBands = {
  home: {
    title: 'Ready to Plan Your Trip?',
    text: 'Send us your dates and destinations and we will send you a fixed price the same day.',
    button: 'Get a Quote',
  },
  airport: {
    title: 'Landing at Baiyun Airport?',
    text: 'Send us your flight number and destination and we will take care of the rest.',
    button: 'Get a Quote',
  },
  driver: {
    title: 'Need a driver for your trip?',
    text: 'Tell us your schedule and we will match you with the right vehicle and driver.',
    button: 'Get a Quote',
  },
  factory: {
    title: "Let's Plan Your Factory Visit",
    text: 'Share your factory list and dates and we will build a route that saves you hours.',
    button: 'Get a Quote',
  },
  vehicles: {
    title: 'Different needs, same great service.',
    text: 'Not sure which vehicle suits your trip? Send us the details and we will advise.',
    button: 'Get a Quote',
  },
  about: {
    title: 'Travel with a local team',
    text: 'Simple. Reliable. Together. That is how we like to work.',
    button: 'Get a Quote',
  },
}
