/* Fund the Lab registry.
   checkoutUrl: the Supabase "checkout" function URL. Once it is set, the cart
   checks out through Stripe with every item listed. Prices are re-checked on
   the server (supabase/functions/checkout), so keep both lists in step.
   anyLink: optional Stripe "customers choose what to pay" Payment Link, used
   as a fallback checkout before checkoutUrl is set.
   covered / coveredAmount: what donors have already paid for. */
window.FUND = {
  checkoutUrl: '',
  anyLink: '',
  all: { id: 'all', title: 'Fund the whole Lab', amount: 12475.11 },
  donors: [
    { name: 'City of Sedona', amount: 4600, note: 'Grant. Covers the house, crew beds, food and clip tags, with $224.89 toward the editors.' },
    { name: 'LightNet', amount: 250, note: 'Costumes, plus the website, donated in kind.' }
  ],
  items: [
    { id: 'house', icon: '🏡', title: 'The house', desc: 'Twin Pines, the Airbnb where it all happens. Every room is a set.', unit: 2622.36, count: 1, covered: 'City of Sedona' },
    { id: 'motel', icon: '🛏️', title: 'Crew beds', desc: 'Two rooms at Motel in the Pines for crew and support staff, March 7 to 10.', unit: 652.75, count: 1, covered: 'City of Sedona' },
    { id: 'food', icon: '🍕', title: 'Feed the house', desc: 'Food for 48 hours of comedy.', unit: 600, count: 1, covered: 'City of Sedona' },
    { id: 'tags', icon: '🎞️', title: 'Clip tags', desc: 'The branded opening and closing tags on every clip.', unit: 500, count: 1, covered: 'City of Sedona' },
    { id: 'comedian', icon: '🎤', title: 'The comedians', desc: '$500 stipends for the nine comedians in the house.', unit: 500, count: 9, label: 'seat' },
    { id: 'editor', icon: '🎬', title: 'The editors', desc: '$500 stipends for the two editors cutting the clips.', unit: 500, count: 2, label: 'editor', coveredAmount: 224.89 },
    { id: 'bounty', icon: '🏆', title: 'The monthly bounty', desc: '$300 a month to the winning clip team.', unit: 300, count: 12, label: 'month' },
    { id: 'boost', icon: '🚀', title: 'Social boosting', desc: '$300 a month to get the clips seen.', unit: 300, count: 12, label: 'month' }
  ]
};
