import type { Post } from '../types'

export const toothSensitivityExplained: Post = {
  slug: 'tooth-sensitivity-explained',
  title: 'Why cold water hurts: tooth sensitivity, explained',
  seoTitle: 'Tooth Sensitivity Explained: Why Cold Water Hurts',
  description:
    'Sensitive teeth are caused by fluid moving inside microscopic tubes in your dentin. Understanding that explains why some treatments work, why hard brushing makes it worse, and how to tell sensitivity apart from a dying nerve.',
  date: '2026-02-26',
  updated: '2026-08-30',
  author: 'Dr. Divya Bharti',
  category: 'Prevention',
  image: '/images/image_3.webp',
  imageAlt: 'A glass of cold water, a common trigger for dentine sensitivity',
  excerpt:
    'A sharp jolt from cold water and a deep ache that wakes you at night are two different problems with two different answers. Telling them apart is the most useful thing in this article.',
  related: ['how-a-cavity-forms', 'brushing-what-the-evidence-supports'],
  body: [
    {
      kind: 'p',
      text: 'Sensitivity is strange in a way people rarely stop to notice. The pain is instant, sharp, and gone almost as soon as the trigger is removed. It responds to cold, to sweetness, to a blast of air from a dental instrument, sometimes to touch. Ordinary tissue damage does not behave like that. Something more specific is happening.',
    },
    { kind: 'h2', text: 'Dentin is not solid' },
    {
      kind: 'p',
      text: 'Under enamel sits dentin, and dentin is perforated. Running through it, from the pulp outward to the enamel, are somewhere in the order of tens of thousands of microscopic channels per square millimetre. These are dentinal tubules, and they are not empty. Each one is filled with fluid, and each one has a fine extension of a pulp cell reaching into it.',
    },
    {
      kind: 'p',
      text: 'The accepted explanation for sensitivity, the hydrodynamic theory, is that nothing touches the nerve directly. Instead a stimulus makes the fluid inside those tubules move. Cold contracts it and pulls it outward; a sugary solution draws it out osmotically; air dries it. That rapid fluid shift mechanically deforms the nerve endings at the inner end of the tubule, and fast-conducting A-delta fibres fire. Those fibres produce exactly one sensation: a sharp, well-localised, brief stab.',
    },
    {
      kind: 'note',
      title: 'Why this explains the treatment',
      text: 'If the pain comes from fluid moving in an open tube, there are only two ways to stop it: block the tube, or quiet the nerve at the other end. Every sensitivity product on the shelf does one or the other. Nothing is repairing your enamel.',
    },
    { kind: 'h2', text: 'Two things have to go wrong at once' },
    {
      kind: 'p',
      text: 'Dentin under intact enamel is not sensitive, and dentin whose tubules are plugged is not sensitive either. Sensitivity requires both a lesion, meaning dentin that has become exposed, and open tubules connecting that surface to the pulp.',
    },
    { kind: 'h3', text: 'How dentin becomes exposed' },
    {
      kind: 'ul',
      items: [
        'Gum recession. This is the big one, and the reason so much sensitivity is at the gum line. The root surface was never covered by enamel; it has only a thin layer of cementum, which wears away readily once exposed.',
        'Abrasion from brushing too hard, especially with a scrubbing action and a hard brush. It carves a notch exactly where the tooth meets the gum.',
        'Erosion from acid. Citrus, fizzy drinks, reflux and vomiting all dissolve enamel chemically. Erosion also opens tubules that were previously plugged, which is why it causes sensitivity so reliably.',
        'Attrition from grinding or clenching, which wears through the biting surfaces.',
        'Recent treatment. A new filling or a scaling can leave teeth temporarily sensitive for days to a few weeks. This usually settles.',
      ],
    },
    { kind: 'h2', text: 'When it is not sensitivity' },
    {
      kind: 'p',
      text: 'This is the part worth reading twice, because the two conditions feel superficially similar and have completely different urgency.',
    },
    {
      kind: 'ul',
      items: [
        'Dentine sensitivity: sharp, immediate, stops within a second or two of removing the trigger. Provoked, never spontaneous. Often several teeth, often at the gum line.',
        'Pulpitis, an inflamed or dying nerve: the pain lingers after the trigger is gone, sometimes for minutes. It can be dull and throbbing rather than sharp. It can start on its own with no trigger at all. It is often worse lying down, and it wakes people at night. It is usually one identifiable tooth, though it can be hard to localise.',
      ],
    },
    {
      kind: 'p',
      text: 'Lingering pain, spontaneous pain and night pain are the three signals that this is no longer a sensitivity problem. Heat becoming a trigger when cold used to be is another. Those teeth need looking at, because the treatment is different and the window in which the nerve can be saved is not indefinite.',
    },
    { kind: 'h2', text: 'What actually helps' },
    {
      kind: 'h3', text: 'Blocking the tubules',
    },
    {
      kind: 'p',
      text: 'Toothpastes built around stannous fluoride, arginine with calcium carbonate, or calcium phosphate compounds work by depositing material that physically occludes the tubule openings. In the clinic, fluoride varnish, bonding agents and resin sealers do the same thing more durably. For a deep notch at the gum line, a small bonded filling both seals the surface and restores the shape.',
    },
    { kind: 'h3', text: 'Quieting the nerve' },
    {
      kind: 'p',
      text: 'Potassium nitrate, the other common active ingredient, works differently. Potassium ions diffuse along the tubule and raise the concentration around the nerve ending, which reduces its ability to fire. This takes time to build up, which is why the instructions say to use it consistently for a few weeks and why people who try it for three days conclude it does not work.',
    },
    { kind: 'h3', text: 'Removing the cause' },
    {
      kind: 'p',
      text: 'None of the above matters much if the thing causing the exposure continues. Switch to a soft brush and stop scrubbing. Angle the bristles at the gum margin and use small movements rather than pressure. Keep acidic drinks to mealtimes and do not brush for about half an hour after them, because enamel is transiently softened and brushing at that moment removes the softened layer. If you grind, a night guard protects what is left.',
    },
    {
      kind: 'p',
      text: 'And it is worth having the teeth checked rather than self-treating indefinitely. A cracked cusp, a leaking filling and a cavity can all present as cold sensitivity, and no toothpaste will address any of them.',
    },
  ],
  faq: [
    {
      q: 'Does sensitivity mean I have a cavity?',
      a: 'Not necessarily, and most sensitivity is not decay. But a cavity, a cracked tooth and a failing filling can all produce the same sensation, so persistent sensitivity in one specific tooth is worth examining rather than assuming.',
    },
    {
      q: 'How long do sensitivity toothpastes take to work?',
      a: 'Products based on potassium nitrate typically need two to four weeks of consistent twice-daily use before the effect is noticeable, because they work by gradually building up the concentration around the nerve. Tubule-blocking pastes can act faster. Either way, using them occasionally when it hurts does not work.',
    },
    {
      q: 'Should I stop brushing the sensitive area?',
      a: 'No. Avoiding it lets plaque accumulate, which causes more recession and more decay on an already vulnerable root surface. Brush it gently with a soft brush rather than not at all.',
    },
    {
      q: 'Will my gums grow back?',
      a: 'Gum tissue that has receded does not regrow on its own. Recession can be halted, and in selected cases covered surgically with a graft, but the realistic goal for most people is to stop it progressing and to treat the exposed surface.',
    },
    {
      q: 'Can whitening cause sensitivity?',
      a: 'Yes, commonly, and it is usually temporary. The peroxide passes through the tubules and irritates the pulp. It typically resolves within a few days of stopping, and using a desensitising paste beforehand reduces it.',
    },
  ],
  sources: [
    {
      label: 'World Health Organization, Oral health fact sheet',
      url: 'https://www.who.int/news-room/fact-sheets/detail/oral-health',
    },
  ],
}
