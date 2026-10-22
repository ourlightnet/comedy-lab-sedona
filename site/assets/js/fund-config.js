/* Fund the Lab registry.
   Paste each Stripe Payment Link into `link`. Until a link is pasted, that
   button says "Coming soon". When something gets funded, raise `funded`. */
window.FUND = {
  all: { title: 'Fund the whole Lab', amount: 11975.11, link: '' },
  any: { title: 'Chip in any amount', link: '' },
  items: [
    { id: 'house', icon: '🏡', title: 'The house', desc: 'Twin Pines, the Airbnb where it all happens. Every room is a set.', amount: 2622.36, count: 1, funded: 0, link: '' },
    { id: 'comedian', icon: '🎤', title: 'A comedian’s seat', desc: 'A $500 stipend for one of the nine comedians in the house.', amount: 500, count: 9, funded: 0, link: '' },
    { id: 'editor', icon: '🎬', title: 'An editor', desc: 'A $500 stipend for one of the two editors cutting the clips.', amount: 500, count: 2, funded: 0, link: '' },
    { id: 'motel', icon: '🛏️', title: 'Crew beds', desc: 'Two rooms at Motel in the Pines for crew and support staff, March 7 to 10.', amount: 652.75, count: 1, funded: 0, link: '' },
    { id: 'food', icon: '🍕', title: 'Feed the house', desc: 'Food for 48 hours of comedy. Dead grandmothers are known to explain dimensions with pizza.', amount: 600, count: 1, funded: 0, link: '' },
    { id: 'bounty', icon: '🏆', title: 'A month’s bounty', desc: 'The $300 prize for one month’s winning clip team.', amount: 300, count: 12, funded: 0, link: '' },
    { id: 'boost', icon: '🚀', title: 'A month of boosting', desc: '$300 of social media boosting to get a month of clips seen.', amount: 300, count: 12, funded: 0, link: '' }
  ]
};
