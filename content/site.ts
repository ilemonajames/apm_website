export const navigation = [
  { label: "About", href: "/about" }, { label: "Policies", href: "/policies" },
  { label: "Leadership", href: "/leadership" }, { label: "News", href: "/news" },
  { label: "Resources", href: "/resources" }, { label: "Get Involved", href: "/get-involved" },
] as const;

export const priorities = [
  { number: "01", title: "Security", description: "Protecting lives, property and communities through capable, accountable institutions." },
  { number: "02", title: "Rule of law", description: "Equal justice, transparent government and institutions that work without fear or favour." },
  { number: "03", title: "True federalism", description: "Empowering states and local communities to solve problems closer to the people." },
  { number: "04", title: "Economic opportunity", description: "Backing enterprise, decent work and sustainable growth that reaches every household." },
  { number: "05", title: "Food security", description: "Modernising agriculture and strengthening the people who feed our nation." },
  { number: "06", title: "National unity", description: "Building common purpose from Nigeria's cultural, linguistic and religious diversity." },
] as const;

export const leaders = [
  { name: "Yusuf Mamman Dantalle", role: "National Chairman", initials: "YD", image: "/images/apm/yusuf-dantalle.jpg" },
  { name: "Oyadeyi Ayodele Adebayo", role: "National Secretary", initials: "OA", image: "/images/apm/oyadeyi-adebayo.jpg" },
  { name: "Zavvalo Badon", role: "National Treasurer", initials: "ZB" },
  { name: "Labarin Yunusa", role: "National Financial Secretary", initials: "LY" },
] as const;

export const resources = [
  { title: "APM Constitution", type: "PDF", description: "The approved structure, principles, membership and governance of the party.", href: "https://apm.org.ng/wp-content/uploads/2022/08/CONSTITUTION.pdf" },
  { title: "APM Manifesto", type: "PDF", description: "The party's policy direction and programme for national development.", href: "https://apm.org.ng/wp-content/uploads/2026/05/APM-MANIFESTO.pdf" },
] as const;

export const publicPages = {
  about: { eyebrow: "About APM", title: "A movement built around service.", intro: "The Allied Peoples' Movement is committed to accountable leadership, equal opportunity and a secure, prosperous Nigeria.", sections: [
    { title: "Our mission", body: "To strengthen democratic institutions, protect every citizen's dignity and make public office answerable to the people." },
    { title: "Our vision", body: "A united, peaceful and prosperous Nigeria driven by responsible leadership, fairness and sustainable development." },
    { title: "Our values", body: "Integrity, sacrifice and service guide the party's organisation, public conduct and relationship with every community." },
  ]},
  policies: { eyebrow: "Policy direction", title: "A practical agenda for national renewal.", intro: "These summaries provide a clear entry point to APM's policy priorities. Final wording remains subject to approval against the authoritative manifesto.", sections: priorities.map((item) => ({ title: item.title, body: item.description })) },
  leadership: { eyebrow: "National leadership", title: "Service with responsibility.", intro: "The National Working Committee coordinates the party's organisation and programmes. Profiles and tenure details will be expanded after formal verification.", sections: leaders.map((leader) => ({ title: leader.name, body: leader.role })) },
  resources: { eyebrow: "Resource centre", title: "Official party documents.", intro: "Approved party materials will be organised here with publication dates, versions, file types and accessible web summaries.", sections: resources.map((resource) => ({ title: resource.title, body: resource.description, href: resource.href })) },
  news: { eyebrow: "Newsroom", title: "Official updates from APM.", intro: "This section is prepared for verified press releases, announcements and event coverage. No sample stories are presented as party activity.", sections: [{ title: "Awaiting approved newsroom content", body: "Authorised editors will publish dated and categorised updates after the editorial workflow is connected." }] },
  contact: { eyebrow: "Contact APM", title: "Reach the national secretariat.", intro: "Official enquiries can be directed to the national secretariat while subject-based support routing is prepared.", sections: [
    { title: "National Secretariat", body: "Plot 232, No. 2 Leventis Building, Samuel Adesujo Ademulegun Street, Central Business District, Abuja FCT." },
    { title: "Telephone", body: "0803 304 3791 / 0805 510 8331" },
  ]},
} as const;

export type PublicPageSlug = keyof typeof publicPages;
