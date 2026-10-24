/* Fund the Research registry.
   checkoutUrl: the Supabase "checkout" function URL. Once it is set, the cart
   checks out through Stripe with every item listed. Prices are re-checked on
   the server (supabase/functions/checkout), so keep both lists in step.
   anyLink: optional Stripe "customers choose what to pay" Payment Link, used
   as a fallback checkout before checkoutUrl is set.
   covered / coveredAmount: what donors have already paid for.
   phase: 2 puts an item in the Phase 2 (play along) request. */
window.FUND = {
  checkoutUrl: '',
  anyLink: '',
  all: { id: 'all', title: 'Fund the entire experiment', amount: 8025.11 },
  donors: [
    { name: 'City of Sedona', amount: 4600, note: 'Grant. Covers the house, crew beds, food and clip tags, with $224.89 toward the editors.' },
    { name: 'LightNet', amount: 250, note: 'Costumes, plus the website, donated in kind.' }
  ],
  items: [
    { id: 'house', icon: '🏡', title: 'The laboratory', desc: 'Twin Pines: four bedrooms, a hot tub and unknown amounts of comedy. Every room is a set.', unit: 2622.36, count: 1, covered: 'City of Sedona' },
    { id: 'motel', icon: '🛏️', title: 'The crew bunker', desc: 'Two rooms at Motel in the Pines so the crew can sleep between experiments, March 7 to 10.', unit: 652.75, count: 1, covered: 'City of Sedona' },
    { id: 'food', icon: '🍕', title: 'Brain fuel', desc: '48 hours of comedy runs on pizza. Science has confirmed this.', unit: 600, count: 1, covered: 'City of Sedona' },
    { id: 'tags', icon: '🎞️', title: 'The lab stamp', desc: 'Our opening and closing tags, branded on every clip that escapes the house.', unit: 500, count: 1, covered: 'City of Sedona' },
    { id: 'insurance', icon: '🦺', title: 'Lab safety', desc: 'Event insurance, in case the experiment gets out of hand.', unit: 350, count: 1 },
    { id: 'comedian', icon: '🎤', title: 'Sponsor a test subject', desc: 'Each of the nine comedians gets a $500 stipend. They signed the waiver. Mostly.', unit: 500, count: 9, label: 'comedian' },
    { id: 'editor', icon: '🎬', title: 'Fund a lab technician', desc: '$500 stipends for the two editors who turn pure chaos into 60-second clips.', unit: 500, count: 2, label: 'editor', coveredAmount: 224.89 },
    { id: 'bounty', icon: '🏆', title: 'The prize pot', desc: '$300 each quarter to the team with the most upvoted clip. Competition is good for science.', unit: 300, count: 4, label: 'quarter', phase: 2 },
    { id: 'boost', icon: '🚀', title: 'Launch fuel', desc: '$300 each quarter to boost the clips into the algorithm\'s orbit.', unit: 300, count: 4, label: 'quarter', phase: 2 }
  ]
};
