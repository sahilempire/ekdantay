import type { Post } from '../types'

export const rootCanalWhatHappens: Post = {
  slug: 'root-canal-what-happens',
  title: 'Root canal treatment: what actually happens, and how long it lasts',
  seoTitle: 'Root Canal Treatment: What Happens and How Long It Lasts',
  description:
    'A root canal removes an infected nerve, not the tooth. Here is what the appointment involves step by step, and what the research really says about survival rates, which is not the number most clinics quote.',
  date: '2026-02-04',
  updated: '2026-08-30',
  author: 'Dr. Divya Bharti',
  category: 'Treatment',
  image: '/images/gallery-3.webp',
  imageAlt: 'A dentist working in mask and gloves during a procedure',
  excerpt:
    'The pain people associate with a root canal is the pain of the infection that made it necessary. The treatment is what stops it. Here is what happens in the chair, and an honest look at the numbers.',
  service: 'pain-free-treatment',
  related: ['how-a-cavity-forms', 'replacing-a-missing-tooth'],
  body: [
    {
      kind: 'p',
      text: 'No dental procedure has a worse reputation, and almost none of it is deserved. The reputation was earned decades ago, before modern local anaesthesia and rotary instruments, and it has outlived the reality by about thirty years. What has not changed is the reason people need one, so it is worth understanding what is actually going on inside the tooth.',
    },
    { kind: 'h2', text: 'What is inside a tooth' },
    {
      kind: 'p',
      text: 'Under the enamel and the dentin, every tooth has a hollow core: a chamber in the crown that narrows into one or more canals running down each root. That space holds the pulp, which is nerve tissue and blood vessels. It is what makes a tooth a living organ rather than a piece of bone stuck in your jaw.',
    },
    {
      kind: 'p',
      text: 'The pulp is sealed inside a rigid box. That detail explains everything that follows. When any other tissue in your body becomes inflamed it swells; the pulp cannot. Pressure rises inside a chamber that will not expand, the blood supply is choked off by that same pressure, and the tissue dies. This is why toothache is the particular kind of pain it is, and why it does not settle down on its own.',
    },
    { kind: 'h2', text: 'How the pulp gets infected' },
    {
      kind: 'ul',
      items: [
        'Deep decay reaching through enamel and dentin into the chamber. By far the most common route.',
        'A crack or fracture giving bacteria a path in, sometimes years after the injury.',
        'Trauma that severs the blood supply at the root tip. The tooth can die quietly and darken months later.',
        'Repeated large restorations that have taken the pulp close to its limit.',
      ],
    },
    {
      kind: 'p',
      text: 'Once the pulp is dead, the canal becomes a space bacteria occupy and your immune system cannot reach, because there is no longer a blood supply to carry it there. The infection tracks out of the root tip into the bone, and that is a periapical abscess: the swelling, the throbbing, the tooth that feels tall when you bite.',
    },
    { kind: 'h2', text: 'What the appointment involves' },
    {
      kind: 'ol',
      items: [
        'Local anaesthesia. The tooth and surrounding tissue are fully numb before anything begins. If you can feel sharpness, that is information we need, not something to endure.',
        'A rubber dam is placed. A sheet of latex isolates the tooth so no saliva, and nothing bacterial in it, enters the canal during the work. This is not optional; it is a large part of why treatment succeeds.',
        'An access cavity is opened through the biting surface into the pulp chamber.',
        'The canals are cleaned and shaped with fine instruments, and irrigated. The irrigant, usually sodium hypochlorite, dissolves the tissue and kills bacteria in areas no instrument physically touches. The chemistry does more of the work than the files do.',
        'The canals are dried and filled, typically with gutta-percha and a sealer, so the space is no longer available to be recolonised.',
        'The tooth is sealed, and then restored properly, which for a back tooth almost always means a crown.',
      ],
    },
    {
      kind: 'p',
      text: 'It takes one or two visits depending on how infected the tooth is and how complex the root anatomy turns out to be. Molars have more canals than front teeth, and those canals curve, branch and occasionally hide, which is why they take longer and cost more.',
    },
    { kind: 'h2', text: 'The number nobody explains: success is not the same as survival' },
    {
      kind: 'p',
      text: 'Search for root canal success rates and you will find figures from 68 percent to 98 percent, which is not a helpful range. The spread is not because the studies disagree. It is because they are measuring two different things.',
    },
    {
      kind: 'figure',
      value: '87%',
      label: 'Pooled probability that a root-treated tooth is still in the mouth and functioning at eight to ten years, falling from about 93 percent at four to five years',
      source: 'Ng, Mann and Gulabivala, systematic review, International Endodontic Journal',
    },
    {
      kind: 'ul',
      items: [
        'Success means the disease resolved: no symptoms, and the bone at the root tip has healed on an X-ray. Judged strictly, pooled success across the literature sits somewhere in the region of 68 to 85 percent.',
        'Survival means the tooth is still there and working, whether or not it needed anything further along the way. That is around 93 percent at four to five years and about 87 percent at eight to ten.',
      ],
    },
    {
      kind: 'p',
      text: 'Both are real numbers. Survival is the one that answers the question patients are actually asking, which is whether they get to keep the tooth. When a clinic advertises a figure in the high nineties, it is quoting survival, usually from a short follow-up period. We would rather tell you both.',
    },
    {
      kind: 'p',
      text: 'The same research is clear that molars do worse than premolars and front teeth. More canals, more curvature and a much heavier bite load all work against them.',
    },
    { kind: 'h2', text: 'Why the crown afterwards is not an upsell' },
    {
      kind: 'note',
      title: 'The most common way a root-treated tooth is lost',
      text: 'Not reinfection. Fracture. A back tooth that has been hollowed out to access the canals has lost the internal structure that held it together under load, and a temporary filling left in place for a year will eventually let it split, often below the gum where nothing can be done. The crown is what makes the endodontics worth paying for.',
    },
    {
      kind: 'p',
      text: 'A root-treated tooth is also more brittle in a subtler way. It no longer has a nerve, so it cannot warn you when you are biting on something you should not be. The crown covers the cusps and holds them together.',
    },
    { kind: 'h2', text: 'Is extraction the cheaper answer' },
    {
      kind: 'p',
      text: 'On the day, always. Over ten years, rarely. An extraction leaves a gap that changes the bite, lets the neighbouring teeth tip and the opposing tooth drift down, and starts the bone that held the root resorbing. Replacing the tooth properly with an implant costs several times what saving it would have. Keeping your own root, when it can be kept, is almost always the better value as well as the better outcome.',
    },
    {
      kind: 'p',
      text: 'There are teeth that genuinely cannot be saved, and we will say so plainly when that is the case. But the decision should be made on the state of the tooth, not on the fear of the procedure.',
    },
  ],
  faq: [
    {
      q: 'Is a root canal painful?',
      a: 'The treatment itself should not be. You are fully anaesthetised, and for most people the appointment feels like having a long filling done. The pain associated with root canals is the pain of the infected pulp that made treatment necessary, and it is what the procedure removes. Some tenderness on biting for a few days afterwards is normal.',
    },
    {
      q: 'How many appointments does it take?',
      a: 'One or two in most cases. A tooth with significant infection may be dressed with medication and left for a period before being filled, which gives a better result than rushing it.',
    },
    {
      q: 'Do I really need a crown afterwards?',
      a: 'For a back tooth, almost always. Fracture, not reinfection, is the most common reason a successfully root-treated tooth is eventually lost, and a crown that covers the cusps is what prevents it. Front teeth with limited damage can sometimes be restored without one.',
    },
    {
      q: 'Can a root canal fail years later?',
      a: 'It can. A canal that was not fully cleaned, a missed canal, a new cavity under the crown or a fracture can all cause a tooth to become symptomatic again. Retreatment is often possible, and so is surgery at the root tip, so a failing root canal does not automatically mean losing the tooth.',
    },
    {
      q: 'Does a root canal make the tooth go dark?',
      a: 'It can, particularly on front teeth, and particularly if blood products from the trauma got into the dentin before treatment. Internal bleaching or a veneer can address the colour once the tooth is stable.',
    },
  ],
  sources: [
    {
      label: 'Ng YL, Mann V, Gulabivala K. Tooth survival following non-surgical root canal treatment: a systematic review. International Endodontic Journal',
      url: 'https://onlinelibrary.wiley.com/doi/10.1111/j.1365-2591.2009.01671.x',
    },
    {
      label: 'Ng YL et al. Long-term outcome of primary non-surgical root canal treatment',
      url: 'https://pubmed.ncbi.nlm.nih.gov/22205268/',
    },
  ],
}
