/**
 * Guides / blog.
 *
 * Ten long-form articles aimed at the things international visitors and buyers
 * actually search for before they land in Guangdong. Topics overlap with what
 * any Guangzhou car service writes about — a travel guide category is a travel
 * guide category — but every paragraph here was written for CantonPickup.
 *
 * `image` points at `/images/blog/<slug>.jpg`. Body copy is stored as an array
 * of blocks so the renderer can decide on headings, paragraphs and lists
 * without parsing markdown:
 *
 *   { heading, body: [para, ...], list: [item, ...] }
 *
 * Add or reorder blocks freely; the article page renders whatever is there.
 *
 * `title` is the on-page `<h1>`, the card label and the breadcrumb, so it can be
 * as long as it reads well. The browser-tab / SERP string is
 * `` `${seoTitle || title} | CantonPickup` `` — the brand suffix costs 15
 * characters, and Bing fails a page over 60, so any article whose `title`
 * cannot absorb that gets an explicit `seoTitle` of at most 45 characters.
 * Both are read by `ArticleView.vue` and by `src/entry-server.js`.
 */

export const articleCategories = [
  'Wholesale Markets',
  'Factory & Sourcing',
  'Travel Tips',
  'Canton Fair',
  'Local Food',
]

export const articles = [
  {
    slug: 'guangzhou-wholesale-markets-guide',
    title: 'Guangzhou Wholesale Markets: A Practical Guide for Foreign Buyers',
    seoTitle: 'Guangzhou Wholesale Markets: A Buyer\u2019s Guide',
    excerpt:
      'Which market sells what, how the pricing works, and how to cover two or three of them in a single buying day without losing an afternoon to traffic.',
    category: 'Wholesale Markets',
    readTime: 9,
    date: '2026-08-22',
    dateLabel: 'August 2026',
    image: '/images/blog/guangzhou-wholesale-markets-guide.jpg',
    imageAlt: 'Busy wholesale market street in Guangzhou',
    lede: 'Guangzhou\u2019s wholesale markets are organised by category, and they are not next to each other. Knowing which district sells what is the difference between a productive day and a long one.',
    sections: [
      {
        heading: 'How the market system works',
        body: [
          'Most Guangzhou wholesale markets follow the same pattern: a cluster of buildings, each floor or street specialising further than the last, and a wholesale price that appears only once you are clearly buying in quantity rather than one piece.',
          'Retail and wholesale prices usually sit side by side. If you are quoted a retail figure, ask for the wholesale price and mention the quantity you have in mind. On the first visit you will often be quoted the higher number simply because you look like a walk-in customer.',
        ],
      },
      {
        heading: 'Which market for which product',
        list: [
          'Clothing and garments — Baima and the Shisanhang area, plus the stalls along Zhanxi Road',
          'Fabric and textiles — the Zhongda fabric cluster in Haizhu, one of the largest in the world',
          'Leather goods and bags — the Guihe and Sanyuanli areas',
          'Electronics and components — Huaqiangbei in Shenzhen, or Guangzhou\u2019s Dashatou for audio and accessories',
          'Jewellery and accessories — Liwan Plaza and the surrounding jewellery district',
          'Homeware, ceramics and hotel supplies — the Pazhou and Xingang East wholesale buildings',
        ],
      },
      {
        heading: 'A realistic one-day route',
        body: [
          'Pick one district. Two is possible. Three is optimistic once you factor in loading, sampling and the queues at lunch.',
          'A workable day starts early — many stalls open by 09:00 and the serious buying happens before the afternoon crowds. Work your list in the morning, use the middle of the day for anything that needs a second opinion, and leave the last hour for confirming quantities and arranging collection.',
        ],
        list: [
          '08:30 — leave the hotel so you arrive before the aisles fill up',
          '09:00–12:00 — work the main building on your list',
          '12:00–13:30 — lunch nearby; market food is fast and cheap',
          '13:30–16:00 — second building or a return visit to compare samples',
          '16:00–17:30 — agree prices, arrange shipping or collection',
        ],
      },
      {
        heading: 'Getting between markets',
        body: [
          'This is where most first-time buyers lose time. The distances look short on a map, but crossing Guangzhou in the middle of the day can take an hour, and a taxi queue outside a market at 17:00 is not the moment to start looking for a ride.',
          'Buyers who hire a car and driver for the day move between buildings without repacking samples each time, and the car becomes a place to leave purchases instead of carrying them from stall to stall.',
        ],
      },
      {
        heading: 'Practical notes',
        list: [
          'Bring a business card — it signals you are a buyer, not a tourist',
          'Cash still works everywhere; larger stalls take Alipay and WeChat Pay',
          'Ask for the catalogue and a quotation sheet (报价单); it makes follow-up far easier',
          'Photograph the stall number with your samples so you can find it again',
          'Most markets close for the Spring Festival and take a break over National Day',
        ],
      },
    ],
    related: { to: '/multi-day-sourcing-tour', label: 'Multi-day sourcing tours' },
  },

  {
    slug: 'baima-market-guangzhou',
    title: 'Baima Market, Guangzhou: What to Expect on Your First Buying Day',
    seoTitle: 'Baima Market, Guangzhou: What to Expect',
    excerpt:
      'Baima is the clothing wholesale hub most buyers start with — what it sells, how the floors are arranged, and how wholesale pricing is negotiated.',
    category: 'Wholesale Markets',
    readTime: 7,
    date: '2026-08-15',
    dateLabel: 'August 2026',
    image: '/images/blog/baima-market-guangzhou.jpg',
    imageAlt: 'Clothing stalls inside a Guangzhou garment wholesale market',
    lede: 'Baima is the name most foreign buyers hear first when they ask where to start with Guangzhou clothing wholesale. It is a good starting point, as long as you know what it is and what it is not.',
    sections: [
      {
        heading: 'What Baima actually is',
        body: [
          'Baima is a garment wholesale complex, not a single shop. Several floors of stalls sell clothing by category — womenswear, menswear, knitwear, denim — with each floor splitting into smaller specialisations as you walk.',
          'It is a trading market rather than a factory outlet, which means the sellers are usually agents for one or more production houses. That is useful: an agent can often source a variation or a size run that a single factory cannot.',
        ],
      },
      {
        heading: 'When to go',
        body: [
          'Mornings are for wholesale. The market opens around 08:30 and the aisles are at their most workable before 11:00. By early afternoon the stalls are increasingly serving single-piece walk-in trade and the atmosphere changes.',
          'If you are buying sample quantities, go on a weekday. Weekends bring local retail traffic that slows everything down.',
        ],
      },
      {
        heading: 'How pricing works',
        body: [
          'Stalls quote a per-piece price that falls as the quantity rises, usually at a few clear break points. Ask for the wholesale price directly and state the quantity you are considering — vague interest gets a retail number.',
          'Sample picks usually carry a small surcharge, which is normal and worth paying when you need to check fabric and finishing before placing an order.',
        ],
        list: [
          'Ask the minimum order quantity before you fall in love with a design',
          'Check whether the quoted price is ex-works or includes packing for export',
          'Ask how long a repeat order takes — the answer is often longer than you expect',
        ],
      },
      {
        heading: 'Nearby markets worth combining',
        body: [
          'Baima sits in a district with several other textile and garment buildings within a short drive, along with the fabric cluster in Haizhu. A driver who waits while you move between buildings makes a single day cover what would otherwise take three taxi rides.',
        ],
      },
      {
        heading: 'What to bring',
        list: [
          'A tape measure and a notebook — most stalls will not have either to lend',
          'A power bank; you will photograph far more than you expect',
          'A business card, and the WeChat ID of every seller you might reorder from',
          'A bag you can carry all day, or a car to leave things in',
        ],
      },
    ],
    related: { to: '/multi-day-sourcing-tour', label: 'Multi-day sourcing tours' },
  },

  {
    slug: 'factory-areas-near-guangzhou',
    title: 'Where the Factories Are: Manufacturing Clusters Near Guangzhou',
    seoTitle: 'Where the Factories Are Near Guangzhou',
    excerpt:
      'Electronics, furniture, ceramics, textiles, appliances and lighting are made in different cities. Here is which cluster to visit for which product.',
    category: 'Factory & Sourcing',
    readTime: 10,
    date: '2026-07-30',
    dateLabel: 'July 2026',
    image: '/images/blog/factory-areas-near-guangzhou.jpg',
    imageAlt: 'Industrial park outside Guangzhou',
    lede: 'The Pearl River Delta is one manufacturing region made of many specialised cities. Visiting the wrong cluster is the most expensive mistake a buyer can make, because it costs days rather than money.',
    sections: [
      {
        heading: 'Guangzhou itself',
        body: [
          'Central Guangzhou is increasingly commercial rather than industrial, but the outer districts still hold significant production. Panyu and Nansha lean towards electronics assembly, machinery and shipbuilding; Baiyun covers cosmetics, packaging and lighter consumer goods.',
          'Guangzhou is best treated as your base rather than your factory trip. You sleep, eat and meet agents here.',
        ],
      },
      {
        heading: 'Foshan — furniture, ceramics, appliances, lighting',
        body: [
          'Foshan is the closest heavy manufacturing city, about 40 minutes from central Guangzhou, and the one most buyers visit first.',
        ],
        list: [
          'Lecong — furniture, with the largest concentration of showrooms in China',
          'Chancheng — ceramics, tiles and sanitaryware',
          'Shunde — home appliances and components',
          'Nanhai — hardware, aluminium and lighting',
        ],
      },
      {
        heading: 'Dongguan — electronics, hardware, leather',
        body: [
          'Dongguan sits between Guangzhou and Shenzhen and has specialised industrial towns rather than one industrial zone.',
        ],
        list: [
          'Chang\u2019an and Tangxia — electronics, connectors, precision parts',
          'Houjie — furniture and leather goods',
          'Songshan Lake — advanced manufacturing, robotics and R&D plants',
          'Humen — garments and textiles',
        ],
      },
      {
        heading: 'Zhongshan — lighting above all',
        body: [
          'Guzhen in Zhongshan is the lighting capital: thousands of showrooms covering residential, commercial and outdoor fittings. If your product is lighting, this is the trip that matters.',
          'Zhongshan also handles furniture at Dachong, and hardware and locks at Xiaolan.',
        ],
      },
      {
        heading: 'Shenzhen — electronics, and the fastest way to a prototype',
        body: [
          'Shenzhen is where consumer electronics, components and rapid prototyping concentrate. Huaqiangbei is the famous market district, but the industrial parks in Bao\u2019an and Longgang are where production actually happens.',
          'Shenzhen also has the highest concentration of sourcing agents and design houses, which makes it useful for buyers who need help developing a product rather than simply ordering one.',
        ],
      },
      {
        heading: 'Zhuhai and Huizhou — quieter, larger, cheaper',
        body: [
          'Zhuhai and Huizhou are further out and less crowded. Zhuhai works well for appliances and printing supplies; Huizhou for electronics, petrochemicals and larger plants where land is cheaper and visits are less rushed.',
          'Both are roughly two to two and a half hours from Guangzhou, which makes them day-trip destinations with a car rather than a train-and-taxi combination.',
        ],
      },
      {
        heading: 'Planning a cluster trip',
        list: [
          'Group by city, never by product — plants in one city are usually within an hour of each other',
          'Two plants a day is realistic; four is a fiction once you allow for real meetings',
          'Ask each supplier for the nearest landmark, not just the address',
          'Book the car for the whole day, so an overrunning meeting does not strand you',
        ],
      },
    ],
    related: { to: '/factory-visits', label: 'Factory visit transport' },
  },

  {
    slug: 'baiyun-airport-arrival-guide',
    title: 'Arriving at Guangzhou Baiyun Airport: A Step-by-Step Guide',
    seoTitle: 'Guangzhou Baiyun Airport Arrival Guide',
    excerpt:
      'Immigration, baggage, SIM cards, the arrivals hall and how to find your driver once you are through — everything first-time visitors ask us.',
    category: 'Travel Tips',
    readTime: 8,
    date: '2026-07-18',
    dateLabel: 'July 2026',
    image: '/images/blog/baiyun-airport-arrival-guide.jpg',
    imageAlt: 'Arrivals hall at Guangzhou Baiyun International Airport',
    lede: 'Baiyun Airport is efficient and well signposted in English, but the arrivals process still surprises first-time visitors. Here is what happens, in order, and what to have ready.',
    sections: [
      {
        heading: 'Before you land',
        list: [
          'Have your passport, visa or visa-free entry details and a printed hotel address to hand',
          'Fill in the arrival card if one is handed out on board — pens are scarce on arrival',
          'Screenshot your hotel address in Chinese characters; a driver or taxi can use it directly',
          'Note your flight number; it is the fastest way for us to confirm the terminal',
        ],
      },
      {
        heading: 'Immigration and baggage',
        body: [
          'Baiyun has separate terminals, so check which one your flight uses before you plan the pickup — they are several kilometres apart and not walkable.',
          'Immigration queues move quickly for foreign passports, though an hour is possible when several wide-body flights land together. After immigration, follow the signs to baggage reclaim and then to customs. Most travellers clear the whole process in 45 to 75 minutes.',
        ],
      },
      {
        heading: 'Arriving on visa-free transit',
        body: [
          'Guangzhou Baiyun is one of the ports covered by China\u2019s 240-hour (10-day) visa-free transit policy, which lets travellers from the eligible countries enter without a visa when they are passing through to a third country. Under the Guangdong arrangements you can move around the province, so a Foshan factory visit or a weekend in Zhuhai sits inside the rules rather than outside them.',
          'At the airport, have three things in reach: a passport valid for at least six months, a confirmed onward ticket leaving inside the 240-hour window, and the address you are staying at. Use the transit counter ahead of immigration rather than joining the main passport queue — the staff there check the documents and stamp the entry.',
        ],
        list: [
          'Eligibility is decided at the border by the immigration officer, not approved in advance',
          'The country list and the rules change — confirm with the Chinese embassy or your airline before you fly',
          'Airlines check documents at check-in and will refuse boarding without a valid onward ticket',
          'Keep the paperwork in your hand luggage; you will be asked for it before you clear immigration',
        ],
      },
      {
        heading: 'Getting connected',
        body: [
          'There are SIM card counters in the arrivals hall selling tourist data packages, and the airport has free Wi-Fi that requires a passport number to activate. If you plan to use WeChat or Alipay, get data sorted before you leave the terminal.',
          'Currency exchange counters and ATMs are in the same area. Rates at the airport are not the best in the city, so change only what you need for the first day.',
        ],
      },
      {
        heading: 'Finding your driver',
        body: [
          'This is the part people worry about, and it is genuinely simple. Your driver waits inside the arrivals hall, past customs, holding a sign with your name. You do not need to call anyone or look for a car park.',
          'We track your flight number, so an early landing or a delay does not change anything — the driver is there when you walk out, and waiting time after landing is included.',
        ],
        list: [
          'Walk out of customs and look along the barrier line for your name',
          'If you cannot see the sign, connect to Wi-Fi and message us on WhatsApp',
          'Do not accept offers from touts in the hall — agree everything before you travel',
        ],
      },
      {
        heading: 'Getting into the city',
        body: [
          'The metro is cheap and reliable, and the airport express bus covers the main hotel districts. Both involve managing your own luggage.',
          'A private car is the simplest option if you are arriving after a long flight, carrying samples, or heading somewhere that is not next to a metro station. The drive to central Guangzhou is around 45 to 60 minutes; to Foshan, 70 to 90 minutes.',
        ],
      },
    ],
    related: { to: '/airport-transfer', label: 'Airport transfer service' },
  },

  {
    slug: 'restaurants-near-canton-fair',
    title: 'Where to Eat Around the Canton Fair',
    excerpt:
      'The fair complex sits in Pazhou, and the good food is not all inside the exhibition halls. Here is where to eat during a fair week without losing two hours.',
    category: 'Local Food',
    readTime: 7,
    date: '2026-07-05',
    dateLabel: 'July 2026',
    image: '/images/blog/restaurants-near-canton-fair.jpg',
    imageAlt: 'Cantonese restaurant table with dim sum in Guangzhou',
    lede: 'A fair day is long, the halls are enormous, and the queues at peak lunch are real. Knowing a few options by distance saves you a surprising amount of time over a three-day visit.',
    sections: [
      {
        heading: 'Inside the complex',
        body: [
          'The exhibition halls run food courts on the upper levels. They are the fastest option and perfectly adequate — rice and noodle bowls, some Western counters, and a lot of seating. Prices are fair for the convenience.',
          'Go early or late. Between about 12:00 and 13:00 the queues are at their worst and you will spend more time standing than eating.',
        ],
      },
      {
        heading: 'Walking distance from Pazhou',
        body: [
          'There are restaurants attached to the hotels around the complex, and a cluster of Cantonese places within a five to ten minute walk of the main gates. These fill up quickly with exhibitors during a fair, so a reservation helps if you are entertaining a supplier.',
        ],
      },
      {
        heading: 'Worth a short drive',
        body: [
          'Zhujiang New Town is fifteen to twenty minutes away by car and has the widest range — Cantonese, Sichuan, Japanese, Middle Eastern, Indian and hotel dining rooms. After a day on your feet, a proper meal is worth the ride.',
          'Further out, the older districts around Liwan and Yuexiu do the traditional Cantonese food best: roast meats, claypot rice and late-night congee. This is also where prices are lowest.',
        ],
      },
      {
        heading: 'What to order if you are new to Cantonese food',
        list: [
          'Dim sum — go before 11:00, when it is freshest and the trolleys are still moving',
          'Roast goose or roast pork — the classic Cantonese test of a kitchen',
          'Steamed fish — ordered whole, priced by weight, so ask before you commit',
          'Claypot rice — a cold-evening dish, worth the 20-minute wait',
          'Congee and noodles — the standard late-night meal after a fair day',
        ],
      },
      {
        heading: 'Practical points',
        list: [
          'Most restaurants take Alipay and WeChat Pay; a few smaller ones are cash only',
          'English menus are common in Pazhou and Zhujiang New Town, less so further out',
          'If you have a driver for the day, ask them where they would eat nearby — they usually know',
          'Book ahead during the fair; walk-in tables are scarce after 18:30',
        ],
      },
    ],
    related: { to: '/canton-fair-transfer', label: 'Canton Fair transfer' },
  },

  {
    slug: 'canton-fair-first-timer-guide',
    title: 'Your First Canton Fair: How to Plan the Week',
    excerpt:
      'Which phase to attend, how to register, what the halls are really like, and how to organise transport so you are not queueing for a taxi at closing time.',
    category: 'Canton Fair',
    readTime: 11,
    date: '2026-06-20',
    dateLabel: 'June 2026',
    image: '/images/blog/canton-fair-first-timer-guide.jpg',
    imageAlt: 'Exhibition halls at the Canton Fair complex in Pazhou',
    lede: 'The Canton Fair runs in three phases across two weeks, and each phase covers completely different industries. Picking the right one is the single most important decision you will make.',
    sections: [
      {
        heading: 'The three phases',
        body: [
          'The fair splits into three phases, each roughly five days, with a short gap between them for exhibitors to change over.',
        ],
        list: [
          'Phase 1 — electronics, home appliances, lighting, machinery, hardware and tools',
          'Phase 2 — consumer goods, gifts, home decor, furniture, ceramics, glass and garden products',
          'Phase 3 — textiles, garments, shoes, bags, medical devices, food and office supplies',
        ],
      },
      {
        heading: 'Registering',
        body: [
          'You need a buyer badge. Registration can be done online in advance or on site, and you will need your passport plus a business card or company details. Online registration in advance saves a queue on the first morning.',
          'Badges are valid for the whole fair, so once you have it you can move between phases and halls freely.',
        ],
      },
      {
        heading: 'What the halls are actually like',
        body: [
          'The complex is enormous — several halls across multiple buildings, connected by walkways and shuttle buses. Visitors routinely walk ten to fifteen kilometres a day without noticing.',
          'Exhibitors are grouped by product category and region. The catalogue and the fair app are both worth using: walking the halls hoping to stumble on your category is not a plan.',
        ],
        list: [
          'Comfortable shoes matter more than anything else you pack',
          'Bring a power bank, water and a notebook for booth numbers',
          'Many exhibitors will scan your badge — expect follow-up messages afterwards',
          'Afternoons are busier; the first two hours of the day are the most productive',
        ],
      },
      {
        heading: 'Where to stay',
        body: [
          'Hotels in Pazhou fill up months ahead and prices double during the fair. Many regulars stay in Zhujiang New Town or Tianhe instead, where there are more rooms and a wider choice of restaurants, and accept a 20 to 30 minute drive each way.',
        ],
      },
      {
        heading: 'Getting there and back',
        body: [
          'The metro runs to the Pazhou complex and is the cheapest option. It is also crowded at closing time, and standing on a packed train after a full day on concrete is nobody\u2019s idea of a good evening.',
          'The fair also runs a shuttle bus between the complex and a list of partner hotels, free on those routes. It is a perfectly good option if your hotel is on that list and you are happy to travel on its timetable — check the official route list for the session you are attending before you commit to a room.',
          'A car and driver for the day removes the whole problem. Your driver drops you at the gate in the morning, waits nearby, and is at the pickup point when you come out — no queue, no negotiating, and somewhere to leave samples and bags during the day.',
          'For buyers meeting suppliers in the evening, having a car also means you can move between the fair, a factory and a dinner without going back to the hotel first. The fair runs twice a year, in April and October, and both sessions are busy enough that we suggest booking the car at the same time as the hotel rather than afterwards.',
        ],
      },
      {
        heading: 'Making the fair work for you',
        list: [
          'Decide your phase first, then book flights — the gap weeks are cheaper',
          'Shortlist exhibitors in advance from the online catalogue',
          'Book meetings in the morning when everyone is fresh',
          'Keep one day free at the end for factory visits — most suppliers are within two hours',
          'Confirm sample shipping and payment terms before you leave the booth',
        ],
      },
    ],
    related: { to: '/canton-fair-transfer', label: 'Canton Fair transfer' },
  },

  {
    slug: 'guangzhou-vs-shenzhen-sourcing',
    title: 'Guangzhou or Shenzhen? Choosing Where to Source',
    seoTitle: 'Guangzhou or Shenzhen? Where to Source',
    excerpt:
      'Two cities an hour apart that do very different things. A comparison of product categories, factory access, costs and which one fits your product.',
    category: 'Factory & Sourcing',
    readTime: 9,
    date: '2026-06-08',
    dateLabel: 'June 2026',
    image: '/images/blog/guangzhou-vs-shenzhen-sourcing.jpg',
    imageAlt: 'Modern city skyline in the Pearl River Delta',
    lede: 'Buyers often arrive assuming the two cities are interchangeable. They are not, and the difference decides where you should spend your week.',
    sections: [
      {
        heading: 'The short version',
        body: [
          'Guangzhou is the trading and light-manufacturing capital: textiles, furniture, ceramics, homeware, gifts, leather and building materials. Shenzhen is the electronics and technology capital, with the strongest concentration of component suppliers, design houses and rapid prototyping anywhere in China.',
          'If your product is soft goods or home goods, base yourself in Guangzhou. If it has a circuit board in it, base yourself in Shenzhen.',
        ],
      },
      {
        heading: 'Product categories',
        list: [
          'Guangzhou and Foshan — clothing, textiles, furniture, ceramics, lighting, appliances, hotel supplies',
          'Dongguan — electronics manufacturing, hardware, leather, furniture',
          'Shenzhen — consumer electronics, PCBs, components, IoT devices, drones, smart home',
          'Zhongshan — lighting, hardware, furniture',
          'Zhuhai and Huizhou — appliances, printing supplies, petrochemicals, larger-scale plants',
        ],
      },
      {
        heading: 'Factory access',
        body: [
          'In Guangzhou, many suppliers you meet are trading companies rather than factories. That is not automatically bad — a good agent can consolidate several plants and handle export paperwork — but you should know which one you are talking to. Ask directly whether they own the production line.',
          'In Shenzhen the opposite is common: a supplier may be the factory but have no experience exporting consumer goods, or no English-speaking export staff. Expect to bridge that gap yourself or through an agent.',
        ],
      },
      {
        heading: 'Costs',
        body: [
          'Manufacturing costs are broadly comparable between the two, with Huizhou and the outer parts of Dongguan usually coming in lower on land-intensive products. What differs more sharply is the cost of doing business: hotel rates, meals and transport are noticeably higher in Shenzhen, particularly around its technology districts.',
          'Sourcing-agent fees and export-service charges are similar in both cities.',
        ],
      },
      {
        heading: 'Which should you visit?',
        list: [
          'Only soft goods or homeware, one week — Guangzhou and Foshan',
          'Electronics or anything with a PCB — Shenzhen, with a day in Dongguan',
          'A mixed basket of home and consumer electronics — base in Guangzhou, spend two days in Shenzhen',
          'Developing a new product rather than ordering an existing one — Shenzhen, without question',
        ],
      },
      {
        heading: 'Doing both in one trip',
        body: [
          'The two cities are about two hours apart by road, which makes a combined trip entirely practical. Plenty of buyers work Guangzhou early in the week and move to Shenzhen for the back half, or run Guangzhou as a base and take a car down for a two-day Shenzhen block.',
          'Keeping one car and driver across both cities is usually simpler than switching to trains mid-trip, especially if you are carrying samples between meetings.',
        ],
      },
    ],
    related: { to: '/intercity-transfer', label: 'Intercity transfers' },
  },

  {
    slug: 'negotiating-with-chinese-suppliers',
    title: 'Negotiating with Chinese Suppliers: What Actually Works',
    seoTitle: 'How to Negotiate with Chinese Suppliers',
    excerpt:
      'Price, minimum order quantities, payment terms and the small cultural moves that make a negotiation go your way — without damaging the relationship.',
    category: 'Factory & Sourcing',
    readTime: 9,
    date: '2026-05-25',
    dateLabel: 'May 2026',
    image: '/images/blog/negotiating-with-chinese-suppliers.jpg',
    imageAlt: 'Meeting room table prepared for a supplier negotiation',
    lede: 'Most negotiation advice aimed at foreign buyers is either obvious or wrong. These are the things that consistently change the outcome in a real supplier meeting.',
    sections: [
      {
        heading: 'Come with a real number',
        body: [
          'Suppliers price against the quantity they believe you will actually order. If you ask for pricing without giving a quantity, you get a defensive number. If you give a serious quantity, you get the number they would genuinely work at.',
          'Have a target price and a walk-away price before the meeting. Telling a supplier your target openly is normal here and usually saves a round of posturing.',
        ],
      },
      {
        heading: 'Understand how price breaks work',
        list: [
          'Material cost dominates at low volumes; labour and overhead matter more as volume rises',
          'Price breaks usually appear at round quantities — 500, 1,000, 5,000',
          'Tooling, moulds and setup are often quoted separately and are negotiable',
          'Packing and export cartons are sometimes excluded — always ask',
        ],
      },
      {
        heading: 'Minimum order quantity',
        body: [
          'MOQ is frequently softer than the first answer suggests. A supplier quoting 2,000 pieces may accept 500 for a first order if you make clear that a successful trial leads to repeat business. This is a normal conversation, not a trick.',
          'One practical option is to order a mixed first container: several designs at lower quantity each, so you test the market while giving the factory enough total volume to be worthwhile.',
        ],
      },
      {
        heading: 'Payment terms',
        list: [
          'A 30% deposit with the balance against the bill of lading is the standard structure',
          'Full payment up front is a warning sign, not a bargain',
          'Ask what happens if the goods fail inspection — get it in writing',
          'For a first order, a third-party inspection before the balance is cheap insurance',
        ],
      },
      {
        heading: 'The relationship side',
        body: [
          'Chinese business negotiation is less about winning a round than about establishing that you are a counterpart worth investing in. Suppliers will often accept a thinner margin on the first order if they believe the second one is coming.',
        ],
        list: [
          'Do not open with an insultingly low number — it reads as unserious, not clever',
          'Never criticise a supplier in front of their colleagues',
          'Accept the tea, and the meal if it is offered; this is where the real agreement often happens',
          'Confirm everything discussed in writing afterwards, in simple English',
          'Follow up on schedule — reliability is the strongest negotiating position you have',
        ],
      },
      {
        heading: 'On the day',
        body: [
          'Meetings at factories often run long, and plant visits are rarely close to public transport. A car waiting outside means you can accept a second meeting at short notice instead of leaving early to find a ride.',
        ],
      },
    ],
    related: { to: '/factory-visits', label: 'Factory visit transport' },
  },

  {
    slug: 'weekend-trips-from-guangzhou',
    title: 'Six Weekend Trips from Guangzhou',
    excerpt:
      'Use a spare weekend in the delta well. Six destinations within a few hours of the city, from a furniture town to a UNESCO village.',
    category: 'Travel Tips',
    readTime: 8,
    date: '2026-05-12',
    dateLabel: 'May 2026',
    image: '/images/blog/weekend-trips-from-guangzhou.jpg',
    imageAlt: 'Traditional village architecture in Guangdong province',
    lede: 'Business trips often leave a weekend free in the middle. These are the destinations we drive most often when a visitor has a spare two days.',
    sections: [
      {
        heading: 'Foshan — an hour, and not just factories',
        body: [
          'Foshan is the easiest escape from Guangzhou and the most underrated. Away from the industrial estates it has the Ancestral Temple, the Cantonese opera tradition, Kung Fu heritage and a genuinely excellent food scene.',
          'Foshan is also where Cantonese cooking arguably reaches its high point — the city takes its restaurants seriously.',
        ],
      },
      {
        heading: 'Kaiping — UNESCO watchtowers',
        body: [
          'About two hours south-west, Kaiping is UNESCO-listed for its diaolou — early twentieth-century watchtowers built by returning overseas Chinese, mixing Chinese and European architectural styles.',
          'The villages are spread across the countryside, which makes this one of the few destinations where a car and driver is close to essential. Two days lets you see the main clusters properly.',
        ],
      },
      {
        heading: 'Zhaoqing — lake and limestone hills',
        body: [
          'Two hours west, Zhaoqing pairs a large lake with the Seven Star Crags. It is a walking and boat destination, popular with domestic visitors and comparatively untouched by international tourism.',
        ],
      },
      {
        heading: 'Shunde — the destination for serious eaters',
        body: [
          'Shunde is part of Foshan and is regarded as one of the birthplaces of Cantonese cuisine. People travel here specifically to eat: double-skin milk, steamed fish, and a long list of dishes that do not travel well beyond the region.',
          'It is an easy day trip or an excellent overnight, an hour from central Guangzhou.',
        ],
      },
      {
        heading: 'Zhongshan and Zhuhai — coast and history',
        body: [
          'Zhongshan has the childhood home of Sun Yat-sen and a well-preserved old town. Zhuhai adds a long coastal promenade, the Lovers\u2019 Road seafront and easy access to the Gongbei crossing into Macao, China.',
          'The two cities sit next to each other and work well as a two-day loop.',
        ],
      },
      {
        heading: 'Hong Kong, China — via the high-speed rail',
        body: [
          'Hong Kong, China is under an hour away by high-speed train from Guangzhou South. If you have a spare day and your entry documents allow it, it is a straightforward add-on to a Guangzhou trip.',
          'We can drop you at Guangzhou South Station or at the Shenzhen border crossing, whichever suits your plans.',
        ],
      },
      {
        heading: 'Arranging the weekend',
        list: [
          'Book a car by the day rather than by the journey — you will want stops',
          'Sunday evenings are the heaviest traffic; returning late on Sunday is not ideal',
          'Most of these are 1.5 to 2.5 hours each way, so start early',
          'Tell us the itinerary and we will plan a sensible order and realistic timings',
        ],
      },
    ],
    related: { to: '/private-driver', label: 'Private driver by the day' },
  },

  {
    slug: 'business-etiquette-in-china',
    title: 'Business Etiquette in China: A Short, Practical Guide',
    seoTitle: 'Business Etiquette in China: Practical Tips',
    excerpt:
      'Meetings, cards, meals, gifts and the WeChat habits that matter — the small things that change how a Chinese counterpart reads you.',
    category: 'Factory & Sourcing',
    readTime: 8,
    date: '2026-04-30',
    dateLabel: 'April 2026',
    image: '/images/blog/business-etiquette-in-china.jpg',
    imageAlt: 'Formal meeting room set for a business meeting in China',
    lede: 'Nobody expects a first-time visitor to get everything right, but a handful of small habits signal that you take the relationship seriously — and that changes how you are treated.',
    sections: [
      {
        heading: 'Meetings',
        list: [
          'Arrive a few minutes early; the senior person on the other side sets the tone',
          'Bring more business cards than you think you need, and offer them with both hands',
          'Expect some polite conversation before business; do not rush to your agenda',
          'The most senior person speaks last, so address the room rather than one person',
          'Silence is not disagreement — allow a beat before filling it',
        ],
      },
      {
        heading: 'Names and cards',
        body: [
          'Chinese names put the family name first: Li Wei is Mr Li to you, not Mr Wei. Many businesspeople adopt an English given name for convenience, and using it is perfectly acceptable once they offer it.',
          'Look at a business card for a moment before putting it away, and do not write on it or put it straight in a back pocket. On site visits, name cards are the fastest way to be remembered by the right people.',
        ],
      },
      {
        heading: 'Meals',
        body: [
          'If you are invited to a meal, it is a good sign. Expect shared dishes on a lazy Susan, and expect the host to order far too much food — this is generosity, not wastefulness.',
        ],
        list: [
          'Wait for the host to start, and for the senior guest to be served first',
          'Try everything; declining outright is read as distance',
          'Toasting matters — if you do not drink alcohol, it is fine to say so and toast with tea',
          'The host pays. Offer once, do not insist, and reciprocate with a meal of your own later',
        ],
      },
      {
        heading: 'Gifts',
        body: [
          'Small gifts are appreciated and should be modest: something from your own country, a branded notebook, a good pen. Avoid anything expensive, which creates obligation, and avoid clocks, knives and anything in sets of four — all carry unlucky associations.',
          'If you receive a gift, accept it with both hands. It is normal not to open it in front of the giver.',
        ],
      },
      {
        heading: 'WeChat rather than email',
        body: [
          'Business in China runs on WeChat. A supplier who replies slowly to email may answer in seconds on WeChat, and voice messages are entirely normal even for commercial discussions.',
          'Set up WeChat before you travel and add every supplier and contact you meet. It becomes your address book, your quotation archive and your follow-up channel in one place.',
        ],
      },
      {
        heading: 'Punctuality and time',
        body: [
          'Be on time for meetings, especially the first one. When you are the guest, the other side will often be more relaxed about schedule than you expect — but that flexibility is theirs to extend, not yours.',
          'Factory visits routinely run over. Leaving slack in the day, rather than stacking three plants back to back, makes the whole trip calmer and gives you room to accept an unplanned meeting.',
        ],
      },
    ],
    related: { to: '/factory-visits', label: 'Factory visit transport' },
  },
]

export const articleSlugs = articles.map((a) => a.slug)

export function articleBySlug(slug) {
  return articles.find((a) => a.slug === slug)
}

/** Newest first, which is how the index page lists them. */
export const articlesByDate = [...articles].sort((a, b) => (a.date < b.date ? 1 : -1))

/** Same category, then anything else — used for the "read next" strip. */
export function relatedArticles(article, limit = 3) {
  const others = articlesByDate.filter((a) => a.slug !== article.slug)
  const sameCategory = others.filter((a) => a.category === article.category)
  const rest = others.filter((a) => a.category !== article.category)
  return [...sameCategory, ...rest].slice(0, limit)
}
