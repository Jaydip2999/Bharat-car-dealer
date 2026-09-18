export interface DealershipHub {
  city: string;
  name: string;
  address: string;
  phone: string;
  timings: string;
  manager: string;
}

export const DEALERSHIP_CONFIG = {
  name: 'Bharat Wheels',
  tagline: 'India\'s Most Trusted Certified Pre-Owned Automotive Hub',
  phone: '+91 98765 43210',
  tollFree: '1800-209-8800',
  whatsappNumber: '919876543210',
  whatsappDisplay: '+91 98765 43210',
  email: 'care@bharatwheels.in',
  corporateAddress: 'Bharat Wheels Tower, Plot 42, Sector 29, Gurugram, Haryana 122001, India',
  hours: 'Mon - Sun: 9:30 AM to 8:30 PM (All 7 Days Open)',
  hubs: [
    {
      city: 'Delhi NCR',
      name: 'Bharat Wheels Experience Centre - Gurugram',
      address: 'Plot 42, Sector 29, Near City Centre Metro, Gurugram, Haryana 122001',
      phone: '+91 98765 43210',
      timings: '9:30 AM - 8:30 PM',
      manager: 'Rajesh Sharma'
    },
    {
      city: 'Mumbai',
      name: 'Bharat Wheels Signature Hub - Andheri West',
      address: 'Link Road, Opposite Infinity Mall, Andheri West, Mumbai, Maharashtra 400053',
      phone: '+91 98765 43211',
      timings: '9:30 AM - 8:30 PM',
      manager: 'Vikram Joshi'
    },
    {
      city: 'Bengaluru',
      name: 'Bharat Wheels Tech Hub - Indiranagar',
      address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
      phone: '+91 98765 43212',
      timings: '9:30 AM - 8:30 PM',
      manager: 'Anand Rao'
    },
    {
      city: 'Hyderabad',
      name: 'Bharat Wheels Flagship Hub - Hitec City',
      address: 'Road No. 36, Jubilee Hills / Hitec City Corridor, Hyderabad, Telangana 500081',
      phone: '+91 98765 43213',
      timings: '9:30 AM - 8:30 PM',
      manager: 'Srinivas Reddy'
    },
    {
      city: 'Pune',
      name: 'Bharat Wheels Hub - Baner High Street',
      address: 'Baner Road, Near Balewadi High Street, Pune, Maharashtra 411045',
      phone: '+91 98765 43214',
      timings: '9:30 AM - 8:30 PM',
      manager: 'Amit Deshmukh'
    }
  ] as DealershipHub[],
  guarantees: [
    {
      title: '210-Point Rigorous Certification',
      desc: 'Tested by ASE certified automotive engineers covering engine compression, OBD-II scan, gearbox, chassis and frame.'
    },
    {
      title: '1-Year Comprehensive Warranty',
      desc: 'Free pan-India mechanical warranty covering engine, gearbox, AC compressor, and electrical systems.'
    },
    {
      title: '7-Day Easy Return / Money Back',
      desc: 'Drive with total peace of mind. If the car does not fit your lifestyle, return within 7 days for a 100% refund.'
    },
    {
      title: 'Guaranteed RC Transfer & Clear RTO Title',
      desc: 'Hassle-free ownership transfer directly into your name with complete RTO paper trail and loan NOC.'
    }
  ]
};

export const formatWhatsAppLink = (message: string) => {
  return `https://wa.me/${DEALERSHIP_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
};
