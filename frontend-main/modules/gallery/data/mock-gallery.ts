import type { GalleryItem } from "../types/gallery.type"

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
] as const

const CATEGORIES = [
  "Construction",
  "Technical",
  "Real Estate",
  "Corporate Events",
  "Import & Export",
  "Visa & Travel",
  "Transportation",
  "Team & Office",
] as const

const DESCRIPTIONS: Record<(typeof CATEGORIES)[number], string[]> = {
  Construction: [
    "High-rise commercial project milestone completion.",
    "Site inspection and structural progress documentation.",
    "Foundation work and safety compliance overview.",
  ],
  Technical: [
    "Engineering team reviewing system architecture plans.",
    "Data center installation and network setup phase.",
    "Technical workshop and equipment deployment gallery.",
  ],
  "Real Estate": [
    "Luxury residential property showcase and interior tour.",
    "Commercial plaza leasing and amenities preview.",
    "Urban development project aerial and street views.",
  ],
  "Corporate Events": [
    "Annual partner summit and keynote session highlights.",
    "Global branch networking and awards ceremony.",
    "Leadership panel and product launch event coverage.",
  ],
  "Import & Export": [
    "Port logistics and container yard operations snapshot.",
    "Customs clearance and freight handling documentation.",
    "International trade exhibition booth and shipments.",
  ],
  "Visa & Travel": [
    "Travel advisory session and destination briefing.",
    "Visa processing center and client consultation desk.",
    "Airport lounge partnership and tour package launch.",
  ],
  Transportation: [
    "Fleet expansion and route mapping operations center.",
    "Intercity transport hub and passenger service rollout.",
    "Cargo delivery network and vehicle maintenance bay.",
  ],
  "Team & Office": [
    "Head office workspace and collaborative team areas.",
    "Regional branch opening and staff onboarding day.",
    "Customer support center and training facility tour.",
  ],
}

function buildGalleryItem(index: number): GalleryItem {
  const category = CATEGORIES[index % CATEGORIES.length]
  const descriptions = DESCRIPTIONS[category]
  const description = descriptions[index % descriptions.length]
  const imageCount = index % 3 === 0 ? 3 : index % 2 === 0 ? 2 : 1
  const baseImageIndex = index % GALLERY_IMAGES.length

  const createdAt = new Date(2024, index % 12, (index % 28) + 1).toISOString()

  return {
    id: `gallery-${String(index + 1).padStart(3, "0")}`,
    categoryName: category,
    description,
    isVisible: true,
    createdBy: "admin",
    createdAt,
    updatedAt: createdAt,
    deletedAt: null,
    images: Array.from({ length: imageCount }, (_, imageOffset) => ({
      altText: `${category} photo ${imageOffset + 1}`,
      imageUrl: GALLERY_IMAGES[(baseImageIndex + imageOffset) % GALLERY_IMAGES.length],
      displayOrder: imageOffset + 1,
    })),
  }
}

export const MOCK_GALLERY_ITEMS: GalleryItem[] = Array.from({ length: 24 }, (_, i) =>
  buildGalleryItem(i)
)
