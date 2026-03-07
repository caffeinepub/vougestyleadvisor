import type { BlogPost, PortfolioItem, Service } from "../backend.d";

export const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    id: "sample-1",
    title: "5 Stylish Outfit Ideas for College",
    excerpt:
      "Look effortlessly chic on campus with these must-try outfit combinations that are both trendy and comfortable.",
    content: `## Introduction\nLooking good on campus doesn't have to break the bank. Here are 5 outfit ideas that will make you stand out while staying comfortable throughout your long college days.\n\n## Main Tips\n1. Mix and match basics with statement pieces to create versatile looks\n2. Invest in quality denim that fits perfectly — it's the foundation of most outfits\n3. Layer smartly for versatile looks that transition from morning to evening\n4. Accessorize minimally but meaningfully\n5. Comfort is non-negotiable — choose fabrics wisely\n\n## Outfit Ideas\n- Classic white tee + high-waist wide-leg jeans + white sneakers + gold hoops\n- Floral midi dress + denim jacket + ankle boots + tote bag\n- Oversized blazer + cycling shorts + chunky white sneakers + mini bag\n- Knit co-ord set in neutral tones + platform sandals\n- Button-down shirt dress + white sneakers + crossbody bag\n\n## Styling Advice\nAlways prioritize comfort without sacrificing style. College fashion is about expressing your personality authentically. Don't be afraid to mix textures, patterns, and proportions — that's what makes an outfit interesting.\n\n## Conclusion\nThese looks are easy to recreate with pieces you likely already have or can find affordably. The key is to build a wardrobe of versatile basics and a few statement pieces that truly reflect who you are.`,
    author: "Shagun Goyal",
    category: "Casual Fashion",
    imageUrl: "/assets/generated/blog-college-outfits.dim_800x1000.jpg",
    tags: ["college", "casual", "outfit"],
    isPublished: true,
    publishDate: BigInt(Date.now() * 1000000),
  },
  {
    id: "sample-2",
    title: "How to Style a Black Dress 10 Different Ways",
    excerpt:
      "The little black dress is a wardrobe staple. Discover how to transform one dress into ten unique looks.",
    content: `## Introduction\nThe black dress is perhaps the most versatile piece in any wardrobe. A well-chosen black dress can take you from a Monday meeting to a Saturday night out without missing a beat. Here's how to make the most of it.\n\n## Main Tips\n1. Change your accessories completely to transform the entire feel\n2. Layer with different outerwear — blazer, leather jacket, or trench coat\n3. Swap shoes to change the vibe from casual to formal\n4. Experiment with belts to define or change the silhouette\n5. Play with bags — clutch for evening, tote for day\n\n## Outfit Ideas\n- Office chic: black dress + tailored blazer + pointed-toe pumps + structured bag\n- Weekend casual: black dress + oversized denim jacket + white sneakers + baseball cap\n- Evening glam: black dress + statement jewelry + strappy heels + mini clutch\n- Brunch look: black dress + linen cardigan + mules + sun hat\n- Boho vibe: black dress + fringed kimono + ankle boots + layered necklaces\n\n## Styling Advice\nInvest in a quality black dress with a silhouette that flatters your body type. Consider the fabric — jersey for comfort, silk for elegance, crepe for structure. The better the dress, the more styling versatility you'll have.\n\n## Conclusion\nOne dress, endless possibilities — that's the magic of a well-chosen black dress. It's the ultimate fashion investment that pays dividends for years.`,
    author: "Shagun Goyal",
    category: "Styling Tips",
    imageUrl: "/assets/generated/blog-black-dress.dim_800x1000.jpg",
    tags: ["black dress", "styling", "tips"],
    isPublished: true,
    publishDate: BigInt((Date.now() - 86400000) * 1000000),
  },
  {
    id: "sample-3",
    title: "Budget Fashion: Look Expensive for Less",
    excerpt:
      "Luxury style doesn't require a luxury budget. These tips will help you dress beautifully without overspending.",
    content: `## Introduction\nFashion should be accessible to everyone. The idea that you need to spend a fortune to look stylish is a myth. With smart shopping and clever styling, your budget is no barrier to looking absolutely fabulous.\n\n## Main Tips\n1. Shop end-of-season sales for significant discounts on quality pieces\n2. Invest in timeless basics in neutral colors — they never go out of style\n3. Thrift and vintage shop for unique, affordable finds\n4. Focus on fit — even an inexpensive piece looks elevated when it fits perfectly\n5. Care for your clothes properly so they last longer and look newer\n\n## Outfit Ideas\n- Thrifted structured blazer + basic white tee + well-fitted trousers + simple flats\n- Sale season midi dress styled with affordable accessories\n- Mix and match tops and bottoms in a cohesive color palette\n- Statement costume jewelry to elevate simple, affordable outfits\n\n## Styling Advice\nFit is everything. A ₹300 top that fits perfectly looks more expensive than a ₹3000 top that doesn't. Always get clothes tailored if needed — it's often inexpensive and makes a huge difference.\n\n## Conclusion\nWith smart shopping strategies and good styling knowledge, your budget is truly no barrier to looking fabulous every single day.`,
    author: "Shagun Goyal",
    category: "Budget Fashion",
    imageUrl: "/assets/generated/blog-budget-fashion.dim_800x1000.jpg",
    tags: ["budget", "affordable", "tips"],
    isPublished: true,
    publishDate: BigInt((Date.now() - 172800000) * 1000000),
  },
  {
    id: "sample-4",
    title: "Elegant Winter Outfit Ideas",
    excerpt:
      "Stay warm and stylish this winter with these curated outfit combinations perfect for the cold season.",
    content: `## Introduction\nWinter doesn't mean hiding under layers of shapeless fabric. This season is actually the perfect opportunity to embrace rich textures, warm tones, and elegant layering that creates truly beautiful outfits.\n\n## Main Tips\n1. Layer strategically — start thin and add warmth as needed\n2. Invest in a quality coat — it's the first thing people see\n3. Embrace rich textures: wool, cashmere, velvet, faux fur\n4. Add warmth through accessories: scarves, gloves, hats that complement your look\n5. Keep shoes weather-appropriate without sacrificing style\n\n## Outfit Ideas\n- Cream turtleneck + wide-leg camel trousers + ankle boots + structured coat\n- Oversized gray coat + knit midi dress + knee-high brown boots\n- Plaid blazer + black turtleneck + straight-leg pants + loafers\n- Velvet midi skirt + fitted sweater + heeled boots\n\n## Styling Advice\nNeutral tones with one warm statement accessory is the key to winter elegance. A burnt orange scarf or camel bag can instantly elevate an all-black outfit.\n\n## Conclusion\nWinter fashion is about cozy luxury — warmth, beautiful textures, and elegant proportions. You can absolutely have all three at once.`,
    author: "Shagun Goyal",
    category: "Seasonal Fashion",
    imageUrl: "/assets/generated/blog-winter-outfits.dim_800x1000.jpg",
    tags: ["winter", "seasonal", "elegant"],
    isPublished: true,
    publishDate: BigInt((Date.now() - 259200000) * 1000000),
  },
  {
    id: "sample-5",
    title: "Party Fashion: Dress to Impress Every Time",
    excerpt:
      "Whether it's a birthday bash or a festive celebration, these party outfit ideas will make you the star.",
    content: `## Introduction\nParties are your chance to go bold and experiment with fashion in ways you might not dare to on an ordinary day. Whether it's a casual birthday dinner or a grand festive celebration, knowing how to dress to impress can transform your entire evening.\n\n## Main Tips\n1. Choose a statement piece and build your entire outfit around it\n2. Don't be afraid of glitter, shine, and embellishment — that's what parties are for\n3. Comfort matters even at parties — you can't have fun if you're uncomfortable\n4. Consider the venue and dress code — elegant and appropriate\n5. Plan your full look including hair, makeup, and accessories in advance\n\n## Outfit Ideas\n- Gold sequin mini dress + nude strappy heels + simple clutch + bold lip\n- Emerald silk slip dress + fitted blazer + block heels + statement earrings\n- Embellished co-ord set in dusty rose + pointed pumps + minimal jewelry\n- Deep red midi dress + strappy sandals + updo hairstyle\n\n## Styling Advice\nA bold lip or statement earrings can elevate even the simplest party outfit. Choose your statement — outfit OR accessories — and let the other play a supporting role.\n\n## Conclusion\nParty fashion is ultimately about confidence. The most memorable looks are worn by people who are comfortable, happy, and fully themselves. Wear what makes you feel incredible.`,
    author: "Shagun Goyal",
    category: "Party Fashion",
    imageUrl: "/assets/generated/blog-party-fashion.dim_800x1000.jpg",
    tags: ["party", "evening", "glam"],
    isPublished: true,
    publishDate: BigInt((Date.now() - 345600000) * 1000000),
  },
];

export const SAMPLE_PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "port-1",
    title: "Casual Street Style",
    description:
      "A relaxed yet chic everyday look that blends comfort with style effortlessly.",
    stylingExplanation:
      "This look pairs high-waist wide-leg denim with a tucked-in linen blouse and crisp white sneakers. The key is the effortless balance between structured and relaxed pieces — the structured waistline of the jeans grounds the flowy blouse beautifully.",
    fashionTips:
      "When going casual, pick one statement piece. Here it's the wide-leg denim that elevates the whole look. Keep accessories minimal — small gold hoops and a classic watch are all you need.",
    imageUrl: "/assets/generated/portfolio-casual-street.dim_900x1100.jpg",
    category: "Casual Styling",
    isPublished: true,
  },
  {
    id: "port-2",
    title: "Wedding Guest Styling",
    description:
      "An elegant look perfect for attending weddings and formal celebrations in style.",
    stylingExplanation:
      "A silk-finish anarkali in dusty rose with subtle gold embroidery paired with minimal jewelry lets the outfit speak for itself. The color palette of dusty rose and gold was intentional for a daytime wedding — light enough for the hour, rich enough for the occasion.",
    fashionTips:
      "For weddings, always consider the venue and time of day. Lighter fabrics and colors for daytime, richer textures and deeper tones for evening events. Never outshine the bride — be elegant, not attention-grabbing.",
    imageUrl: "/assets/generated/portfolio-wedding-guest.dim_900x1100.jpg",
    category: "Event Styling",
    isPublished: true,
  },
  {
    id: "port-3",
    title: "Minimalist Fashion Look",
    description:
      "Clean lines and neutral tones create a powerful, understated elegance that speaks volumes.",
    stylingExplanation:
      "A cream tailored trouser suit with a simple white inner and nude heels demonstrates that true elegance needs no embellishment. The power of minimalism is in the fit and fabric quality — this look relies entirely on perfect tailoring.",
    fashionTips:
      "Minimalist outfits are about quality over quantity. Invest in well-fitted basics in neutral tones. The secret weapon of minimalist fashion is impeccable tailoring — everything should fit like it was made for you.",
    imageUrl: "/assets/generated/portfolio-minimalist.dim_900x1100.jpg",
    category: "Minimalist Looks",
    isPublished: true,
  },
  {
    id: "port-4",
    title: "Autumn Seasonal Fashion",
    description:
      "Warm earthy tones and layered textures capture the essence of autumn styling beautifully.",
    stylingExplanation:
      "An olive knit cardigan layered over a rust-colored midi dress with cognac ankle boots. The color palette was entirely inspired by autumn leaves — bringing the season's palette directly into the wardrobe creates an effortlessly cohesive look.",
    fashionTips:
      "Seasonal fashion is about embracing the colors and textures of the season. For autumn, stick to earthy tones: rust, olive, camel, and burnt orange. Layer thoughtfully — each layer should be visible and intentional.",
    imageUrl: "/assets/generated/portfolio-seasonal.dim_900x1100.jpg",
    category: "Seasonal Fashion",
    isPublished: true,
  },
];

export const SAMPLE_SERVICES: Service[] = [
  {
    id: "svc-1",
    title: "Personal Fashion Consultation",
    description:
      "Personalized fashion advice based on your body type, personality, and lifestyle. Get curated outfit ideas and shopping guidance tailored just for you.",
    price: "₹199 per consultation",
    isActive: true,
  },
  {
    id: "svc-2",
    title: "Outfit Planning",
    description:
      "Complete outfit suggestions for events, daily wear, or special occasions. Receive a detailed outfit guide with accessories and styling notes.",
    price: "₹399",
    isActive: true,
  },
  {
    id: "svc-3",
    title: "Event Styling",
    description:
      "Full styling guidance for weddings, parties, or photoshoots. Includes outfit selection, accessory pairing, hair and makeup direction.",
    price: "₹699",
    isActive: true,
  },
];
