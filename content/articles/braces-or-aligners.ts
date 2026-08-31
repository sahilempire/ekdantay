import type { Post } from '../types'

export const bracesOrAligners: Post = {
  slug: 'braces-or-aligners',
  title: 'Braces or clear aligners: how the choice is actually made',
  seoTitle: 'Braces vs Clear Aligners: How Orthodontists Decide',
  description:
    'Teeth move because bone remodels around them, not because they are pushed. Understanding that explains why treatment takes the time it does, why more force is not faster, and why retainers are permanent.',
  date: '2026-05-20',
  updated: '2026-08-30',
  author: 'Dr. Divya Bharti',
  category: 'Orthodontics',
  image: '/images/image_2.webp',
  imageAlt: 'A woman laughing, her teeth visible',
  excerpt:
    'The interesting question is not which appliance looks better. It is how a tooth moves through solid bone at all, and what that biology says about how long it takes and what happens afterwards.',
  service: 'orthodontics',
  related: ['bleeding-gums-and-gum-disease', 'wisdom-teeth-when-to-remove'],
  body: [
    {
      kind: 'p',
      text: 'People choose between braces and aligners mostly on appearance, which is a reasonable thing to care about. But the choice a clinician makes rests on something else entirely, and it starts with a question worth asking: how does a tooth move through bone without breaking anything?',
    },
    { kind: 'h2', text: 'Teeth are not pushed. Bone is rebuilt around them' },
    {
      kind: 'p',
      text: 'Each root sits in its socket suspended by the periodontal ligament, a thin layer of fibres holding it to the bone. Apply a gentle sustained force and the ligament is compressed on one side and stretched on the other.',
    },
    {
      kind: 'p',
      text: 'That mechanical signal starts a biological process. On the compressed side, osteoclasts are recruited and resorb bone, opening space for the root to move into. On the stretched side, osteoblasts lay down new bone behind it. The tooth is not travelling through bone; the bone is being taken away in front and rebuilt behind. The socket migrates with the root.',
    },
    {
      kind: 'note',
      title: 'Why more force is not faster',
      text: 'Excessive force crushes the ligament and cuts off its blood supply. In that dead zone, the normal cell-driven remodelling cannot start, and movement stalls rather than accelerates. It also raises the risk of root resorption, where the root tip itself is shortened permanently. Light, continuous force moves teeth. Heavy force damages them and moves them more slowly.',
    },
    {
      kind: 'p',
      text: 'This is the single best answer to why orthodontics takes a year or two. The rate limit is biological, not mechanical, and no appliance can outrun it.',
    },
    { kind: 'h2', text: 'What fixed braces do well' },
    {
      kind: 'p',
      text: 'A bracket bonded to each tooth with a wire running through gives three-dimensional control of every tooth individually. Critically, it controls the root as well as the crown, which is what allows torque: tipping a tooth is easy, moving it bodily so that the root follows the crown is much harder, and fixed appliances do it better than anything else.',
    },
    {
      kind: 'ul',
      items: [
        'Large rotations, particularly of round teeth like premolars, which aligners struggle to grip.',
        'Closing extraction spaces, where roots must be moved bodily rather than tipped.',
        'Bringing down teeth that are impacted or significantly out of the arch.',
        'Complex bite corrections and cases with a skeletal component.',
        'Any case where compliance is uncertain, because the appliance is not removable.',
      ],
    },
    { kind: 'h2', text: 'What clear aligners do well' },
    {
      kind: 'p',
      text: 'A sequence of clear trays, each slightly different from the last, moves teeth in small increments. They are worn around 20 to 22 hours a day and changed on a schedule. Small composite attachments are usually bonded to some teeth to give the tray something to grip, which is why aligner treatment is not quite as invisible as it is often shown.',
    },
    {
      kind: 'ul',
      items: [
        'Mild to moderate crowding and spacing, which describes a large share of adult cases.',
        'Relapse after previous orthodontic treatment, a very common reason adults return.',
        'Situations where oral hygiene is a concern, since the trays come out for cleaning.',
        'Adults who cannot accept fixed appliances for work or personal reasons, and who will genuinely wear them.',
      ],
    },
    {
      kind: 'p',
      text: 'The weakness is not the technology; it is that removable means removable. An aligner in a case on a desk applies no force at all. Treatment plans assume near-continuous wear, and the gap between planned and actual is the most common reason aligner cases run over time or fail to track.',
    },
    { kind: 'h2', text: 'This is not only cosmetic' },
    {
      kind: 'p',
      text: 'Crowded and overlapping teeth create contact areas a brush cannot clean and floss struggles to pass, and those areas are exactly where decay and gum inflammation start. A deep bite can traumatise the gum behind the upper front teeth. A crossbite loads teeth in directions they are not built for and wears them.',
    },
    {
      kind: 'p',
      text: 'That said, orthodontics done on unhealthy gums makes things worse, not better. Moving teeth in the presence of active periodontal disease accelerates bone loss. Gum disease and decay are always treated first, without exception.',
    },
    { kind: 'h2', text: 'Retention is the part nobody plans for' },
    {
      kind: 'p',
      text: 'When the appliance comes off, the bone has remodelled but the fibres in the gum and ligament have not fully reorganised, and some of them retain elastic memory for years. Left alone, teeth drift back toward where they came from. Separately and independently, teeth in everyone continue to shift slowly throughout adult life, whether or not they were ever treated.',
    },
    {
      kind: 'p',
      text: 'So retainers are not a temporary phase at the end of treatment. They are how the result is kept. That usually means a thin wire bonded behind the front teeth, a removable retainer worn at night, or both. The honest framing is that retention is lifelong, at a reducing frequency. Anyone who tells you otherwise is setting you up to be disappointed in five years.',
    },
  ],
  faq: [
    {
      q: 'How long does orthodontic treatment take?',
      a: 'Most comprehensive cases run 12 to 24 months, with simpler alignment sometimes finishing in six to nine. The limiting factor is how fast bone can safely remodel around the roots, which is why the estimate does not change much between appliance types for the same case.',
    },
    {
      q: 'Are aligners faster than braces?',
      a: 'Not inherently. For a straightforward case they can be comparable or slightly quicker; for complex movements fixed appliances are usually faster because they achieve the movement more efficiently. The biology sets the pace either way.',
    },
    {
      q: 'Do I have to wear a retainer forever?',
      a: 'Effectively yes, though the frequency drops. Nightly at first, then a few nights a week indefinitely for most people. Teeth continue to shift throughout life independently of any treatment you have had.',
    },
    {
      q: 'Can adults have orthodontic treatment?',
      a: 'Yes, and a large proportion of orthodontic patients are adults. Bone remodelling works the same way at any age. Movement can be slightly slower in adults, and existing gum disease or missing teeth need addressing as part of the plan.',
    },
    {
      q: 'Do braces damage the teeth?',
      a: 'The appliance itself does not, but it makes cleaning harder, and decalcified white marks around where brackets were are a genuine risk in patients who do not keep up with hygiene. Some shortening of root tips can occur, usually minor and without consequence. Both risks are managed by light forces and good cleaning.',
    },
  ],
  sources: [
    {
      label: 'World Health Organization, Oral health fact sheet',
      url: 'https://www.who.int/news-room/fact-sheets/detail/oral-health',
    },
  ],
}
