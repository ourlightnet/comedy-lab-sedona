/* Fund the Research registry.
   checkoutUrl: the Supabase "checkout" function URL. Once it is set, the cart
   checks out through Stripe with every item listed. Prices are re-checked on
   the server (supabase/functions/checkout), so keep both lists in step.
   anyLink: optional Stripe "customers choose what to pay" Payment Link, used
   as a fallback checkout before checkoutUrl is set.
   covered / coveredAmount: what donors have already paid for.
   phase: 2 puts an item in the Phase 2 (play along) request;
   phase: 'nice' lists it under Nice to have, outside the totals. */
window.FUND = {
  checkoutUrl: '',
  anyLink: '',
  // all.link: optional Stripe Payment Link for exactly this amount, used by
  // the Buy now button until checkoutUrl is set.
  all: { id: 'all', title: 'Fund the entire experiment', amount: 7951.49, link: '' },
  donors: [
    { name: 'City of Sedona', amount: 4600, note: 'Grant. Covers the house, crew beds, food and event insurance, the third crew room, and $48.51 toward costumes.' }
  ],
  inkind: [
    { name: 'LightNet', amount: 1500, note: 'The website.' },
    { name: 'Sedona Quantum Consciousness', url: 'https://sedonaqc.org/', amount: 300, note: 'The costume closet: ETs, angels and ascended masters.' }
  ],
  items: [
    { id: 'house', icon: '🏡', title: 'The laboratory', desc: 'Twin Pines: four bedrooms, a hot tub and unknown amounts of comedy. Every room is a set.', unit: 2622.36, count: 1, covered: 'City of Sedona' },
    { id: 'motel', icon: '🛏️', title: 'The crew bunker', desc: 'Two rooms at Motel in the Pines so the crew can sleep between experiments, March 7 to 10.', unit: 652.75, count: 1, covered: 'City of Sedona' },
    { id: 'room', icon: '🛌', title: 'One more crew bunk', desc: 'A third room at Motel in the Pines so the whole crew gets a bed, March 7 to 10.', unit: 326.38, count: 1, covered: 'City of Sedona' },
    { id: 'food', icon: '🍕', title: 'Brain fuel', desc: '48 hours of comedy runs on pizza. Science has confirmed this.', unit: 600, count: 1, covered: 'City of Sedona' },
    { id: 'tags', icon: '🎞️', title: 'The lab stamp', desc: 'Our opening and closing tags, branded on every clip that escapes the house.', unit: 400, count: 1 },
    { id: 'costumes', icon: '👽', title: 'The wardrobe department', desc: 'More antennae, halos and ascended-master robes for the costume closet.', unit: 400, count: 1, coveredAmount: 48.51 },
    { id: 'insurance', icon: '🦺', title: 'Lab safety', desc: 'Event insurance, in case the experiment gets out of hand.', unit: 350, count: 1, covered: 'City of Sedona' },
    { id: 'comedian', icon: '🎤', title: 'Sponsor a test subject', desc: 'Each of the nine comedians gets a $400 stipend. They signed the waiver. Mostly.', unit: 400, count: 9, label: 'comedian' },
    { id: 'editor', icon: '🎬', title: 'Fund a lab technician', desc: '$400 stipends for the crew: an editor and an editor/special FX who turn pure chaos into 60-second clips, plus hair/makeup/costumes.', unit: 400, count: 3, label: 'crew member' },
    { id: 'bounty', icon: '🏆', title: 'The prize pot', desc: '$300 each quarter to the team with the most upvoted clip. Competition is good for science.', unit: 300, count: 4, label: 'quarter', phase: 2 },
    { id: 'boost', icon: '🚀', title: 'Launch fuel', desc: '$300 each quarter to boost the clips into the algorithm\'s orbit.', unit: 300, count: 4, label: 'quarter', phase: 2 }
  ]
};
