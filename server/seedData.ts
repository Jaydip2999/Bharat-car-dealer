import bcrypt from 'bcryptjs';

export interface SeedCar {
  id: string;
  stockId: string;
  brand: string;
  model: string;
  variant: string;
  bodyType: 'SUV' | 'Sedan' | 'Hatchback' | 'MUV' | '4x4';
  year: number;
  kilometers: number;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic' | 'DCT/DCA' | 'AMT' | 'e-CVT';
  price: number; // in Lakhs
  estimatedEmi: number; // in ₹
  city: string;
  rto: string;
  ownership: '1st Owner' | '2nd Owner';
  insurance: string;
  safetyRating: number;
  mileage: string;
  enginePower: string;
  bootSpace: string;
  groundClearance: string;
  inspectionScore: number;
  certified: boolean;
  warranty: string;
  color: string;
  tag: string;
  description: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'DRAFT';
  featured: boolean;
  features: string[];
  images: {
    imageUrl: string;
    altText: string;
    isPrimary: boolean;
    sortOrder: number;
  }[];
}

export const INITIAL_CARS: SeedCar[] = [
  {
    id: 'nexon-2023',
    stockId: 'BW-2023-NX01',
    brand: 'Tata',
    model: 'Nexon',
    variant: 'Fearless Plus (S) DCA Petrol',
    bodyType: 'SUV',
    year: 2023,
    kilometers: 14200,
    fuelType: 'Petrol',
    transmission: 'DCT/DCA',
    price: 12.85,
    estimatedEmi: 20490,
    city: 'Delhi NCR',
    rto: 'DL-8C',
    ownership: '1st Owner',
    insurance: 'Comprehensive valid till Nov 2026',
    safetyRating: 5,
    mileage: '17.2 km/l',
    enginePower: '1.2L Turbocharged Revotron (120 PS / 170 Nm)',
    bootSpace: '382 Litres',
    groundClearance: '208 mm',
    inspectionScore: 99,
    certified: true,
    warranty: '1-Year Comprehensive Pan-India Warranty',
    color: 'Daytona Grey with White Roof',
    tag: '5-Star Bharat NCAP',
    description: 'Immaculate condition Tata Nexon Fearless Plus with dual-clutch automatic, 360-degree camera, ventilated leatherette seats, and electric voice sunroof. Thoroughly inspected with 210 quality checkpoints passed.',
    status: 'AVAILABLE',
    featured: true,
    features: [
      'Ventilated Front Seats',
      '360° Surround View Camera',
      'Electric Sunroof with Voice Assist',
      '10.25-inch Touchscreen Navigation',
      'Sequential LED DRLs',
      'Wireless Android Auto & Apple CarPlay'
    ],
    images: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85',
        altText: 'Tata Nexon Fearless Plus Daytona Grey Front Three-Quarter View',
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        altText: 'Tata Nexon Side Profile on Indian Highway',
        isPrimary: false,
        sortOrder: 1
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85',
        altText: 'Tata Nexon Dual Tone Cockpit & Infotainment Display',
        isPrimary: false,
        sortOrder: 2
      }
    ]
  },
  {
    id: 'creta-2023',
    stockId: 'BW-2023-CR02',
    brand: 'Hyundai',
    model: 'Creta',
    variant: 'SX (O) 1.5 CRDi AT',
    bodyType: 'SUV',
    year: 2023,
    kilometers: 19800,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    price: 18.95,
    estimatedEmi: 30200,
    city: 'Gurugram',
    rto: 'HR-26',
    ownership: '1st Owner',
    insurance: 'Zero-Depreciation valid till Aug 2026',
    safetyRating: 5,
    mileage: '19.1 km/l',
    enginePower: '1.5L U2 CRDi Diesel (116 PS / 250 Nm)',
    bootSpace: '433 Litres',
    groundClearance: '190 mm',
    inspectionScore: 98,
    certified: true,
    warranty: '1-Year Comprehensive Pan-India Warranty',
    color: 'Ranger Khaki with Abyss Black',
    tag: 'Panoramic Sunroof & ADAS',
    description: 'Top-of-the-line Hyundai Creta SX (O) Diesel Automatic with Level 2 ADAS active safety suite, Bose 8-speaker surround sound, and panoramic sunroof. Complete service history maintained at authorized Hyundai service center.',
    status: 'AVAILABLE',
    featured: true,
    features: [
      'Level 2 ADAS (Smart Cruise & Lane Keep)',
      'Panoramic Sunroof',
      'Bose Premium 8-Speaker Sound System',
      'Ventilated Seats & Air Purifier',
      'Electronic Parking Brake with Auto Hold',
      'Bluelink Connected Car Tech'
    ],
    images: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        altText: 'Hyundai Creta SX (O) Ranger Khaki Front View',
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=85',
        altText: 'Hyundai Creta Dynamic Highway Drive Angle',
        isPrimary: false,
        sortOrder: 1
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=85',
        altText: 'Hyundai Creta Panoramic Glass Sunroof & Cabin',
        isPrimary: false,
        sortOrder: 2
      }
    ]
  },
  {
    id: 'thar-2023',
    stockId: 'BW-2023-TH03',
    brand: 'Mahindra',
    model: 'Thar',
    variant: 'LX 4x4 Hard Top 2.2 mHawk AT',
    bodyType: '4x4',
    year: 2023,
    kilometers: 16500,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    price: 16.45,
    estimatedEmi: 26230,
    city: 'Delhi NCR',
    rto: 'DL-3C',
    ownership: '1st Owner',
    insurance: 'Comprehensive valid till Sep 2026',
    safetyRating: 4,
    mileage: '15.2 km/l',
    enginePower: '2.2L mHawk Diesel (130 PS / 300 Nm 4WD with MLD)',
    bootSpace: 'Drizzle/Fold Seats Expandable',
    groundClearance: '226 mm',
    inspectionScore: 97,
    certified: true,
    warranty: '1-Year Comprehensive Pan-India Warranty',
    color: 'Red Rage with Black Hard Top',
    tag: 'Mechanical Locking Differential',
    description: 'Iconic Mahindra Thar 4x4 with genuine mHawk diesel engine and automatic torque converter. Equipped with mechanical locking differential, all-terrain Ceat CrossDrive tyres, and washable interior with drain plugs.',
    status: 'AVAILABLE',
    featured: true,
    features: [
      'Shift-on-the-Fly 4x4 Low/High Transfer Case',
      'Mechanical Locking Differential (Rear)',
      '18-inch Deep Silver Alloy Wheels',
      'Roll-over Mitigation & ESP',
      'Drizzle-Resistant IP54 Infotainment',
      'Removable Doors & Washable Floor Drain Plugs'
    ],
    images: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
        altText: 'Mahindra Thar 4x4 Off-Road Front Angle',
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=85',
        altText: 'Mahindra Thar Rugged Side Profile in Red',
        isPrimary: false,
        sortOrder: 1
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=85',
        altText: 'Mahindra Thar High Ground Clearance Action Shot',
        isPrimary: false,
        sortOrder: 2
      }
    ]
  },
  {
    id: 'grand-vitara-2023',
    stockId: 'BW-2023-GV04',
    brand: 'Maruti Suzuki',
    model: 'Grand Vitara',
    variant: 'Alpha+ Intelligent Electric Hybrid e-CVT',
    bodyType: 'SUV',
    year: 2023,
    kilometers: 11200,
    fuelType: 'Hybrid',
    transmission: 'e-CVT',
    price: 19.25,
    estimatedEmi: 30680,
    city: 'Bengaluru',
    rto: 'KA-01',
    ownership: '1st Owner',
    insurance: 'Zero-Dep valid till Oct 2026',
    safetyRating: 5,
    mileage: '27.97 km/l (ARAI Certified)',
    enginePower: '1.5L Atkinson Cycle + Electric Motor (115 PS Combined)',
    bootSpace: '373 Litres',
    groundClearance: '210 mm',
    inspectionScore: 99,
    certified: true,
    warranty: '2-Year Extended Hybrid Battery Warranty Included',
    color: 'Nexa Blue with Arctic White',
    tag: '27.97 km/l Strong Hybrid',
    description: 'Exceptional fuel efficiency champion. Maruti Grand Vitara Strong Hybrid capable of running in pure EV silent mode in city traffic. Features Head-Up Display (HUD), ventilated seats, and 360-degree parking cameras.',
    status: 'AVAILABLE',
    featured: true,
    features: [
      'Pure EV Drive Mode Switch',
      'Head-Up Display (HUD)',
      'Panoramic Sliding Sunroof',
      'Wireless Phone Charger & 9" SmartPlay Pro+',
      'Ventilated Front Seats with Black Leatherette',
      '6 Airbags Standard & ESP'
    ],
    images: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        altText: 'Maruti Suzuki Grand Vitara Strong Hybrid Nexa Blue',
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85',
        altText: 'Maruti Grand Vitara Aerodynamic Roof Rails & Front Profile',
        isPrimary: false,
        sortOrder: 1
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85',
        altText: 'Maruti Grand Vitara Head Up Display and Digital Cockpit',
        isPrimary: false,
        sortOrder: 2
      }
    ]
  },
  {
    id: 'xuv700-2023',
    stockId: 'BW-2023-X705',
    brand: 'Mahindra',
    model: 'XUV700',
    variant: 'AX7 L 2.2 mHawk Diesel AT (7-Seater)',
    bodyType: 'SUV',
    year: 2023,
    kilometers: 22400,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    price: 23.85,
    estimatedEmi: 38000,
    city: 'Mumbai',
    rto: 'MH-02',
    ownership: '1st Owner',
    insurance: 'Comprehensive valid till Dec 2026',
    safetyRating: 5,
    mileage: '16.5 km/l',
    enginePower: '2.2L mHawk CRDi (185 PS / 450 Nm Class-Leading Torque)',
    bootSpace: 'Expandable 7-Seater / 498L',
    groundClearance: '200 mm',
    inspectionScore: 98,
    certified: true,
    warranty: '1-Year Comprehensive Pan-India Warranty',
    color: 'Midnight Black Metallic',
    tag: '12-Speaker Sony 3D Audio & ADAS',
    description: 'Mahindra flagship 7-seater SUV with top AX7 Luxury pack. Powered by a potent 185 PS mHawk diesel engine with 450 Nm torque. Equipped with Sony 3D sound system, blind view monitor, and flush door handles.',
    status: 'AVAILABLE',
    featured: true,
    features: [
      'Dual 10.25-inch Monolith HD Displays',
      'Sony 3D 12-Speaker Sound with Roof Speakers',
      'Level 2 ADAS with Adaptive Cruise & Auto Braking',
      'Skyroof (Segment Largest Panoramic Roof)',
      'Smart Flush Door Handles',
      'Memory Driver Seat with Welcome Retract'
    ],
    images: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=85',
        altText: 'Mahindra XUV700 AX7 Luxury Midnight Black Front Stance',
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        altText: 'Mahindra XUV700 7-Seater Executive Cabin View',
        isPrimary: false,
        sortOrder: 1
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=85',
        altText: 'Mahindra XUV700 Dual Monolith Screen Interior Dashboard',
        isPrimary: false,
        sortOrder: 2
      }
    ]
  },
  {
    id: 'city-2023',
    stockId: 'BW-2023-HC06',
    brand: 'Honda',
    model: 'City',
    variant: 'ZX 1.5 i-VTEC CVT',
    bodyType: 'Sedan',
    year: 2023,
    kilometers: 18100,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    price: 13.95,
    estimatedEmi: 22240,
    city: 'Delhi NCR',
    rto: 'DL-1C',
    ownership: '1st Owner',
    insurance: 'Zero-Depreciation valid till Jul 2026',
    safetyRating: 5,
    mileage: '18.4 km/l',
    enginePower: '1.5L i-VTEC DOHC with VTC (121 PS / 145 Nm)',
    bootSpace: '506 Litres',
    groundClearance: '165 mm',
    inspectionScore: 99,
    certified: true,
    warranty: '1-Year Comprehensive Pan-India Warranty',
    color: 'Platinum White Pearl',
    tag: 'Executive Honda Sensing ADAS',
    description: 'The definitive benchmark Indian executive sedan. Smooth 1.5L i-VTEC engine paired with CVT 7-step paddle shifters. Features Honda Sensing camera-based ADAS, LaneWatch camera, and plush beige leather upholstery.',
    status: 'AVAILABLE',
    featured: false,
    features: [
      'Honda Sensing ADAS (Collision Mitigation + LKAS)',
      'LaneWatch Blind Spot Monitoring Camera',
      'Electric One-Touch Sunroof',
      'Full LED 9-Array Inline Headlamps',
      'Walk-Away Auto Lock & Engine Remote Start',
      'Paddle Shifters (7-Speed Emulated CVT)'
    ],
    images: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85',
        altText: 'Honda City ZX Platinum White Pearl Executive Sedan',
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
        altText: 'Honda City Sedan Aerodynamic Side Silhouette',
        isPrimary: false,
        sortOrder: 1
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        altText: 'Honda City Plush Leatherette Interior Cabin',
        isPrimary: false,
        sortOrder: 2
      }
    ]
  },
  {
    id: 'innova-2022',
    stockId: 'BW-2022-IN07',
    brand: 'Toyota',
    model: 'Innova Crysta',
    variant: '2.4 ZX 7-Str Diesel AT',
    bodyType: 'MUV',
    year: 2022,
    kilometers: 36000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    price: 24.50,
    estimatedEmi: 39050,
    city: 'Hyderabad',
    rto: 'TS-09',
    ownership: '1st Owner',
    insurance: 'Comprehensive valid till Mar 2026',
    safetyRating: 5,
    mileage: '15.6 km/l',
    enginePower: '2.4L 2GD-FTV Diesel (150 PS / 360 Nm Bulletproof Engine)',
    bootSpace: '300L (expandable to 780L)',
    groundClearance: '178 mm',
    inspectionScore: 99,
    certified: true,
    warranty: '1-Year Comprehensive Pan-India Warranty',
    color: 'Super White with Chrome Accents',
    tag: 'Unmatched Resale Value & Reliability',
    description: 'Legendary Toyota reliability with indestructible 2.4L D-4D diesel engine. Second row captain chairs with foldable seatback tables, 7 airbags, and automatic climate control. Full Toyota service history verified.',
    status: 'AVAILABLE',
    featured: true,
    features: [
      'Middle Row Executive Captain Seats with Slide/Recline',
      '7 Airbags with Driver Knee Airbag',
      'Vehicle Stability Control & Hill Start Assist',
      'Automatic Climate Control with Rear AC Evaporator',
      'Cruise Control & Smart Keyless Entry',
      'Rear Seat Foldable Tray Tables with Cup Holders'
    ],
    images: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
        altText: 'Toyota Innova Crysta Super White Front Three-Quarter View',
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
        altText: 'Toyota Innova Crysta Spacious Executive Cabin',
        isPrimary: false,
        sortOrder: 1
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=85',
        altText: 'Toyota Innova Crysta Rear Trunk and Profile',
        isPrimary: false,
        sortOrder: 2
      }
    ]
  },
  {
    id: 'seltos-2023',
    stockId: 'BW-2023-KS08',
    brand: 'Kia',
    model: 'Seltos',
    variant: 'GTX Plus 1.5 Turbo Petrol DCT',
    bodyType: 'SUV',
    year: 2023,
    kilometers: 15400,
    fuelType: 'Petrol',
    transmission: 'DCT/DCA',
    price: 18.25,
    estimatedEmi: 29100,
    city: 'Pune',
    rto: 'MH-12',
    ownership: '1st Owner',
    insurance: 'Zero-Dep valid till Nov 2026',
    safetyRating: 5,
    mileage: '16.5 km/l',
    enginePower: '1.5L Smartstream Turbo GDi (160 PS / 253 Nm)',
    bootSpace: '433 Litres',
    groundClearance: '190 mm',
    inspectionScore: 98,
    certified: true,
    warranty: '1-Year Comprehensive Pan-India Warranty',
    color: 'Glacier White Pearl with Aurora Black',
    tag: 'Dual-Pane Panoramic Sunroof & 160 PS Turbo',
    description: 'Dynamic performance compact SUV with Kia 160 PS Smartstream Turbo engine and 7-speed dual clutch gearbox. Features connected dual 10.25-inch curved screens, electronic parking brake, and 17 Level 2 ADAS capabilities.',
    status: 'AVAILABLE',
    featured: false,
    features: [
      'Dual Panoramic Displays (10.25" Cluster + 10.25" Nav)',
      'Dual-Zone Fully Automatic Climate Control',
      '17 Autonomous ADAS Level 2 Features',
      'Bose Premium 8-Speaker Audio System',
      '360-Degree Camera with Blind Spot View in Cluster',
      'Ventilated Seats (Front Driver & Passenger)'
    ],
    images: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=85',
        altText: 'Kia Seltos GTX Plus Dual-Tone Glacier White Front View',
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85',
        altText: 'Kia Seltos LED Lightbar & Sport Grille Profile',
        isPrimary: false,
        sortOrder: 1
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85',
        altText: 'Kia Seltos Curved Dual Screen Cockpit with Ambient Lighting',
        isPrimary: false,
        sortOrder: 2
      }
    ]
  },
  {
    id: 'verna-2023',
    stockId: 'BW-2023-VN09',
    brand: 'Hyundai',
    model: 'Verna',
    variant: 'SX (O) 1.5 Turbo GDi 7-DCT',
    bodyType: 'Sedan',
    year: 2023,
    kilometers: 12800,
    fuelType: 'Petrol',
    transmission: 'DCT/DCA',
    price: 16.75,
    estimatedEmi: 26700,
    city: 'Delhi NCR',
    rto: 'DL-10',
    ownership: '1st Owner',
    insurance: 'Zero-Dep valid till Dec 2026',
    safetyRating: 5,
    mileage: '20.6 km/l',
    enginePower: '1.5L Turbo GDi Petrol (160 PS / 253 Nm, 0-100 in 8.1s)',
    bootSpace: '528 Litres (Segment Largest)',
    groundClearance: '170 mm',
    inspectionScore: 99,
    certified: true,
    warranty: '1-Year Comprehensive Pan-India Warranty',
    color: 'Titan Grey Metallic',
    tag: '0-100 in 8.1s Sport Sedan',
    description: 'Fastest sedan in the segment accelerating from 0 to 100 km/h in just 8.1 seconds. Full 5-star Global NCAP safety rating body shell with 64-color switchable ambient lighting and hands-free smart boot release.',
    status: 'AVAILABLE',
    featured: false,
    features: [
      'Full Horizon LED Positioning Lamp & DRL Bar',
      'Level 2 ADAS with Forward Collision Avoidance',
      'Heated & Ventilated Front Seats',
      'Switchable Ambient Light & Infotainment Panel',
      'Bose 8-Speaker Audio System with Subwoofer',
      'Smart Trunk Opening with Hands-Free Proximity'
    ],
    images: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
        altText: 'Hyundai Verna SX Turbo Titan Grey Sport Sedan',
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85',
        altText: 'Hyundai Verna Horizon Light Bar Front Stance',
        isPrimary: false,
        sortOrder: 1
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        altText: 'Hyundai Verna Sporty Dual Cockpit & Ambient Glow',
        isPrimary: false,
        sortOrder: 2
      }
    ]
  },
  {
    id: 'tiago-ev-2023',
    stockId: 'BW-2023-TE10',
    brand: 'Tata',
    model: 'Tiago EV',
    variant: 'XZ Plus Tech LUX (24 kWh Long Range)',
    bodyType: 'Hatchback',
    year: 2023,
    kilometers: 9800,
    fuelType: 'Electric',
    transmission: 'Automatic',
    price: 9.65,
    estimatedEmi: 15400,
    city: 'Bengaluru',
    rto: 'KA-03',
    ownership: '1st Owner',
    insurance: 'Comprehensive valid till Sep 2026',
    safetyRating: 4,
    mileage: '315 km (MIDC Certified Range)',
    enginePower: 'Permanent Magnet Synchronous Motor (74 PS / 114 Nm)',
    bootSpace: '240 Litres',
    groundClearance: '168 mm',
    inspectionScore: 99,
    certified: true,
    warranty: '8-Year / 1,60,000 km Battery Pack Warranty Active',
    color: 'Teal Blue with Contrast Black Roof',
    tag: 'Pure EV • ₹1/km Running Cost',
    description: 'Best-selling Indian electric city car with 24 kWh liquid-cooled battery pack delivering 315 km range. Ultra-low running cost of less than ₹1 per kilometer. Multi-mode regenerative braking with smartwatch connected car features.',
    status: 'AVAILABLE',
    featured: false,
    features: [
      '24 kWh Liquid Cooled IP67 Battery Pack',
      'Multi-Mode Regenerative Braking (0 to 3 levels)',
      'DC Fast Charging (10% to 80% in 57 mins)',
      'ZConnect Smartwatch & Mobile Telematics',
      'Cruise Control & Push Button Start',
      'Harman 8-Speaker Infotainment System'
    ],
    images: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=85',
        altText: 'Tata Tiago EV Teal Blue City Electric Hatchback',
        isPrimary: true,
        sortOrder: 0
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85',
        altText: 'Tata Tiago EV Front Grille with Signature Humanity Line',
        isPrimary: false,
        sortOrder: 1
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85',
        altText: 'Tata Tiago EV Modern Ergonomic Cabin',
        isPrimary: false,
        sortOrder: 2
      }
    ]
  }
];

export const INITIAL_ADMIN = {
  name: 'Bharat Wheels Admin',
  email: 'admin@bharatwheels.in',
  passwordHash: bcrypt.hashSync('Admin@123', 10),
  role: 'SUPER_ADMIN' as const
};
