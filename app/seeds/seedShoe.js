import { connectDB } from "../libs/mongoDb.js";
import Shoes from "../models/shoeModel.js";
import dotenv from 'dotenv'

dotenv.config();

const shoeData = [
  // Nike Air Jordan Collection
  {
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Jordan',
    releaseYear: 1985,
    description: 'The shoe that started it all. Michael Jordan\'s first signature shoe featuring the iconic "Bred" colorway.',
    price: 170,
    stock: 45,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['Black', 'Red', 'White'],
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/jordan-1-retro-high-og.jpg',
      'https://static.nike.com/a/images/t_PDP_1728_v1/jordan-1-retro-high-og-side.jpg'
    ]
  },
  {
    name: 'Air Jordan 4 Retro',
    brand: 'Jordan',
    releaseYear: 1989,
    description: 'Featuring visible Air cushioning and mesh panels, the AJ4 became a cultural icon after appearing in Spike Lee\'s "Do the Right Thing".',
    price: 200,
    stock: 32,
    size: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['White', 'Cement Grey', 'Black'],
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/jordan-4-retro.jpg'
    ]
  },
  {
    name: 'Air Jordan 11 Retro',
    brand: 'Jordan',
    releaseYear: 1995,
    description: 'Famous for its patent leather mudguard and carbon fiber spring plate. MJ wore these during the 72-10 season.',
    price: 225,
    stock: 18,
    size: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Black', 'Concord', 'White'],
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/jordan-11-retro.jpg'
    ]
  },
  {
    name: 'Travis Scott x Air Jordan 1 Low',
    brand: 'Jordan',
    releaseYear: 2019,
    description: 'Collaboration with Travis Scott featuring reverse Swoosh and Cactus Jack branding.',
    price: 150,
    stock: 8,
    size: [8, 9, 9.5, 10, 11],
    color: ['Brown', 'Black', 'White'],
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/travis-scott-jordan-1-low.jpg'
    ]
  },

  // Nike Collection
  {
    name: 'Nike Air Force 1 \'07',
    brand: 'Nike',
    releaseYear: 1982,
    description: 'The basketball original that became a lifestyle staple. Clean all-white leather upper with encapsulated Air cushioning.',
    price: 110,
    stock: 120,
    size: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13, 14],
    color: ['White'],
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/air-force-1-07.jpg'
    ]
  },
  {
    name: 'Nike Dunk Low Retro',
    brand: 'Nike',
    releaseYear: 1985,
    description: 'Originally a basketball shoe, now a skateboarding and streetwear essential. Featuring the classic "Panda" colorway.',
    price: 115,
    stock: 85,
    size: [6, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['White', 'Black'],
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/dunk-low-retro.jpg'
    ]
  },
  {
    name: 'Nike Air Max 90',
    brand: 'Nike',
    releaseYear: 1990,
    description: 'The shoe that made the Air Max visible. Designed by Tinker Hatfield with striking infrared accents.',
    price: 130,
    stock: 56,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['White', 'Particle Grey', 'Infrared'],
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/air-max-90.jpg'
    ]
  },
  {
    name: 'Nike SB Dunk Low',
    brand: 'Nike',
    releaseYear: 2002,
    description: 'Skateboarding version of the Dunk with Zoom Air cushioning and padded tongue.',
    price: 100,
    stock: 24,
    size: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11],
    color: ['Navy', 'White'],
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/sb-dunk-low.jpg'
    ]
  },
  {
    name: 'Off-White x Nike Air Presto',
    brand: 'Nike',
    releaseYear: 2017,
    description: 'Virgil Abloh\'s "The Ten" collection featuring deconstructed design and zip tie.',
    price: 160,
    stock: 5,
    size: [8, 9, 10, 11],
    color: ['Black', 'White', 'Cone'],
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/off-white-presto.jpg'
    ]
  },
  {
    name: 'Nike Air Max 1',
    brand: 'Nike',
    releaseYear: 1987,
    description: 'The original Air Max. Tinker Hatfield\'s groundbreaking design that exposed the Air window.',
    price: 140,
    stock: 42,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Red', 'White', 'Grey'],
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/air-max-1.jpg'
    ]
  },

  // Adidas Collection
  {
    name: 'Adidas Yeezy Boost 350 V2',
    brand: 'Adidas',
    releaseYear: 2016,
    description: 'Kanye West\'s iconic silhouette featuring Primeknit upper and full-length Boost cushioning.',
    price: 230,
    stock: 15,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Zebra', 'White', 'Black'],
    images: [
      'https://assets.adidas.com/images/yeezy-350-v2.jpg'
    ]
  },
  {
    name: 'Adidas Yeezy Boost 700',
    brand: 'Adidas',
    releaseYear: 2017,
    description: 'The "Wave Runner" started the chunky sneaker trend with its retro-futuristic design.',
    price: 300,
    stock: 12,
    size: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Grey', 'Teal', 'Orange'],
    images: [
      'https://assets.adidas.com/images/yeezy-700.jpg'
    ]
  },
  {
    name: 'Adidas Samba OG',
    brand: 'Adidas',
    releaseYear: 1950,
    description: 'Originally designed for icy football pitches, now a terrace culture icon with gum sole.',
    price: 100,
    stock: 150,
    size: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['Black', 'White', 'Gum'],
    images: [
      'https://assets.adidas.com/images/samba-og.jpg'
    ]
  },
  {
    name: 'Adidas Stan Smith',
    brand: 'Adidas',
    releaseYear: 1971,
    description: 'The timeless tennis classic named after the American tennis star. Perforated 3-Stripes.',
    price: 95,
    stock: 200,
    size: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13, 14],
    color: ['White', 'Green'],
    images: [
      'https://assets.adidas.com/images/stan-smith.jpg'
    ]
  },
  {
    name: 'Adidas Superstar',
    brand: 'Adidas',
    releaseYear: 1969,
    description: 'The legendary shell-toe basketball shoe adopted by hip-hop culture. Run-DMC made it iconic.',
    price: 100,
    stock: 175,
    size: [6, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['White', 'Black'],
    images: [
      'https://assets.adidas.com/images/superstar.jpg'
    ]
  },
  {
    name: 'Adidas Forum Low',
    brand: 'Adidas',
    releaseYear: 1984,
    description: 'Basketball heritage with removable strap and X-detail. Worn by Michael Jordan in the \'84 Olympics.',
    price: 110,
    stock: 38,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['White', 'Royal Blue'],
    images: [
      'https://assets.adidas.com/images/forum-low.jpg'
    ]
  },
  {
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    releaseYear: 2022,
    description: 'Premium running shoe with Primeknit+ upper and responsive Boost midsole.',
    price: 190,
    stock: 67,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['Core Black', 'Grey'],
    images: [
      'https://assets.adidas.com/images/ultraboost-22.jpg'
    ]
  },
  {
    name: 'Adidas Gazelle',
    brand: 'Adidas',
    releaseYear: 1968,
    description: 'Suede classic from the archives. Simple, sleek, and versatile for everyday wear.',
    price: 90,
    stock: 89,
    size: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Navy', 'White', 'Gold'],
    images: [
      'https://assets.adidas.com/images/gazelle.jpg'
    ]
  },
  {
    name: 'Adidas NMD_R1',
    brand: 'Adidas',
    releaseYear: 2015,
    description: 'Nomadic design combining Boost cushioning with Primeknit upper and EVA plugs.',
    price: 150,
    stock: 43,
    size: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Black', 'Red', 'Blue'],
    images: [
      'https://assets.adidas.com/images/nmd-r1.jpg'
    ]
  },
  {
    name: 'Pharrell x Adidas Human Race',
    brand: 'Adidas',
    releaseYear: 2016,
    description: 'Pharrell Williams collaboration featuring bold embroidered text and Primeknit upper.',
    price: 250,
    stock: 9,
    size: [8, 8.5, 9, 9.5, 10, 10.5, 11],
    color: ['Yellow', 'Black'],
    images: [
      'https://assets.adidas.com/images/human-race.jpg'
    ]
  }
];

const seedShoes = async () => {
  try {
    await connectDB();
    
    console.log('👟 Starting shoe seed...');
    console.log(`📝 Total shoes to seed: ${shoeData.length}`);

    let created = 0;
    let skipped = 0;

    for (const shoe of shoeData) {
      // Check if shoe already exists
      const existing = await Shoes.findOne({ 
        name: { $regex: new RegExp(`^${shoe.name}$`, 'i') } 
      });

      if (existing) {
        console.log(`⚠️  Skipped: ${shoe.name} (already exists)`);
        skipped++;
        continue;
      }

      await Shoes.create(shoe);
      console.log(`✅ Created: ${shoe.name} (${shoe.brand}) - $${shoe.price}`);
      created++;
    }

    console.log('\n🎉 Shoe seeding completed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Created: ${created} shoes`);
    console.log(`⚠️  Skipped: ${skipped} duplicates`);
    console.log(`📊 Total: ${shoeData.length} shoes`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Shoe seeding failed:', error.message);
    process.exit(1);
  }
};

// Run seed
seedShoes();