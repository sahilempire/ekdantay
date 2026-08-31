import type { Post } from '../types'

export const howACavityForms: Post = {
  slug: 'how-a-cavity-forms',
  title: 'How a cavity actually forms: the twenty minutes after you eat',
  seoTitle: 'How a Cavity Forms: Tooth Decay Explained Step by Step',
  description:
    'Tooth decay is not caused by sugar sitting on your teeth. It is caused by an acid attack that starts within minutes of eating and takes about half an hour to recover from. Here is what actually happens.',
  date: '2026-01-14',
  updated: '2026-08-30',
  author: 'Dr. Divya Bharti',
  category: 'Prevention',
  image: '/images/about-2.webp',
  imageAlt: 'A dentist at the clinic',
  excerpt:
    'Decay is not sugar dissolving your teeth. It is a pH cycle that swings the wrong way a few times too often. Once you can picture that cycle, most dental advice stops sounding arbitrary.',
  related: ['brushing-what-the-evidence-supports', 'tooth-sensitivity-explained'],
  body: [
    {
      kind: 'p',
      text: 'Almost everyone has been told that sugar causes cavities. It is true enough to be useful and vague enough to be useless, because it does not explain why one person eating a dessert every night has no decay and another person who "barely eats sweets" has four cavities. The difference is not how much sugar. It is how often, and what happens in the half hour afterwards.',
    },
    {
      kind: 'figure',
      value: 'Most common',
      label: 'Untreated tooth decay in adult teeth is the single most common health condition on earth, ahead of every other disease measured',
      source: 'World Health Organization',
    },
    { kind: 'h2', text: 'Your teeth are dissolving and rebuilding all day' },
    {
      kind: 'p',
      text: 'Enamel is a crystal, not a shell. It is roughly 96 percent mineral, mostly a calcium phosphate called hydroxyapatite, and like any crystal it has a solubility. Below a certain acidity it dissolves. Above it, minerals in your saliva move back in and the crystal repairs itself. That threshold, the critical pH, sits around 5.5 for enamel.',
    },
    {
      kind: 'p',
      text: 'This is not damage in the way a scratch is damage. Your teeth cross that line and come back several times a day, every day, and nothing is lost overall. A cavity is what happens when the accounting stops balancing.',
    },
    { kind: 'h2', text: 'What happens in the twenty minutes after you eat' },
    {
      kind: 'p',
      text: 'The film on your teeth is not food residue. It is dental plaque: a dense, organised community of bacteria bound in a sticky matrix they build themselves. Some of those species, notably the mutans streptococci and the lactobacilli, live on fermentable carbohydrate and excrete acid as waste.',
    },
    {
      kind: 'ol',
      items: [
        'You eat or drink something with sugar or refined starch. Bread and biscuits count; the bacteria do not care whether it tastes sweet.',
        'Within two to five minutes the plaque pH plunges. It can drop below 5.5 faster than you finish the food.',
        'Below that threshold, mineral leaves the enamel surface. This is demineralisation.',
        'Saliva goes to work. It washes sugar away, buffers the acid, and carries dissolved calcium and phosphate.',
        'Over roughly twenty to forty minutes the pH climbs back and mineral moves in again. This is remineralisation.',
      ],
    },
    {
      kind: 'p',
      text: 'Plotted on a graph, that dip and slow recovery is a shape dentists know as the Stephan curve, first described in 1944 and still the clearest picture of decay anyone has drawn. Everything that follows is a consequence of its shape.',
    },
    { kind: 'h2', text: 'Why frequency beats quantity' },
    {
      kind: 'p',
      text: 'The dip is roughly the same depth whether you had one sweet or five. What matters is how many dips there are, because the tooth spends the recovery period rebuilding and cannot start until the acid clears.',
    },
    {
      kind: 'note',
      title: 'The single most useful thing on this page',
      text: 'A whole dessert eaten in ten minutes is one acid attack. Six cups of sweet tea sipped across a working day is six, and the tooth never gets a full recovery window between them. The slow sipper does far more damage while consuming less sugar.',
    },
    {
      kind: 'p',
      text: 'This is why we ask what you drink between meals rather than what you eat at them, and why the honest answer to "how much sugar is safe" is that the timing matters more than the amount. If sweet things are going to happen, having them with a meal rather than between meals genuinely reduces the harm.',
    },
    { kind: 'h2', text: 'Where fluoride actually fits' },
    {
      kind: 'p',
      text: 'Fluoride is not an antiseptic and it does not scrub anything. It changes the chemistry of the repair. When mineral rebuilds in the presence of fluoride, some of it forms fluorapatite instead of hydroxyapatite, and fluorapatite does not begin dissolving until around pH 4.5 rather than 5.5.',
    },
    {
      kind: 'p',
      text: 'The practical effect is that the rebuilt surface tolerates a deeper dip than the original did, and shallow acid attacks that would once have cost you mineral now cost nothing. Fluoride also slows the acid production of the bacteria themselves. It shifts the balance of a cycle that is running anyway.',
    },
    { kind: 'h2', text: 'The point of no return' },
    {
      kind: 'p',
      text: 'Early decay is reversible, and this surprises people. A white, chalky patch on enamel is a lesion where mineral has been lost but the surface layer is still intact. Given fluoride, less frequent sugar and good cleaning, that patch can genuinely re-harden. No drill is involved.',
    },
    {
      kind: 'p',
      text: 'What cannot come back is a hole. Once the surface collapses into a cavity, the plaque moves inside where no brush reaches, and the process becomes one way. Worse, under enamel is dentin, which is softer, more porous and threaded with microscopic tubules running toward the nerve. Decay spreads through dentin considerably faster than it moved through enamel, which is why a cavity that looked small on the surface is so often larger underneath.',
    },
    {
      kind: 'p',
      text: 'That gap between what a lesion looks like and what it is doing is the entire argument for check-ups. We are not looking for holes. We are looking for the stage before the hole, when the answer is still fluoride and a conversation rather than a filling.',
    },
    { kind: 'h2', text: 'What this means for what you do' },
    {
      kind: 'ul',
      items: [
        'Count the number of times a day you eat or drink anything other than water, not the total sugar. Reducing that count is the highest-value change most people can make.',
        'Use a fluoride toothpaste and do not rinse it away with water afterwards. The residue is the point.',
        'Water between meals is free and does nothing to the pH.',
        'A white patch on a tooth is worth showing us early. That is the stage we can still reverse.',
        'Acidic drinks such as citrus juice and cola cause a separate problem, erosion, by dropping the pH directly without any bacteria involved.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can a cavity heal on its own?',
      a: 'An early lesion can. If mineral has been lost but the enamel surface has not collapsed, fluoride and a change in how often you eat sugar can genuinely re-harden it. Once there is an actual hole, the surface cannot rebuild across the gap and it needs a filling.',
    },
    {
      q: 'I brush twice a day. Why do I still get cavities?',
      a: 'Brushing controls plaque on the broad surfaces, but decay most often starts between the teeth where a brush does not reach, and in the grooves of back teeth. Frequency of sugar, interdental cleaning, saliva flow and whether you rinse your toothpaste away all matter alongside brushing.',
    },
    {
      q: 'Are sugar-free drinks safe for teeth?',
      a: 'Safer from decay, but not neutral. Most fizzy drinks and citrus juices are acidic enough to dissolve enamel directly, with no bacteria involved. That is erosion rather than decay, and it damages the same mineral.',
    },
    {
      q: 'Does a cavity always hurt?',
      a: 'No, and this is why decay is so often found at a check-up rather than reported by the patient. Pain usually arrives when the process reaches the nerve, by which point the treatment needed is considerably larger than a filling.',
    },
  ],
  sources: [
    {
      label: 'World Health Organization, Oral health fact sheet',
      url: 'https://www.who.int/news-room/fact-sheets/detail/oral-health',
    },
    {
      label: 'Walsh T et al., Fluoride toothpastes of different concentrations for preventing dental caries, Cochrane Database of Systematic Reviews',
      url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007868.pub3/full',
    },
  ],
}
