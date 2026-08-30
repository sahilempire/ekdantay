import type { Post } from '../types'

export const bleedingGumsAndGumDisease: Post = {
  slug: 'bleeding-gums-and-gum-disease',
  title: 'Bleeding gums are not normal: what gum disease actually does',
  seoTitle: 'Bleeding Gums and Gum Disease: Causes, Stages and Treatment',
  description:
    'Gums that bleed when you brush are inflamed, and inflammation is the first stage of a disease that is the leading cause of tooth loss in adults. The early stage reverses completely. The later stage does not.',
  date: '2026-03-18',
  updated: '2026-08-30',
  author: 'Dr. Divya Bharti',
  category: 'Prevention',
  image: '/images/image_4.webp',
  imageAlt: 'A dental hygiene appointment in progress',
  excerpt:
    'Healthy gums do not bleed when brushed, any more than healthy skin bleeds when washed. The reason it gets ignored is that the disease it signals is almost entirely painless until it is advanced.',
  service: 'teeth-cleaning',
  related: ['brushing-what-the-evidence-supports', 'replacing-a-missing-tooth'],
  body: [
    {
      kind: 'p',
      text: 'Most people who see blood in the sink assume they brushed too hard, and brush that spot more gently or skip it altogether. It is a completely reasonable inference and it is exactly backwards. Bleeding is what inflamed tissue does when it is disturbed, and the inflammation is caused by the plaque you are not removing. Cleaning it less makes it worse.',
    },
    {
      kind: 'figure',
      value: 'Over 1 billion',
      label: 'Estimated cases of severe gum disease worldwide, making it one of the most widespread chronic conditions in existence',
      source: 'World Health Organization',
    },
    { kind: 'h2', text: 'Stage one: gingivitis, and it is fully reversible' },
    {
      kind: 'p',
      text: 'Plaque accumulating at the point where the tooth meets the gum triggers an immune response in the tissue next to it. Blood vessels dilate, the gum becomes red, puffy and slightly swollen, and it bleeds readily on contact. That is gingivitis.',
    },
    {
      kind: 'p',
      text: 'The important fact about gingivitis is that nothing has been lost. The fibres attaching the gum to the tooth are intact, the bone is untouched, and if the plaque is removed consistently for a couple of weeks the tissue returns to normal completely. There is no scar and no permanent change.',
    },
    {
      kind: 'p',
      text: 'It is also worth saying plainly: bleeding usually gets worse for the first few days of cleaning properly, and then stops. People who push through that window are often surprised how quickly it resolves.',
    },
    { kind: 'h2', text: 'Stage two: periodontitis, and this part does not reverse' },
    {
      kind: 'p',
      text: 'In some people, and not all, the inflammation extends beyond the gum into the structures holding the tooth in place. The fibres anchoring the tooth to the bone break down, and the bone itself begins to resorb. This is periodontitis, and the distinction from gingivitis is not a matter of degree. It is a different disease state.',
    },
    {
      kind: 'p',
      text: 'As the attachment is lost, the gum detaches from the tooth and a pocket forms. The pocket is the mechanism that makes the disease self-sustaining: it is a deep, sheltered space that a toothbrush physically cannot reach, so plaque and hardened calculus accumulate inside it, driving more inflammation, deepening the pocket further.',
    },
    {
      kind: 'note',
      title: 'What cannot be undone',
      text: 'Bone that has been lost does not grow back with brushing, cleaning or any mouthwash. The disease can be stopped, and stopping it early is the whole game. But a tooth that has lost half its bone support keeps that reduced support for life, even if the inflammation is fully controlled.',
    },
    { kind: 'h2', text: 'Why it goes unnoticed for years' },
    {
      kind: 'p',
      text: 'Periodontitis does not hurt. There is no ache, no sensitivity to cold, nothing that would send someone to a dentist. The signs are quiet: bleeding, bad breath that comes back quickly after brushing, gums that look like they are shrinking, teeth that appear to be getting longer, gaps opening between front teeth that were never there before.',
    },
    {
      kind: 'p',
      text: 'By the time a tooth is visibly loose, a majority of its bone support is usually gone. That is why the condition is the leading cause of tooth loss in adults, and why it is worth taking seriously at the bleeding stage rather than the loose stage.',
    },
    {
      kind: 'figure',
      value: '~23%',
      label: 'Proportion of people aged 60 and over with complete tooth loss worldwide. Among adults over 20 overall it is around 7 percent',
      source: 'World Health Organization',
    },
    { kind: 'h2', text: 'What raises your risk' },
    {
      kind: 'ul',
      items: [
        'Smoking and tobacco in any form. This is the single largest modifiable risk factor, and it also masks the disease by constricting blood vessels so the gums bleed less while getting worse.',
        'Poorly controlled diabetes. The relationship runs both ways: high blood glucose worsens gum disease, and gum inflammation makes glucose harder to control.',
        'Genetics and family history. Two people with identical plaque levels can have very different outcomes, and this is a large part of why.',
        'Stress, certain medications, hormonal changes in pregnancy, and anything that reduces saliva flow.',
        'Crowded or crooked teeth, simply because they are harder to clean around.',
      ],
    },
    { kind: 'h2', text: 'What treatment involves' },
    {
      kind: 'p',
      text: 'The first step is measurement, not cleaning. A periodontal probe is walked around each tooth to record pocket depths, and X-rays show the bone level. Without those numbers there is no way to know whether this is gingivitis or established periodontitis, and no baseline to judge whether treatment worked.',
    },
    {
      kind: 'p',
      text: 'Treatment itself is the mechanical removal of plaque and calculus from above and below the gum line, working under local anaesthetic where the pockets are deep. Scaling and root planing is not a polish; it is debridement of surfaces you cannot reach. Some cases need surgical access or referral, but most respond to thorough non-surgical treatment plus a genuine change in daily cleaning.',
    },
    {
      kind: 'p',
      text: 'After that comes maintenance, and this is the part that decides the outcome. Periodontitis is a chronic condition, like hypertension. It is controlled rather than cured, and control depends on regular professional cleaning at an interval matched to your risk, plus interdental cleaning every day at home. Treatment without maintenance reliably relapses.',
    },
  ],
  faq: [
    {
      q: 'Does scaling loosen your teeth?',
      a: 'No. What can happen is that heavy calculus was acting as a splint between teeth that had already lost bone support, and removing it reveals mobility that was there all along. It also lets inflamed, swollen gum shrink back to its true level, which can make teeth look longer and open gaps. The cleaning did not cause the bone loss; it exposed it.',
    },
    {
      q: 'My gums bleed. Should I brush that area less?',
      a: 'The opposite. Bleeding is caused by inflammation from plaque, so cleaning the area properly is what resolves it. Bleeding often increases for the first few days and then settles within a week or two.',
    },
    {
      q: 'Can gum disease be cured?',
      a: 'Gingivitis can be fully reversed. Periodontitis can be arrested and kept stable indefinitely, but the bone and attachment already lost do not come back. This is why the early stage matters so much.',
    },
    {
      q: 'Does mouthwash treat gum disease?',
      a: 'No. Antiseptic mouthwashes can reduce plaque bacteria as a short-term adjunct, but they do not penetrate the biofilm properly and they do not remove calculus. Nothing you rinse with reaches into a periodontal pocket. Mechanical cleaning is the treatment.',
    },
    {
      q: 'Is gum disease linked to general health?',
      a: 'There are well-documented associations with diabetes, cardiovascular disease and adverse pregnancy outcomes. The relationship with diabetes in particular runs in both directions and is strong enough that treating gum disease can improve glycaemic control.',
    },
  ],
  sources: [
    {
      label: 'World Health Organization, Oral health fact sheet',
      url: 'https://www.who.int/news-room/fact-sheets/detail/oral-health',
    },
  ],
}
