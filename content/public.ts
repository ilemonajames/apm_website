import { leaders, priorities, resources } from "@/content/site";

export const resourceLibrary = [
  ...resources.map((resource, index) => ({ ...resource, id: `party-document-${index + 1}`, category: "Party document", publicationDate: index === 0 ? "2022" : "Pending confirmation", version: index === 0 ? "Amended 2022" : "Current version pending confirmation", fileSize: "Available on source website" })),
  { id: "inec-party-profile", title: "INEC APM Party Profile", type: "WEB", category: "Official reference", description: "The Independent National Electoral Commission's public listing for the Allied Peoples Movement.", href: "https://inecnigeria.org/parties/allied-peoples-movement-apm", publicationDate: "Current listing", version: "Live reference", fileSize: "Web page" },
  { id: "inec-voter-information", title: "INEC Voter Information", type: "WEB", category: "Voter information", description: "Official voter services and election information from the Independent National Electoral Commission.", href: "https://inecnigeria.org/voters/", publicationDate: "Current service", version: "Live reference", fileSize: "Web page" },
] as const;

export const approvedNews: readonly { title: string; date: string; category: string; summary: string; href: string }[] = [];
export const approvedEvents: readonly { title: string; date: string; location: string; summary: string; href: string }[] = [];
export const chapters = [{ state: "Federal Capital Territory", office: "National Secretariat", address: "Plot 232, No. 2 Leventis Building, Samuel Adesujo Ademulegun Street, Central Business District, Abuja FCT.", phone: "0803 304 3791 / 0805 510 8331", status: "Verified public contact" }] as const;

export const searchIndex = [
  { type: "Page", title: "About APM", description: "Mission, vision, values and the purpose of the Allied Peoples' Movement.", href: "/about", keywords: "about mission vision values integrity sacrifice service" },
  { type: "Page", title: "Leadership", description: "Verified national officers and the National Working Committee.", href: "/leadership", keywords: leaders.map((leader) => `${leader.name} ${leader.role}`).join(" ") },
  { type: "Page", title: "Policies", description: "APM priorities for security, rule of law, federalism, opportunity, food security and unity.", href: "/policies", keywords: priorities.map((item) => `${item.title} ${item.description}`).join(" ") },
  { type: "Page", title: "Newsroom", description: "Official APM press releases, announcements and event coverage.", href: "/news", keywords: "news press releases announcements newsroom" },
  { type: "Page", title: "Events", description: "Approved APM public events and participation information.", href: "/events", keywords: "events meetings activities participation" },
  { type: "Page", title: "Find a Chapter", description: "Verified public chapter and secretariat contact information.", href: "/chapters", keywords: "chapter state LGA office address contact Abuja secretariat" },
  { type: "Page", title: "Get Involved", description: "Membership, volunteering and polling-agent participation routes.", href: "/get-involved", keywords: "join membership volunteer polling agent participate" },
  ...resourceLibrary.map((resource) => ({ type: resource.category, title: resource.title, description: resource.description, href: resource.href, keywords: `${resource.type} ${resource.category} ${resource.version}` })),
] as const;
