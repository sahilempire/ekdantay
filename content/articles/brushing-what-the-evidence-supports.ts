import type { Post } from '../types'

export const brushingWhatTheEvidenceSupports: Post = {
  slug: 'brushing-what-the-evidence-supports',
  title: 'Brushing your teeth: what the evidence actually supports',
  seoTitle: 'How to Brush Your Teeth: What the Evidence Actually Shows',
  description:
    'Most brushing advice is folklore. The parts with real evidence behind them are the fluoride concentration on the tube, not rinsing afterwards, and cleaning between the teeth. Here is what the research supports.',
  date: '2026-07-22',
  updated: '2026-08-30',
  author: 'Dr. Divya Bharti',
  category: 'Prevention',
  image: '/images/gallery-4.webp',
  imageAlt: 'Daily oral hygiene supplies including toothbrush and toothpaste',
  excerpt:
    'There is one free change that measurably reduces decay and almost nobody makes it: stop rinsing your mouth out after brushing. Here is why, and what else survives contact with the evidence.',
  related: ['how-a-cavity-forms', 'bleeding-gums-and-gum-disease'],
  body: [
    {
      kind: 'p',
      text: 'Brushing advice has accumulated a lot of ritual. Some of it matters a great deal, some of it makes no measurable difference, and at least one very common habit actively undoes the thing you just did. It is worth separating them.',
    },
    { kind: 'h2', text: 'The number on the tube is the active ingredient' },
    {
      kind: 'p',
      text: 'Toothpaste is mostly a delivery vehicle. Its flavour, foam and abrasive content contribute very little to preventing decay. The fluoride does, and the concentration is printed on the tube in parts per million.',
    },
    {
      kind: 'p',
      text: 'The Cochrane review of fluoride toothpaste concentrations found that the benefit compared with a non-fluoride paste is only statistically significant at 1000 ppm and above, and that the effect increases with concentration. Around 1000 to 1250 ppm delivers roughly a 23 percent reduction in decay, with higher concentrations doing more.',
    },
    {
      kind: 'figure',
      value: '1000 ppm',
      label: 'The concentration below which fluoride toothpaste has not been shown to significantly reduce decay compared with a non-fluoride paste',
      source: 'Walsh T et al., Cochrane Database of Systematic Reviews',
    },
    {
      kind: 'p',
      text: 'This is worth checking, particularly on toothpaste bought for children, because a number of products marketed for young children are dosed well below that threshold. Fluoride level in young children does need balancing against the risk of fluorosis while the permanent teeth are forming, which is a conversation to have with us rather than a rule to apply blindly, but an under-dosed paste is doing very little.',
    },
    { kind: 'h2', text: 'Spit, do not rinse' },
    {
      kind: 'note',
      title: 'The free change almost nobody makes',
      text: 'After brushing, spit the excess out and stop. Do not rinse with water, and do not follow it with mouthwash. The thin film of concentrated fluoride left on the teeth keeps working for a long time afterwards, and a mouthful of water washes it straight down the sink. This costs nothing and there is good evidence it reduces decay.',
    },
    {
      kind: 'p',
      text: 'If you like using a fluoride mouthwash, use it at a different time of day rather than immediately after brushing, where it dilutes a stronger product with a weaker one.',
    },
    { kind: 'h2', text: 'Technique beats effort' },
    {
      kind: 'p',
      text: 'The goal is disrupting plaque at the margin where the tooth meets the gum, because that is where gum disease starts. Plaque is soft. It does not need scrubbing off; it needs the bristles to physically reach it.',
    },
    {
      kind: 'ul',
      items: [
        'Use a soft brush. Medium and hard brushes do not clean better and they do cause abrasion. Splayed bristles after a few weeks mean you are pressing far too hard.',
        'Angle the bristles at about 45 degrees toward the gum line rather than straight at the tooth, and use small circular or short back-and-forth movements. Long horizontal scrubbing is what carves notches into the necks of teeth.',
        'Two minutes, twice a day. Most people substantially overestimate how long they brush; timing it once is genuinely informative.',
        'Make one of those times last thing at night. Saliva flow falls during sleep, so both the fluoride and any remaining sugar sit undisturbed for hours.',
        'Do not brush for about thirty minutes after vomiting or after acidic food and drink. Enamel is temporarily softened and brushing at that moment removes the softened layer.',
      ],
    },
    { kind: 'h2', text: 'The surfaces a brush cannot reach' },
    {
      kind: 'p',
      text: 'A toothbrush cleans three of the five surfaces of a tooth. The two contact surfaces where each tooth meets its neighbour are left largely untouched, and a substantial share of decay and most early gum disease begins in precisely those spots.',
    },
    {
      kind: 'p',
      text: 'Interdental brushes are the more effective option wherever the space allows one to fit, and they are easier to use consistently than floss. Floss is for the tight contacts where a brush will not pass. The choice between them matters far less than doing one of them daily, and the useful reframing is that this is not an optional extra on top of brushing but the other half of the job.',
    },
    { kind: 'h2', text: 'Electric or manual' },
    {
      kind: 'p',
      text: 'Powered brushes, particularly oscillating-rotating designs, show a modest but consistent advantage in reducing plaque and gingivitis in reviews of the evidence. The advantage is real but smaller than most marketing implies, and it is dwarfed by whether you brush twice a day, for long enough, at the right angle, with a fluoride paste you do not rinse away.',
    },
    {
      kind: 'p',
      text: 'Where powered brushes genuinely help is with pressure. Many have a sensor that stops you pressing too hard, and for the substantial number of people whose brushes are splayed after a month, that alone is worth it. The built-in timer helps too.',
    },
    { kind: 'h2', text: 'What brushing cannot fix' },
    {
      kind: 'p',
      text: 'Brushing controls plaque. It does not address how often you eat, and the frequency of sugar intake is at least as strong a driver of decay as cleaning is. Someone brushing impeccably twice a day while sipping sweet tea from a flask all afternoon will still get cavities, because the tooth is spending most of the day below the pH at which enamel dissolves.',
    },
    {
      kind: 'p',
      text: 'Nor does brushing remove calculus once plaque has hardened, and it cannot reach into a periodontal pocket. Those need professional cleaning. The realistic division of labour is that you control the daily biofilm and we handle what has become inaccessible to you.',
    },
  ],
  faq: [
    {
      q: 'Electric or manual toothbrush?',
      a: 'Powered brushes show a modest, real advantage in plaque and gingivitis reduction, and their pressure sensors and timers help people who brush too hard or too briefly. A manual brush used well outperforms a powered brush used badly.',
    },
    {
      q: 'Should I rinse after brushing?',
      a: 'No. Spit out the excess and leave the fluoride film in place. Rinsing with water, or with mouthwash, washes away the concentrated fluoride that would otherwise continue protecting the teeth for some time afterwards.',
    },
    {
      q: 'How often should I change my toothbrush?',
      a: 'Roughly every three months, or sooner once the bristles splay. Splaying much earlier than that is a sign you are pressing too hard rather than a sign of a bad brush.',
    },
    {
      q: 'Does mouthwash replace brushing or flossing?',
      a: 'No. Plaque is a structured biofilm and rinsing does not disrupt it mechanically. A fluoride mouthwash can be a useful addition at a separate time of day, but nothing you swill replaces the physical removal of plaque.',
    },
    {
      q: 'Is fluoride safe?',
      a: 'At the concentrations used in toothpaste, and used as intended rather than swallowed, the evidence base supporting fluoride for caries prevention is among the strongest in dentistry. The relevant caution is with young children, where swallowing toothpaste over time can cause fluorosis in developing teeth, which is why supervision and a small smear rather than a full brush are advised at that age.',
    },
  ],
  sources: [
    {
      label: 'Walsh T et al. Fluoride toothpastes of different concentrations for preventing dental caries, Cochrane Database of Systematic Reviews',
      url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007868.pub3/full',
    },
    {
      label: 'World Health Organization, Oral health fact sheet',
      url: 'https://www.who.int/news-room/fact-sheets/detail/oral-health',
    },
  ],
}
