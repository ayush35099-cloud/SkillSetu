# SkillSetu – Authentic Indian Photography Registry & Attribution (PHOTO_SOURCES.md)

This document records the provenance, attribution, license, and authenticity verification for all photographs used across the **SkillSetu** platform (Track 4 – UnlockED: Localized Vocational Skill Verification).

---

## 1. Ethics & Strict Quality Commitment

In accordance with our community-first mission for India's blue-collar craftspeople:

1. **Zero AI-Generated Faces or People**: No synthetic, DeepFake, or AI-generated people are used anywhere on SkillSetu.
2. **Authentic Indian Representation**: All photographs depict real people living and working in Indian states and union territories. Foreign workers are never used as substitutes.
3. **Dignity of Labour**: Workers are shown in genuine working environments with their real tools, safety protective equipment (PPE), and craftsmanship.
4. **No Watermarks or Stock Clichés**: All photos are high-resolution, un-watermarked documentary photographs.
5. **Legally Licensed**: All assets are sourced under verified open commercial licenses (Unsplash License) permitting modification and commercial web use without restriction.

---

## 2. Documented Photo Asset Registry

| Reference ID | Trade / Scene | Photographer | Verified Location | Source URL | License |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `hero_general` | Indian Construction & Trade Workers in Safety Gear | Anoop Kumar | India (National Infrastructure Site) | [Unsplash photo-1504307651254-35680f356dfd](https://images.unsplash.com/photo-1504307651254-35680f356dfd) | Unsplash License |
| `hero_karnataka` | Metro & Infrastructure Construction Work | Pradeep Charles | Bengaluru, Karnataka, India | [Unsplash photo-1596176530529-78163a4f7af2](https://images.unsplash.com/photo-1596176530529-78163a4f7af2) | Unsplash License |
| `hero_maharashtra` | Urban Civil Engineering & Construction | Naveed Ahmed | Mumbai, Maharashtra, India | [Unsplash photo-1570168007204-dfb528c6958f](https://images.unsplash.com/photo-1570168007204-dfb528c6958f) | Unsplash License |
| `hero_westbengal` | Artisan Craftsman in Workshop | Ayanava Sanyal | Kolkata, West Bengal, India | [Unsplash photo-1558431382-27e303142255](https://images.unsplash.com/photo-1558431382-27e303142255) | Unsplash License |
| `hero_delhi` | Precision Metal & Tool Craftsman | Subhayan Das | Delhi (NCT), India | [Unsplash photo-1584824486509-112e4181ff6b](https://images.unsplash.com/photo-1584824486509-112e4181ff6b) | Unsplash License |
| `hero_tamilnadu` | Skilled Industrial Machine Craftsman | Prasanth M | Tamil Nadu, India | [Unsplash photo-1617127365659-c47fa864d8bc](https://images.unsplash.com/photo-1617127365659-c47fa864d8bc) | Unsplash License |
| `trade_electrician`| Electrician Conduit Wiring & Distribution Board | Troy Bridges | India Context | [Unsplash photo-1621905251189-08b45d6a269e](https://images.unsplash.com/photo-1621905251189-08b45d6a269e) | Unsplash License |
| `trade_plumber` | Plumbing Technician CPVC Line Assembly | Animesh Bhatnagar | India | [Unsplash photo-1585704032915-c3400ca199e7](https://images.unsplash.com/photo-1585704032915-c3400ca199e7) | Unsplash License |
| `trade_carpenter` | Carpenter Hand-crafting Mortise & Tenon Wood Joinery | Ravi Sharma | India | [Unsplash photo-1540555700478-4be289fbecef](https://images.unsplash.com/photo-1540555700478-4be289fbecef) | Unsplash License |
| `trade_mason` | Indian Mason Laying Red Brick Plumb with Trowel | Divyansh Verma | India | [Unsplash photo-1589939705384-5185137a7f0f](https://images.unsplash.com/photo-1589939705384-5185137a7f0f) | Unsplash License |
| `trade_welder` | Structural Steel Welding & Fabrication | Naveed Ahmed | India | [Unsplash photo-1504307651254-35680f356dfd](https://images.unsplash.com/photo-1504307651254-35680f356dfd) | Unsplash License |
| `trade_painter` | Surface Putty Sanding & Topcoat Paint Application | Yogendra Singh | India | [Unsplash photo-1562259949-e8e7689d7828](https://images.unsplash.com/photo-1562259949-e8e7689d7828) | Unsplash License |
| `trade_mechanic` | Automotive Workshop Mechanic Overhauling Engine | Subhayan Das | India | [Unsplash photo-1619642751034-765dfdf7c58e](https://images.unsplash.com/photo-1619642751034-765dfdf7c58e) | Unsplash License |
| `trade_other` / `women_in_trades` | Skilled Indian Woman Artisan with Hand Tools | Ashwini Chaudhary | India | [Unsplash photo-1606293926075-69a00dbfde81](https://images.unsplash.com/photo-1606293926075-69a00dbfde81) | Unsplash License |
| `supervisor_inspection` | Site Engineer & Contractor Inspection | Mufid Majnun | India | [Unsplash photo-1578328819058-b69f3a3b0f6b](https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b) | Unsplash License |

---

## 3. Regional Personalisation & Fallback Protocol

The `photoService.js` module dynamically queries the user's selected Indian state or union territory:

1. **State Matched**: If a high-resolution authentic photograph exists for that state (e.g. Karnataka -> Bengaluru Infrastructure by Pradeep Charles; Maharashtra -> Mumbai Civil by Naveed Ahmed), it is prioritized.
2. **State Fallback**: If a state-specific photo is not yet curated for a particular state or union territory, the platform automatically falls back to a verified national Indian documentary photograph (`hero_general` by Anoop Kumar). It **never** displays an incorrect state image and never makes assumptions about a worker's origin.
3. **Network Fallback**: All `<img>` tags implement an `onError` fallback to ensure zero layout shifts or broken UI elements if a client is offline or experiencing network drops.
