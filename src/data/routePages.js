/**
 * Intercity route landing pages.
 *
 * One entry per `Guangzhou to <City>` page. The copy is our own — the page
 * structure follows what travellers expect from a route page (hero, inline
 * quote, fixed-price table, buyer angle, reverse direction, FAQ), but every
 * sentence here was written for CantonPickup.
 *
 * PRICING RULE — do not invent numbers. `city` carries the fare that already
 * lives in `intercityRoutes` (site.js). `airport` is only filled in where a
 * confirmed figure exists (Foshan, from `popularRoutes`); elsewhere it stays
 * null and the table prints "Quoted on request", which is how the rest of the
 * site already handles an unpriced leg. All fares are USD, per vehicle.
 */

/** The three trust pills that sit under every route hero. */
export const routeBadges = ['Fixed price', 'English-speaking driver', 'Door to door']

export const routePages = [
  {
    slug: 'guangzhou-to-foshan',
    city: 'Foshan',
    title: 'Guangzhou to Foshan Private Car & Airport Transfer | Fixed Price | CantonPickup',
    h1: 'Guangzhou to Foshan Private Car & Airport Transfer',
    description:
      'Door-to-door private car between Guangzhou and Foshan. Fixed price from $57 per vehicle with an English-speaking driver — ideal for factory visits, the Lecong furniture market and business trips.',
    lede: 'Door-to-door private car between Guangzhou and Foshan. Fixed price from $57, with an English-speaking driver — ideal for factory visits, furniture markets and business trips.',
    hero: '/images/hero/factory.jpg',
    heroAlt: 'Factory district on the Guangzhou to Foshan route',
    eyebrow: 'Foshan',
    keywords: [
      'guangzhou to foshan private transfer',
      'foshan private transfer from guangzhou',
      'guangzhou to foshan car service',
      'foshan factory visit driver',
    ],
    table: [
      {
        from: 'Baiyun Airport (CAN)',
        to: 'Chancheng · Nanhai · Shunde',
        distance: '45–55 km',
        duration: '70–90 min',
        sedan: 87,
        mpv: 117,
      },
      {
        from: 'Guangzhou city / hotel',
        to: 'Foshan city centre',
        distance: '25–35 km',
        duration: '40–60 min',
        sedan: 57,
        mpv: 77,
      },
    ],
    buyer: {
      title: 'Visiting Factories or Markets in Foshan?',
      text: 'Foshan is where a large share of China\u2019s furniture, ceramics, lighting and building materials are made. Buyers usually need more than a drop-off — they need a car that waits while they walk a showroom floor.',
      points: [
        'Lecong furniture market — the biggest concentration of furniture showrooms in China',
        'Shunde and Nanhai for appliances, hardware and components',
        'Chancheng for ceramics and sanitaryware',
        'Your driver waits at every stop, then takes you to the next one',
      ],
    },
    notes: [
      'Fixed all-inclusive price — highway tolls, parking and fuel included',
      'The same price whichever direction you travel',
      'Door to door — any address at either end',
      'English-speaking driver who helps with the luggage',
    ],
    reverse: {
      title: 'Foshan to Guangzhou? Same Fixed Price',
      text: 'Your driver collects you from any hotel or factory in Foshan — Chancheng, Nanhai, Shunde or Lecong — and drives you door to door to Guangzhou, or straight to Baiyun Airport for an early departure.',
    },
    faq: [
      {
        q: 'How long does the drive from Guangzhou to Foshan take?',
        a: 'Between 40 and 60 minutes from central Guangzhou, and 70 to 90 minutes from Baiyun Airport. Traffic around the Foshan ring road is heaviest between 08:00 and 09:30, so allow a little more if you have a meeting to reach.',
      },
      {
        q: 'Is the price per person or per vehicle?',
        a: 'Per vehicle. The figure covers the whole car — driver, fuel, highway tolls, parking and bottled water. It does not change whether one passenger travels or six.',
      },
      {
        q: 'Can the driver wait while I visit a factory or a market?',
        a: 'Yes. A short stop is included. If you plan to visit several factories or spend a full day in the showrooms, a day rate works out cheaper than keeping a one-way fare open — tell us your stops and we will price it either way.',
      },
      {
        q: 'Can you take me to the Lecong furniture market?',
        a: 'Lecong is one of our most common Foshan trips. A seven-seat MPV is the usual choice: showroom samples and fabric swatches take up space that a sedan boot will not cover.',
      },
      {
        q: 'Do you also pick up in Foshan for the trip back?',
        a: 'Yes, and the fare is identical in both directions. This includes early-morning departures from a Foshan hotel to Baiyun Airport.',
      },
    ],
    service: { to: '/intercity-transfer', label: 'All intercity routes & prices' },
  },

  {
    slug: 'guangzhou-to-shenzhen',
    city: 'Shenzhen',
    title: 'Guangzhou to Shenzhen Private Car & Airport Transfer | Fixed Price | CantonPickup',
    h1: 'Guangzhou to Shenzhen Private Car & Airport Transfer',
    description:
      'Private car between Guangzhou and Shenzhen with an English-speaking driver. Fixed price from $137 per vehicle, tolls and parking included. Door to door, either direction.',
    lede: 'Private car between Guangzhou and Shenzhen. Fixed price from $137 with an English-speaking driver — a comfortable alternative to a crowded high-speed train connection.',
    hero: '/images/hero/guangzhou-night.jpg',
    heroAlt: 'City skyline at night on the Guangzhou to Shenzhen corridor',
    eyebrow: 'Shenzhen',
    keywords: [
      'guangzhou to shenzhen private transfer',
      'private car from shenzhen to guangzhou',
      'guangzhou shenzhen car service',
      'shenzhen airport transfer from guangzhou',
      'huaqiangbei electronics market driver',
    ],
    table: [
      {
        from: 'Baiyun Airport (CAN)',
        to: 'Shenzhen city centre',
        distance: '145–165 km',
        duration: '140–170 min',
        sedan: null,
        mpv: null,
        note: 'Quoted on request',
      },
      {
        from: 'Guangzhou city / hotel',
        to: 'Shenzhen city centre',
        distance: '120–140 km',
        duration: '110–140 min',
        sedan: 137,
        mpv: 177,
      },
    ],
    buyer: {
      title: 'Sourcing Across Two Cities?',
      text: 'Many buyers split a trip between Guangzhou and Shenzhen — hardware and homeware in one, consumer electronics in the other. A car makes that a single working day instead of two travel days.',
      points: [
        'Huaqiangbei for consumer electronics, components and accessories',
        'Yantian and Shekou for freight and forwarder meetings',
        'Nanshan for tech offices and sourcing agents',
        'Same car and driver for the return leg, so your luggage stays put',
      ],
    },
    notes: [
      'Fixed all-inclusive price — highway tolls, parking and fuel included',
      'The same price whichever direction you travel',
      'Door to door — any address at either end',
      'English-speaking driver who helps with the luggage',
    ],
    reverse: {
      title: 'Shenzhen to Guangzhou? Same Fixed Price',
      text: 'A private car from Shenzhen to Guangzhou costs exactly the same as the run the other way. We collect from any Shenzhen hotel or office — Futian, Nanshan, Luohu, Bao\u2019an — and drive you to Guangzhou, or directly to Baiyun Airport for a departure the same day. Hong Kong, China arrivals are met at the Shenzhen border crossing of your choice.',
    },
    faq: [
      {
        q: 'Is a car faster than the high-speed train to Shenzhen?',
        a: 'Usually not faster for the city-centre to city-centre run, but it is simpler. There is no ticket to collect, no station transfer at either end, and your luggage travels with you. Most business travellers choose the car when they are carrying samples or heading somewhere that is not next to a station.',
      },
      {
        q: 'How long is the drive?',
        a: 'Around two hours from central Guangzhou in normal traffic. The Shenzhen Bay and Nantou checkpoints can add 20 to 30 minutes on a Friday afternoon or before a public holiday.',
      },
      {
        q: 'Is the price per person or per vehicle?',
        a: 'Per vehicle, all in. One passenger costs the same as six. Highway tolls, parking and fuel are already inside the figure.',
      },
      {
        q: 'Do you cross into Hong Kong, China?',
        a: 'We drive within mainland China. For Hong Kong, China, we can drop you at the Shenzhen border crossing of your choice, where you transfer to a cross-border service.',
      },
      {
        q: 'Can I stop at Huawei or another factory on the way?',
        a: 'A scheduled stop is fine on most Shenzhen runs as long as we know about it when you book. Several stops in one day are better handled as a full-day booking.',
      },
    ],
    service: { to: '/intercity-transfer', label: 'All intercity routes & prices' },
  },

  {
    slug: 'guangzhou-to-dongguan',
    city: 'Dongguan',
    title: 'Guangzhou to Dongguan Private Car & Airport Transfer | Fixed Price | CantonPickup',
    h1: 'Guangzhou to Dongguan Private Car & Airport Transfer',
    description:
      'Private car between Guangzhou and Dongguan with an English-speaking driver. Fixed price from $97 per vehicle, tolls and parking included. Door to door, either direction.',
    lede: 'Private car between Guangzhou and Dongguan. Fixed price from $97 with an English-speaking driver — the straightforward way to reach factories in Houjie, Chang\u2019an and Songshan Lake.',
    hero: '/images/services/business-travel.jpg',
    heroAlt: 'Business travellers arriving by car at a manufacturing district',
    eyebrow: 'Dongguan',
    keywords: [
      'guangzhou to dongguan private transfer',
      'dongguan factory visit driver',
      'guangzhou dongguan car service',
      'houjie furniture market transfer',
    ],
    table: [
      {
        from: 'Baiyun Airport (CAN)',
        to: 'Dongguan city centre',
        distance: '75–90 km',
        duration: '90–110 min',
        sedan: null,
        mpv: null,
        note: 'Quoted on request',
      },
      {
        from: 'Guangzhou city / hotel',
        to: 'Dongguan city centre',
        distance: '60–75 km',
        duration: '60–80 min',
        sedan: 97,
        mpv: 127,
      },
    ],
    buyer: {
      title: 'Dongguan Is a Factory City, Not a Tourist One',
      text: 'Dongguan\u2019s industrial clusters sit in different towns, and they are not within walking distance of each other. A driver who knows the geography saves you a wasted afternoon.',
      points: [
        'Houjie for furniture and leather goods',
        'Chang\u2019an and Tangxia for electronics and hardware',
        'Songshan Lake for advanced manufacturing and R&D plants',
        'Multi-stop days at a day rate, with the driver waiting at each site',
      ],
    },
    notes: [
      'Fixed all-inclusive price — highway tolls, parking and fuel included',
      'The same price whichever direction you travel',
      'Door to door — any address at either end',
      'English-speaking driver who helps with the luggage',
    ],
    reverse: {
      title: 'Dongguan to Guangzhou? Same Fixed Price',
      text: 'We collect from any Dongguan hotel or factory — Nancheng, Houjie, Chang\u2019an, Tangxia — and drive you door to door to Guangzhou or on to Baiyun Airport.',
    },
    faq: [
      {
        q: 'How long does Guangzhou to Dongguan take?',
        a: 'Between one and one and a half hours depending on which town you are heading for. Houjie and Nancheng are closer; Tangxia and Fenggang, near the Shenzhen border, take longer.',
      },
      {
        q: 'Can you take me to several factories in one day?',
        a: 'That is the most common Dongguan booking. Send us the list of addresses and we will plan a route that runs in a sensible order instead of doubling back across the city.',
      },
      {
        q: 'Is the price per vehicle?',
        a: 'Yes, per vehicle and all in — driver, fuel, highway tolls and parking. The fare does not change with the number of passengers.',
      },
      {
        q: 'Do your drivers speak English?',
        a: 'All of our drivers handle everyday English. If your day involves technical discussion, we can arrange a driver with stronger English or a separate interpreter for the meetings.',
      },
      {
        q: 'Can I be dropped at Shenzhen Bao\u2019an Airport instead?',
        a: 'Yes. Dongguan sits between Guangzhou and Shenzhen, so a drop-off at Bao\u2019an Airport is often shorter than doubling back to Baiyun. Send us the flight and we will quote the exact figure.',
      },
    ],
    service: { to: '/intercity-transfer', label: 'All intercity routes & prices' },
  },

  {
    slug: 'guangzhou-to-zhongshan',
    city: 'Zhongshan',
    title: 'Guangzhou to Zhongshan Private Car & Airport Transfer | Fixed Price | CantonPickup',
    h1: 'Guangzhou to Zhongshan Private Car & Airport Transfer',
    description:
      'Private car between Guangzhou and Zhongshan with an English-speaking driver. Fixed price from $127 per vehicle, tolls and parking included. Door to door, either direction.',
    lede: 'Private car between Guangzhou and Zhongshan. Fixed price from $127 with an English-speaking driver — the practical way to reach the lighting markets at Guzhen.',
    hero: '/images/hero/business-district.jpg',
    heroAlt: 'Commercial district on the Guangzhou to Zhongshan route',
    eyebrow: 'Zhongshan',
    keywords: [
      'guangzhou to zhongshan private transfer',
      'guzhen lighting market driver',
      'zhongshan factory visit transfer',
      'guangzhou zhongshan car service',
    ],
    table: [
      {
        from: 'Baiyun Airport (CAN)',
        to: 'Zhongshan city centre',
        distance: '100–115 km',
        duration: '110–130 min',
        sedan: null,
        mpv: null,
        note: 'Quoted on request',
      },
      {
        from: 'Guangzhou city / hotel',
        to: 'Zhongshan city centre',
        distance: '85–100 km',
        duration: '80–100 min',
        sedan: 127,
        mpv: 167,
      },
    ],
    buyer: {
      title: 'Guzhen Is the Lighting Capital',
      text: 'If you are buying lighting, Zhongshan is the trip. Guzhen town holds thousands of lighting showrooms, and the market is large enough that you will want a car waiting between buildings.',
      points: [
        'Guzhen for lighting — residential, commercial and outdoor fittings',
        'Dachong for furniture and redwood pieces',
        'Xiaolan for hardware, locks and appliances',
        'Room in a seven-seat MPV for catalogues and samples',
      ],
    },
    notes: [
      'Fixed all-inclusive price — highway tolls, parking and fuel included',
      'The same price whichever direction you travel',
      'Door to door — any address at either end',
      'English-speaking driver who helps with the luggage',
    ],
    reverse: {
      title: 'Zhongshan to Guangzhou? Same Fixed Price',
      text: 'We collect from any Zhongshan hotel or showroom — Guzhen, Xiaolan, Dachong, Shiqi — and drive you door to door to Guangzhou or straight to the airport.',
    },
    faq: [
      {
        q: 'How long is the drive from Guangzhou to Zhongshan?',
        a: 'About one and a half hours from central Guangzhou to Shiqi or Guzhen, via the Nansha and Shenzhong links. Allow a little more on a Monday morning.',
      },
      {
        q: 'Can the driver wait at the Guzhen lighting market?',
        a: 'Yes. Lighting buyers typically spend a full day or two there, so a day rate is usually the better arrangement. Your driver stays with the car and moves you between showroom buildings.',
      },
      {
        q: 'Is the fare per person or per vehicle?',
        a: 'Per vehicle, all in. Fuel, highway tolls and parking are included, and the price is the same in both directions.',
      },
      {
        q: 'Can I combine Zhongshan with Zhuhai in one trip?',
        a: 'Zhongshan and Zhuhai are neighbours, and many buyers do both. Send us the addresses and we will quote the combined routing rather than two separate fares.',
      },
      {
        q: 'How much luggage can the car take?',
        a: 'A sedan carries two to three large suitcases; a seven-seat MPV carries four to six. If you are bringing samples back, the MPV is the safer choice.',
      },
    ],
    service: { to: '/intercity-transfer', label: 'All intercity routes & prices' },
  },

  {
    slug: 'guangzhou-to-zhuhai',
    city: 'Zhuhai',
    title: 'Guangzhou to Zhuhai Private Car & Airport Transfer | Fixed Price | CantonPickup',
    h1: 'Guangzhou to Zhuhai Private Car & Airport Transfer',
    description:
      'Private car between Guangzhou and Zhuhai with an English-speaking driver. Fixed price from $147 per vehicle, tolls and parking included. Door to door, either direction.',
    lede: 'Private car between Guangzhou and Zhuhai. Fixed price from $147 with an English-speaking driver — including drop-offs at Gongbei for the Macao, China crossing.',
    hero: '/images/hero/highway-dusk.jpg',
    heroAlt: 'Highway interchange at dusk on the Guangzhou to Zhuhai corridor',
    eyebrow: 'Zhuhai',
    keywords: [
      'guangzhou to zhuhai private transfer',
      'guangzhou to gongbei border transfer',
      'zhuhai airport transfer from guangzhou',
      'guangzhou zhuhai car service',
    ],
    table: [
      {
        from: 'Baiyun Airport (CAN)',
        to: 'Zhuhai city centre',
        distance: '155–175 km',
        duration: '150–180 min',
        sedan: null,
        mpv: null,
        note: 'Quoted on request',
      },
      {
        from: 'Guangzhou city / hotel',
        to: 'Zhuhai city centre',
        distance: '130–150 km',
        duration: '120–150 min',
        sedan: 147,
        mpv: 187,
      },
    ],
    buyer: {
      title: 'Zhuhai, Gongbei and the Macao, China Crossing',
      text: 'Zhuhai is the last mainland city before Macao, China, and the Gongbei checkpoint is where most travellers cross. We can drop you at the border gate or at your Zhuhai hotel, whichever suits your onward plan.',
      points: [
        'Gongbei for the Macao, China border crossing',
        'Hengqin for the newer crossing and the cooperative zone',
        'Jinwan and Gree-related manufacturing for appliance buyers',
        'A straightforward run if you are combining Zhuhai with Zhongshan',
      ],
    },
    notes: [
      'Fixed all-inclusive price — highway tolls, parking and fuel included',
      'The same price whichever direction you travel',
      'Door to door — any address at either end',
      'English-speaking driver who helps with the luggage',
    ],
    reverse: {
      title: 'Zhuhai to Guangzhou? Same Fixed Price',
      text: 'We collect from any Zhuhai hotel or from the Gongbei border gate and drive you to Guangzhou, or directly to Baiyun Airport. Early departures are no problem — your driver will be waiting before you are.',
    },
    faq: [
      {
        q: 'How long does Guangzhou to Zhuhai take?',
        a: 'Two to two and a half hours from central Guangzhou. The route follows the G4W and then the coastal expressway, both of which are usually free-flowing outside holiday periods.',
      },
      {
        q: 'Can you drop me at the Gongbei border crossing?',
        a: 'Yes, that is a normal Zhuhai drop-off. Your fare is unchanged — tell us at booking so the driver plans the approach to the gate rather than a hotel entrance.',
      },
      {
        q: 'Is the price per vehicle?',
        a: 'Per vehicle and all in. Driver, fuel, highway tolls and parking are included, and one passenger pays the same as six.',
      },
      {
        q: 'Do you go to Zhuhai Jinwan Airport?',
        a: 'Yes. Jinwan is further south than the city centre, so it is slightly more than the standard city fare. Send us the terminal and departure time and we will confirm the figure.',
      },
      {
        q: 'Can I stop on the way for a factory visit?',
        a: 'A planned stop is fine as long as it is on the route. Buyers often combine a Zhongshan factory in the morning with a Zhuhai hotel in the evening — we quote that as one journey.',
      },
    ],
    service: { to: '/intercity-transfer', label: 'All intercity routes & prices' },
  },

  {
    slug: 'guangzhou-to-huizhou',
    city: 'Huizhou',
    title: 'Guangzhou to Huizhou Private Car & Airport Transfer | Fixed Price | CantonPickup',
    h1: 'Guangzhou to Huizhou Private Car & Airport Transfer',
    description:
      'Private car between Guangzhou and Huizhou with an English-speaking driver. Fixed price from $157 per vehicle, tolls and parking included. Door to door, either direction.',
    lede: 'Private car between Guangzhou and Huizhou. Fixed price from $157 with an English-speaking driver — door to door to Daya Bay, Huicheng or the electronics plants inland.',
    hero: '/images/hero/guangzhou-aerial.jpg',
    heroAlt: 'Aerial view of the Guangdong coastline on the Guangzhou to Huizhou route',
    eyebrow: 'Huizhou',
    keywords: [
      'guangzhou to huizhou private transfer',
      'huizhou factory visit driver',
      'daya bay transfer from guangzhou',
      'guangzhou huizhou car service',
    ],
    table: [
      {
        from: 'Baiyun Airport (CAN)',
        to: 'Huizhou city centre',
        distance: '155–180 km',
        duration: '150–180 min',
        sedan: null,
        mpv: null,
        note: 'Quoted on request',
      },
      {
        from: 'Guangzhou city / hotel',
        to: 'Huizhou city centre',
        distance: '130–150 km',
        duration: '120–150 min',
        sedan: 157,
        mpv: 197,
      },
    ],
    buyer: {
      title: 'Huizhou: Electronics and Industry East of Shenzhen',
      text: 'Huizhou is one of the quieter industrial cities in the delta, which is exactly why some buyers prefer it — plants are larger, land is cheaper and visits are less rushed.',
      points: [
        'Daya Bay for petrochemical and heavy industry',
        'Zhongkai and Huicheng for electronics and assembly plants',
        'Boluo and Yuanzhou for furniture and hardware',
        'A single long drive instead of two train legs with a station change',
      ],
    },
    notes: [
      'Fixed all-inclusive price — highway tolls, parking and fuel included',
      'The same price whichever direction you travel',
      'Door to door — any address at either end',
      'English-speaking driver who helps with the luggage',
    ],
    reverse: {
      title: 'Huizhou to Guangzhou? Same Fixed Price',
      text: 'We collect from any Huizhou hotel, plant or from Daya Bay and drive you to Guangzhou, or straight to Baiyun Airport for an evening flight.',
    },
    faq: [
      {
        q: 'How long is Guangzhou to Huizhou?',
        a: 'Roughly two to two and a half hours to Huicheng, and a little longer to Daya Bay. It is one of the longer delta routes, so we usually suggest a full-day booking if you also plan factory stops.',
      },
      {
        q: 'Is the price per vehicle or per person?',
        a: 'Per vehicle, all in. The fare covers the car and driver, fuel, highway tolls and parking, and does not change with the number of passengers.',
      },
      {
        q: 'Can I visit two plants in one day?',
        a: 'Yes, if they are in the same industrial area. Tell us the addresses when you book and we will confirm whether the route fits a single day comfortably or whether two days make more sense.',
      },
      {
        q: 'Do you also serve the Huizhou coast?',
        a: 'We drive to any address in the Huizhou area, including the coast at Xunliao and Daya Bay. Beach resorts and hotels there are all normal drop-offs.',
      },
      {
        q: 'Can you take me on to Shenzhen after Huizhou?',
        a: 'Yes — Huizhou sits east of Shenzhen, so a drop-off there is often on the way rather than a detour. Send us both addresses and we will quote the combined route.',
      },
    ],
    service: { to: '/intercity-transfer', label: 'All intercity routes & prices' },
  },
]

export const routeSlugs = routePages.map((r) => r.slug)

export function routePageBySlug(slug) {
  return routePages.find((r) => r.slug === slug)
}
