import { connectDB } from "../libs/mongoDb.js";
import Shoes from "../models/shoeModel.js";
import dotenv from 'dotenv'

dotenv.config();

const shoeData = [
  // Jordan Brand
  {
    name: 'Air Jordan 1 Retro High OG Bred',
    brand: 'Jordan',
    category: 'Basketball',
    releaseYear: 1985,
    description: 'The shoe that started it all. Michael Jordan\'s first signature shoe featuring the iconic "Bred" colorway.',
    price: 170,
    stock: 45,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['Black', 'Red', 'White'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1Nv8O1rd-s5G2lHVoA0t6u8fJdH5RUKIs',
      'https://lh3.googleusercontent.com/u/0/d/1RVXuvkFU6iwpeQe9Tt_Hburi6cE_kDF5',
      'https://lh3.googleusercontent.com/u/0/d/1zW6uQBOtXqJgtoixs-pkKhjYLK43CQJd',
      'https://lh3.googleusercontent.com/u/0/d/1QG3S7neKW2HjG7nNgveOBhbhs-x1oywx'
    ]
  },
  {
    name: 'Travis Scott x Air Jordan 1 High',
    brand: 'Jordan',
    category: 'Basketball',
    releaseYear: 2019,
    description: 'Collaboration with Travis Scott featuring reverse Swoosh and Cactus Jack branding.',
    price: 150,
    stock: 8,
    size: [8, 9, 9.5, 10, 11],
    color: ['Brown', 'Black', 'White'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/14NLyIJsdJ7ZVYHG2j0jhVOR02_YdoDxH',
      'https://lh3.googleusercontent.com/u/0/d/1suwjAY2GQH4lKtuWiWY9dvcC6LDfxvmb',
      'https://lh3.googleusercontent.com/u/0/d/1BnoHpCCVZO9i489k-e0MvFxCZYSz8XHF',
      'https://lh3.googleusercontent.com/u/0/d/18WiOZ7in1f4d8H9__q9rcl5oiuH5dp7g'
    ]
  },
  {
    name: 'Air Jordan 1 High Heritage',
    brand: 'Jordan',
    category: 'Basketball',
    releaseYear: 2022,
    description: 'Heritage colorway featuring a classic Chicago-inspired palette with premium leather construction.',
    price: 170,
    stock: 35,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['Red', 'White', 'Black'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1yLmntaNcje8b2aLQiwz5YiRYpNB0FhNC',
      'https://lh3.googleusercontent.com/u/0/d/1MihBk4s8p_3lPg5BT27eBsac88hjPLH7',
      'https://lh3.googleusercontent.com/u/0/d/1mk1hs5Jl0HzoEcILmmSjgYTNYAzhOH-l',
      'https://lh3.googleusercontent.com/u/0/d/1R0c4hWneKw7Cm1URWSfs8MpIi9lZnxyh'
    ]
  },
  {
    name: 'Air Jordan 1 High Phantom Red',
    brand: 'Jordan',
    category: 'Basketball',
    releaseYear: 2023,
    description: 'Premium Phantom Red colorway with sleek suede overlays and signature Air Jordan 1 silhouette.',
    price: 180,
    stock: 25,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Red', 'Phantom', 'White'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1RiEOOEZ8K6bv9m_4__VYvGKzeAukqPfb',
      'https://lh3.googleusercontent.com/u/0/d/1WyRzdIQgwGcfdIXxKOEnNsRGYVMQPjeo',
      'https://lh3.googleusercontent.com/u/0/d/1ds1-hu6dDfJOX9kIMDLV90PMHCggK8HM',
      'https://lh3.googleusercontent.com/u/0/d/13RKwg2geRbCVbjU1cxWw4Ua90VQGP1ui'
    ]
  },
  {
    name: 'Air Jordan 4 Retro Fire Red',
    brand: 'Jordan',
    category: 'Basketball',
    releaseYear: 1989,
    description: 'Featuring visible Air cushioning and mesh panels, the AJ4 Fire Red is a cultural icon.',
    price: 200,
    stock: 32,
    size: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['White', 'Fire Red', 'Black'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1ub-Q6JVo-HFNLKmTIu7zHFxiAA2Nakyt',
      'https://lh3.googleusercontent.com/u/0/d/1Zsh4v0YDlVwDHoNsDk0kyinWmwtAJPEw',
      'https://lh3.googleusercontent.com/u/0/d/1WgHcOt3wcj4I-O8M-6lQT9eOU2xxqrlJ',
      'https://lh3.googleusercontent.com/u/0/d/116K88GOqIsAT2J2UAX0Z_RLvlSJnp-Qk'
    ]
  },
  {
    name: 'Air Jordan 4 30th Anniversary Laser',
    brand: 'Jordan',
    category: 'Basketball',
    releaseYear: 2019,
    description: 'Special 30th Anniversary edition featuring laser-etched details celebrating the AJ4 legacy.',
    price: 225,
    stock: 20,
    size: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['White', 'Laser', 'Black'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1iHiljvz5HnVe8qQQ1ZwrBGWC9ovvwy0c',
      'https://lh3.googleusercontent.com/u/0/d/1dM6I6X8G_32O46qgVFURnSDKeoLhMpil',
      'https://lh3.googleusercontent.com/u/0/d/1Nz421mLR86F8IY4oqEjmeXWV5TUJop_T',
      'https://lh3.googleusercontent.com/u/0/d/1wwEQHjmPdhUs2PCxEcFPWA-gVmSiYGXF'
    ]
  },
  {
    name: 'Air Jordan 11 Retro Concord',
    brand: 'Jordan',
    category: 'Basketball',
    releaseYear: 1995,
    description: 'Famous for its patent leather mudguard and carbon fiber spring plate. The legendary Concord colorway.',
    price: 225,
    stock: 18,
    size: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['White', 'Concord', 'Black'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/11AIw2YuiCaWryoqWMjfJRIFpsp84X5Eh',
      'https://lh3.googleusercontent.com/u/0/d/1dVz7g1w7831tDKCs48_IkyplggwgyY31',
      'https://lh3.googleusercontent.com/u/0/d/12fBsCY5XwRqk0b1P7j0zEmmbgH7blulS',
      'https://lh3.googleusercontent.com/u/0/d/1-eazmMKzZiC22YD6iKz9H_L8nPjMSo5Y'
    ]
  },
  {
    name: 'Air Jordan 11 Retro Flu Game',
    brand: 'Jordan',
    category: 'Basketball',
    releaseYear: 1995,
    description: 'Iconic "Flu Game" colorway worn by MJ during the 1997 NBA Finals. Legendary red and black edition.',
    price: 225,
    stock: 15,
    size: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Black', 'Red'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1c_0LwKAgmx1UUBb39-a766UhKmOrOZOv',
      'https://lh3.googleusercontent.com/u/0/d/1jjK4mUT1H_NT1zV_G39eOSDYonzM2ZLc',
      'https://lh3.googleusercontent.com/u/0/d/1CE9KvnvBCqoNokyO_dxAGTu3lg1uwBXy',
      'https://lh3.googleusercontent.com/u/0/d/13Of5kuhnyfV2XUrhUsTMon9IcbOPj5UH'
    ]
  },

  // Nike
  {
    name: 'Nike Air Force 1 Low Supreme White',
    brand: 'Nike',
    category: 'Lifestyle',
    releaseYear: 2020,
    description: 'Supreme collaboration featuring the iconic box logo and premium all-white leather construction.',
    price: 165,
    stock: 12,
    size: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['White'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1BGQyAUWdBf7nZ4L5F0TesTw00A13ibuo',
      'https://lh3.googleusercontent.com/u/0/d/1PNMJQBpLjR_5fQ2N9zDnkUBaV2zQL9EK',
      'https://lh3.googleusercontent.com/u/0/d/1satjD8EV6fCfQhlblcbg8BmgA3UDPyjr',
      'https://lh3.googleusercontent.com/u/0/d/1-tnKIe4k8Ape_3n-Qg9u7gU34M7hWXAj'
    ]
  },
  {
    name: 'Nike Air Force 1 Low Kobe Bryant Forever',
    brand: 'Nike',
    category: 'Lifestyle',
    releaseYear: 2020,
    description: 'Tribute to Kobe Bryant featuring Lakers-inspired details and "Mamba Forever" embroidery.',
    price: 130,
    stock: 22,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['White', 'Purple', 'Gold'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/18zo909TlxcBW5GwusH7bEecmcYFV1Y1K',
      'https://lh3.googleusercontent.com/u/0/d/1SJYTPr2RiupYYC4rHw6b_rbRlSkRuWmf',
      'https://lh3.googleusercontent.com/u/0/d/1CJmesIvr4w4yztuHN-RswExnJfookhlU',
      'https://lh3.googleusercontent.com/u/0/d/1RxcHh6zzCilja6xnzeictGyobdYaZMjF'
    ]
  },
  {
    name: 'Nike SB Dunk Low Ben & Jerry\'s Chunky Dunky',
    brand: 'Nike',
    category: 'Skateboarding',
    releaseYear: 2020,
    description: 'Wild collaboration with Ben & Jerry\'s featuring ice cream-inspired colors and cow print overlays.',
    price: 250,
    stock: 6,
    size: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11],
    color: ['Blue', 'Yellow', 'Green', 'Brown'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1JcIuGZJIdCMTnr0tfg5NWwD7d4GCtgri',
      'https://lh3.googleusercontent.com/u/0/d/1i-643d4Ac3xTN2lVoRWd44ejfRC5tMJt',
      'https://lh3.googleusercontent.com/u/0/d/1gX9ipgBqmsQ30Nx7SEiSvVXcU3Uzr62G',
      'https://lh3.googleusercontent.com/u/0/d/1sM6SAB9Pk9qwrY2Afn8fWcxF6GjofTXq'
    ]
  },
  {
    name: 'Nike SB Dunk Low Supreme Rammellzee',
    brand: 'Nike',
    category: 'Skateboarding',
    releaseYear: 2023,
    description: 'Supreme collaboration honoring legendary artist Rammellzee with unique artwork and detailing.',
    price: 275,
    stock: 8,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Multi', 'Black', 'White'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1HGLvdOvmq33enSJ2ygo_vX139Q14pA2Q',
      'https://lh3.googleusercontent.com/u/0/d/1E_6WoAIKCqW9Liqd0jqv2rYgngbE9oTL',
      'https://lh3.googleusercontent.com/u/0/d/1ig5e-wDcrr0NYvW6v2POtht1jGdAcGaa',
      'https://lh3.googleusercontent.com/u/0/d/1Dy9Yw7QmKQ5LHU2sfV-KRhzXqpgeGB49'
    ]
  },
  {
    name: 'Nike Air Max 90 Silver Bullet',
    brand: 'Nike',
    category: 'Lifestyle',
    releaseYear: 1990,
    description: 'The iconic Silver Bullet colorway featuring metallic silver and infrared accents.',
    price: 140,
    stock: 45,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['Silver', 'White', 'Black', 'Infrared'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1AR5Sza4ma-E2DpD9bCs-mhJkgVFJSRlw',
      'https://lh3.googleusercontent.com/u/0/d/1SwP5WrlD3blDOpW_udoUql_2PFrCt740',
      'https://lh3.googleusercontent.com/u/0/d/1-V_YO6pJE2hY8b55iY_dqKLo84ojZG3U',
      'https://lh3.googleusercontent.com/u/0/d/1mE4P29rEdvuHLPuXSg0gN_oXxnl94xmx'
    ]
  },
  {
    name: 'Nike Air VaporMax Off-White 2018',
    brand: 'Nike',
    category: 'Running',
    releaseYear: 2018,
    description: 'Virgil Abloh\'s "The Ten" collection featuring transparent VaporMax sole and deconstructed design.',
    price: 250,
    stock: 5,
    size: [8, 8.5, 9, 9.5, 10, 10.5, 11],
    color: ['White', 'Black', 'Clear'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1MCuTO0-dh7F5Kec4FVfUU2B5ufYlUMSv',
      'https://lh3.googleusercontent.com/u/0/d/11Ch_60liH1HvKdGCchVs34tJEwqdz_hk',
      'https://lh3.googleusercontent.com/u/0/d/1-f_ZSFZBPnlbeFAm-c7A6wYUPg5YyDzX',
      'https://lh3.googleusercontent.com/u/0/d/1KVCTOJSzUms9uiNGW2qFOvFzlo2kN3kx',
      'https://lh3.googleusercontent.com/u/0/d/1Mj5A11dZ20VzMtWeblyiSoGA31G-Qkp1'
    ]
  },
  {
    name: 'Nike Air VaporMax 2023 Flyknit Pure Platinum',
    brand: 'Nike',
    category: 'Running',
    releaseYear: 2023,
    description: 'Latest VaporMax technology with sustainable Flyknit upper and Pure Platinum colorway.',
    price: 210,
    stock: 30,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['Pure Platinum', 'Anthracite', 'White'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1EjhXQRpdgEW-TysPm14_pndTigPvKJ78',
      'https://lh3.googleusercontent.com/u/0/d/1RO6sPVzwzakHFD83haiVBbr25rip2u4P',
      'https://lh3.googleusercontent.com/u/0/d/11zkOvua32EOIHOyE-rweD73kWUPW0ZPg',
      'https://lh3.googleusercontent.com/u/0/d/1xfJQO5HLbgfxGVwds0TM05riyvfkUceB'
    ]
  },
  {
    name: 'Nike Air More Uptempo Scottie Pippen',
    brand: 'Nike',
    category: 'Basketball',
    releaseYear: 1996,
    description: 'OG colorway worn by Scottie Pippen featuring the iconic "AIR" lettering on the sides.',
    price: 160,
    stock: 28,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['Black', 'White', 'Red'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1SODZM6woVDxmQDjNa9sd4sRX4WiPD7bh',
      'https://lh3.googleusercontent.com/u/0/d/15WAz8ljgCUwjNXz0YbEzVNSU8Hm3nasU',
      'https://lh3.googleusercontent.com/u/0/d/1KiYCvzoYWJXxLP4FAIwa18Xv4-1iXwpb',
      'https://lh3.googleusercontent.com/u/0/d/1qwAMbP5snYntiUQZi4izI5hxzXcWkWum'
    ]
  },
  {
    name: 'Nike Air More Uptempo Split Navy Red',
    brand: 'Nike',
    category: 'Basketball',
    releaseYear: 2020,
    description: 'Bold split colorway featuring half navy and half red design with contrasting details.',
    price: 170,
    stock: 20,
    size: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Navy', 'Red', 'White'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1luP-0ic2zvT1AQHA1nIPh5eFxclcmrF9',
      'https://lh3.googleusercontent.com/u/0/d/1KgXjjeLSs8bBrhQ8DS_UtZaSfx54fsyt',
      'https://lh3.googleusercontent.com/u/0/d/1lFZj0kYlPdwWBN4EXoss9OfuxouKJGmc',
      'https://lh3.googleusercontent.com/u/0/d/18oY2hgQFdKLtkPUYunNTOh4ElUSVCkI-'
    ]
  },
  {
    name: 'Nike Zoom Freak 1 Roses',
    brand: 'Nike',
    category: 'Basketball',
    releaseYear: 2019,
    description: 'Giannis Antetokounmpo\'s first signature shoe featuring rose-inspired details and Zoom Air cushioning.',
    price: 120,
    stock: 35,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['White', 'Red', 'Pink'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1b5bp88ho4c3_NdHD-CAMet8NvSE0zNx9',
      'https://lh3.googleusercontent.com/u/0/d/1an6D7TvvDvx9uC_Vml3azW15fvOr06r7',
      'https://lh3.googleusercontent.com/u/0/d/155iGicfhwE9kNM6uFAea929eELr7E28u',
      'https://lh3.googleusercontent.com/u/0/d/1fU4ZMUzDwcFFRtm5wHq19ykINYJeJh_e'
    ]
  },

  // Adidas
  {
    name: 'Adidas Yeezy Boost 350 V2 Beluga Reflective',
    brand: 'Adidas',
    category: 'Lifestyle',
    releaseYear: 2021,
    description: 'Reflective version of the iconic Beluga colorway with grey and orange Primeknit upper.',
    price: 230,
    stock: 15,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Grey', 'Orange', 'Reflective'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1ps5glIrXAZUy8PaD_QfRT5sYIpQ-zcBd',
      'https://lh3.googleusercontent.com/u/0/d/1wvprAqem2AXX915wNIF0hFkUE9MF65YJ',
      'https://lh3.googleusercontent.com/u/0/d/1_XwEops5VGGI2zTi1LqTzPCnuv8q_6Q9',
      'https://lh3.googleusercontent.com/u/0/d/1h2b0hVlLTho5d0c0OCNxGx2T-JxmVdzx'
    ]
  },
  {
    name: 'Adidas Yeezy 700 V3 Kyanite',
    brand: 'Adidas',
    category: 'Lifestyle',
    releaseYear: 2021,
    description: 'Futuristic silhouette featuring RPU cage glow-in-the-dark details and Kyanite blue accents.',
    price: 200,
    stock: 18,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['White', 'Blue', 'Grey'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1vMAi8_HErSIjjXyxBX-VuwGgEOz9Cx4Q',
      'https://lh3.googleusercontent.com/u/0/d/1_HzIzMJL7mUG0wppP1ZpbY6MOYZjGdcW',
      'https://lh3.googleusercontent.com/u/0/d/1xeUDIuA-ag-sWfFVP1dxZmCC5qWwmDi4',
      'https://lh3.googleusercontent.com/u/0/d/1DpryG47ldVXGjbFt7_WT57ke21kR8RBq'
    ]
  },
  {
    name: 'Adidas Samba OG Cloud White Core Black',
    brand: 'Adidas',
    category: 'Lifestyle',
    releaseYear: 1950,
    description: 'Original terrace icon featuring premium leather, suede T-toe, and gum rubber outsole.',
    price: 100,
    stock: 150,
    size: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['Cloud White', 'Core Black', 'Gum'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1vQDB29FUxRINxbgbcJDIoyPC_BW7X3Tx',
      'https://lh3.googleusercontent.com/u/0/d/1hRIymAkhtLfkRiZUQn2UduyEVkIePUp8',
      'https://lh3.googleusercontent.com/u/0/d/1TqvdMm2t4fGPOMzB_gZ5ZmFA0nXA1Zjx',
      'https://lh3.googleusercontent.com/u/0/d/1U-joKYvqC_uON2y3mmC46YV3DVQgsgu1'
    ]
  },
  {
    name: 'Adidas Stan Smith Triple White',
    brand: 'Adidas',
    category: 'Tennis',
    releaseYear: 1971,
    description: 'The timeless tennis classic in triple white colorway with perforated 3-Stripes.',
    price: 95,
    stock: 200,
    size: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13, 14],
    color: ['Triple White'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1FTf0MYLAN2YVmy9seM8SkV9GSe8cRLi1',
      'https://lh3.googleusercontent.com/u/0/d/1A4T1iMGHh1wFK-m9SLJ5i6ysKELdLwh-',
      'https://lh3.googleusercontent.com/u/0/d/1EMh3ek0V7Lb7qB3hO4L9KdHfdBWy1YW8',
      'https://lh3.googleusercontent.com/u/0/d/1xFvZM1C2s4uNm226eDL6rdTbUqG52cFC'
    ]
  },
  {
    name: 'Adidas Superstar Cloud White Core Black',
    brand: 'Adidas',
    category: 'Lifestyle',
    releaseYear: 1969,
    description: 'The legendary shell-toe in classic white and black colorway. Hip-hop culture icon.',
    price: 100,
    stock: 175,
    size: [6, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['Cloud White', 'Core Black'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/11xj7OlOY-Fr3YQuLhy5ToSXafhttTFTG',
      'https://lh3.googleusercontent.com/u/0/d/1irHfIOQFX6PAZWbcb8J0FtXJ4A_KaXja',
      'https://lh3.googleusercontent.com/u/0/d/1qgMheUGZEWafL_xbOS6k2heWcxJFAAtT',
      'https://lh3.googleusercontent.com/u/0/d/1h2zKkQkpPq5D1uGCC7qwRbUXRRc55MIH'
    ]
  },
  {
    name: 'Adidas Ultra Boost DNA Clima Schematic',
    brand: 'Adidas',
    category: 'Running',
    releaseYear: 2021,
    description: 'Technical schematic design with Clima technology and responsive Boost cushioning.',
    price: 180,
    stock: 40,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['White', 'Black', 'Yellow'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1lmA89cUpD4lLaqqLXoCuf10Kuirz-8zm',
      'https://lh3.googleusercontent.com/u/0/d/1YdNyD9RWtJ9oY_GlwigoWWb1nv92PMy0',
      'https://lh3.googleusercontent.com/u/0/d/1XXAmTh5iGSGV71lECQMGYRW2KTvuHW-Z',
      'https://lh3.googleusercontent.com/u/0/d/1UOGugS6hQHJcek-JSo9lJ_l163uXd6rx'
    ]
  },
  {
    name: 'Adidas NMD Hu Pharrell Human Race Triple Black',
    brand: 'Adidas',
    category: 'Lifestyle',
    releaseYear: 2018,
    description: 'Pharrell Williams collaboration featuring bold embroidered text in sleek triple black.',
    price: 220,
    stock: 14,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Triple Black'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1M2weLbCplEnFGXaztvQ0nfQtLGaZMP1W',
      'https://lh3.googleusercontent.com/u/0/d/1XgPb_rEPZV8wc-QHIO_y0nMsGJWP8npN',
      'https://lh3.googleusercontent.com/u/0/d/1FcLqryJW5AhmVm30R-51H7YSFm_Eku0p',
      'https://lh3.googleusercontent.com/u/0/d/1KUOi-Qarv8JaV_GC84xBTYvAer-xfDEr'
    ]
  },
  {
    name: 'Adidas Harden Vol. 5 McDonalds All American',
    brand: 'Adidas',
    category: 'Basketball',
    releaseYear: 2021,
    description: 'Special edition celebrating the McDonald\'s All American Game with bold red and yellow accents.',
    price: 140,
    stock: 25,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    color: ['Red', 'Yellow', 'Black'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1BMT4n6Y9KEUj99NhDgyy-PJQ04jFspnw',
      'https://lh3.googleusercontent.com/u/0/d/1qgx1S5J7YYCi_hxeU2SEzcYpyxVGcHsA',
      'https://lh3.googleusercontent.com/u/0/d/1wZJvoDFe4Ov5GUeFyuzp5HL-xe1V398o',
      'https://lh3.googleusercontent.com/u/0/d/1_dGp3tYrtEVFZ-65g1qa8x2rhaqU3HlK'
    ]
  },

  // Converse
  {
    name: 'Converse Chuck Taylor 70s High CDG PLAY Black',
    brand: 'Converse',
    category: 'Lifestyle',
    releaseYear: 2015,
    description: 'Comme des Garçons collaboration featuring the iconic heart logo with eyes on high-top canvas.',
    price: 150,
    stock: 30,
    size: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Black', 'White'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1BZRYrn7WhJZ4QV5Sumv7QoGWtF6_YrZd',
      'https://lh3.googleusercontent.com/u/0/d/1Rf6TTyleleOorEGBYM3lG5y9_ICvUj8M',
      'https://lh3.googleusercontent.com/u/0/d/1_1waRffS2sTj4q_562mLFmpdCghWjXh6',
      'https://lh3.googleusercontent.com/u/0/d/1XHdTWpOhHTZRjgMZkFmgIG4Yv-Ljp7TX'
    ]
  },
  {
    name: 'Converse Chuck Taylor All-Star High Off-White',
    brand: 'Converse',
    category: 'Lifestyle',
    releaseYear: 2018,
    description: 'Virgil Abloh\'s "The Ten" deconstructed take on the classic Chuck Taylor with translucent sole.',
    price: 130,
    stock: 10,
    size: [6, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['White', 'Black', 'Clear'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/111tzWC7c_zNi4fkwHsAIQlQ30uO3IbXd',
      'https://lh3.googleusercontent.com/u/0/d/16N7KT-waEmwzGT2nKbdlce1X6HzVT6my',
      'https://lh3.googleusercontent.com/u/0/d/1-70LbIOyGBIwE4aGP3thIXqnUd4gOAew',
      'https://lh3.googleusercontent.com/u/0/d/18RPkbo4hduWa1F6oZG9y8i-a8GNMCfLD'
    ]
  },
  {
    name: 'Converse All Star BB Shift Vegas Lights',
    brand: 'Converse',
    category: 'Basketball',
    releaseYear: 2023,
    description: 'Performance basketball shoe inspired by the bright lights of Las Vegas with vibrant color accents.',
    price: 120,
    stock: 20,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Multi', 'Neon', 'Black'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1uvX4uhisMO1_SAq35PFOOU8NqmHbtSAN',
      'https://lh3.googleusercontent.com/u/0/d/1IX_8TDl6xbTQMzeehC_gyg6gWbRRcK2f',
      'https://lh3.googleusercontent.com/u/0/d/1w98-Pi7QqynfJlp-SxBTCtLf7DlXHOH1',
      'https://lh3.googleusercontent.com/u/0/d/1KKGGyTeGHh4m0eIRwUZiBXsFrz9F9OG9'
    ]
  },
  {
    name: 'Converse All Star BB Shift Transformers Bumblebee',
    brand: 'Converse',
    category: 'Basketball',
    releaseYear: 2023,
    description: 'Transformers collaboration featuring Bumblebee-inspired yellow and black design for on-court performance.',
    price: 125,
    stock: 18,
    size: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    color: ['Yellow', 'Black', 'Grey'],
    images: [
      'https://lh3.googleusercontent.com/u/0/d/1wgaGk0JWS0zu1CXuxWHzOH8Zl34ExumO',
      'https://lh3.googleusercontent.com/u/0/d/1-Vme98XsSDEtaba3lD6BWF6_vp5jJRyb',
      'https://lh3.googleusercontent.com/u/0/d/1qUkOGpGBrjaFq5j-N0u3Qkx-a2Mu1Gn3',
      'https://lh3.googleusercontent.com/u/0/d/1BtPmWv9ngIZ0jkV5S7nBbotV86WPJKlh'
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

seedShoes();