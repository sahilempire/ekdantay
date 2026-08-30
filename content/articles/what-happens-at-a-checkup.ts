import type { Post } from '../types'

export const whatHappensAtACheckup: Post = {
  slug: 'what-happens-at-a-checkup',
  title: 'What a dentist is actually looking for at a check-up',
  seoTitle: 'What Happens at a Dental Check-Up: A Full Walkthrough',
  description:
    'A check-up is not a quick look for holes. It is a screening examination covering decay, gum health, the bite, existing restorations and the soft tissues. Here is what each part is for.',
  date: '2026-08-19',
  updated: '2026-08-30',
  author: 'Dr. Divya Bharti',
  category: 'Prevention',
  image: '/images/about-2.webp',
  imageAlt: 'A dental examination taking place in a calm treatment room',
  excerpt:
    'The part of a check-up that could save your life takes about fifteen seconds and involves no teeth at all. Most patients never notice it happening.',
  related: ['bleeding-gums-and-gum-disease', 'how-a-cavity-forms'],
  body: [
    {
      kind: 'p',
      text: 'A dental check-up looks, from the chair, like someone poking about with a mirror and saying numbers to an assistant. It is a screening examination with a specific sequence, and knowing what each part is for makes it considerably less opaque, and makes the recommendations at the end easier to weigh.',
    },
    { kind: 'h2', text: 'The conversation first' },
    {
      kind: 'p',
      text: 'What has changed since last time, whether anything hurts, and any updates to your general health and medications. This is not small talk. Diabetes, blood thinners, bisphosphonates, immunosuppression, pregnancy, heart valve history and smoking all directly change what is safe to do and what we should be looking for. An out-of-date medical history is a genuine safety problem, so it gets asked every time even though it feels repetitive.',
    },
    { kind: 'h2', text: 'The soft tissue examination' },
    {
      kind: 'note',
      title: 'The most important fifteen seconds',
      text: 'Before looking at a single tooth, we check the tongue, including underneath and along the sides, the floor of the mouth, the cheeks, the palate, the throat and the lymph nodes in the neck. This is a screening for oral cancer. It is quick, it is painless, and most patients do not register that it happened. Early-stage oral cancer is highly treatable and largely painless, which is exactly why it needs looking for rather than waiting to be reported. Tobacco in any form, including chewed, and alcohol are the main risk factors.',
    },
    {
      kind: 'p',
      text: 'Any ulcer that has not healed within three weeks, a persistent red or white patch, or a lump that does not resolve is worth showing us without waiting for a scheduled appointment.',
    },
    { kind: 'h2', text: 'The teeth' },
    {
      kind: 'p',
      text: 'Each tooth is checked systematically, surface by surface, with a mirror and light and gentle probing. We are looking for early demineralisation, actual cavitation, cracks, wear patterns and the state of every existing filling and crown, particularly the margins where they meet the tooth, because that is where decay starts underneath a restoration that still looks fine.',
    },
    {
      kind: 'p',
      text: 'Wear patterns tell a story of their own. Flattened biting surfaces suggest grinding; scooped-out enamel suggests acid erosion; notches at the gum line suggest heavy brushing. Those findings change the advice more than the treatment.',
    },
    { kind: 'h2', text: 'The gums, in numbers' },
    {
      kind: 'p',
      text: 'A blunt probe with millimetre markings is walked gently around each tooth, measuring how deep the gum attaches. Those numbers being read out are pocket depths. Up to about three millimetres is healthy; four and above indicates attachment has been lost, and we also record where it bleeds on probing.',
    },
    {
      kind: 'p',
      text: 'This is the part people find least interesting and it is arguably the most important, because gum disease is painless until it is advanced and it is the leading cause of tooth loss in adults. It is also the only part of the examination that produces a baseline you can be compared against next year.',
    },
    { kind: 'h2', text: 'The bite and the joints' },
    {
      kind: 'p',
      text: 'How the teeth meet, whether any tooth is taking more load than it should, and how the jaw joints move and sound. Uneven loading shows up years later as cracked teeth and failed restorations, and it is much cheaper to notice early.',
    },
    { kind: 'h2', text: 'Radiographs, and why not every time' },
    {
      kind: 'p',
      text: 'X-rays are taken when there is a clinical reason, not by default at every visit. The main one is that decay between two touching back teeth is genuinely invisible to the eye, and so is bone level and anything below the root. A bitewing radiograph shows both.',
    },
    {
      kind: 'p',
      text: 'The interval is based on your individual risk, so someone with a history of decay is imaged more often than someone with none. Doses from modern dental radiography are very small, but the principle is still to take them when they will change a decision and not otherwise.',
    },
    { kind: 'h2', text: 'What you get at the end' },
    {
      kind: 'ul',
      items: [
        'What was found, in plain terms, and what it means if nothing is done about it.',
        'What needs treating now, what can be watched, and what is purely optional. These three categories should always be distinguished, and you are entitled to ask which one something falls into.',
        'A recall interval based on your risk rather than a fixed six months. Someone with active decay or unstable gums needs to be seen more often; someone stable may safely go longer.',
        'The specific hygiene changes that apply to what was actually found in your mouth, rather than general advice.',
      ],
    },
    { kind: 'h2', text: 'Why go when nothing hurts' },
    {
      kind: 'p',
      text: 'Because the two most common dental diseases are both painless for most of their course. Decay does not hurt until it approaches the nerve, by which point the treatment is a root canal rather than a filling. Gum disease does not hurt until teeth are loose, by which point the bone is gone and cannot be recovered.',
    },
    {
      kind: 'p',
      text: 'Pain is a late signal in dentistry, not an early one. Waiting for it is what turns small, cheap, quick treatments into large, expensive, unpleasant ones, and that is the entire economic argument for check-ups.',
    },
  ],
  faq: [
    {
      q: 'How often should I have a check-up?',
      a: 'It should depend on your risk rather than a fixed rule. Stable patients with no history of decay or gum disease can often safely go longer than six months, while someone with active disease may need to be seen every three or four months. The interval should be explained rather than assumed.',
    },
    {
      q: 'Why does the dentist call out numbers?',
      a: 'Those are periodontal pocket depths in millimetres, recorded around each tooth. Up to about three is healthy. Four and above means the gum has lost attachment to the tooth. They are recorded so this year can be compared with last year.',
    },
    {
      q: 'Do I need X-rays at every visit?',
      a: 'No. They are taken when there is a reason, most often to see between contacting back teeth where decay is invisible to the eye, or to check bone levels. The frequency should be based on your individual risk.',
    },
    {
      q: 'Is a scale and polish the same as a check-up?',
      a: 'No. The check-up is the examination and diagnosis; the cleaning is a treatment. They are often done at the same appointment, which is why they get conflated, but a cleaning without an examination means nobody has looked for the things that matter.',
    },
    {
      q: 'What if I have not been to a dentist in years?',
      a: 'That is common and it is not something you will be lectured about. The first appointment is a full assessment and a plan, usually staged so that the urgent things happen first and the rest is spread out. Knowing where you stand is almost always less unpleasant than not knowing.',
    },
  ],
  sources: [
    {
      label: 'World Health Organization, Oral health fact sheet',
      url: 'https://www.who.int/news-room/fact-sheets/detail/oral-health',
    },
  ],
}
