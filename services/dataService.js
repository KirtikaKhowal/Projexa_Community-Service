/**
 * BloodConnect Data Service & Persistent State Layer
 * 
 * Provides centralized storage, localStorage persistence, and real-time state listeners
 * for Donors, NGOs, Campaigns, Registrations, Home Collections, Blood Needs, Contributions,
 * Rewards, Certificates, and Notifications.
 */

const STORAGE_KEY = 'bloodconnect_platform_data_v4';
const USER_KEY = 'bloodconnect_active_role_v2';
const AUTH_KEY = 'bloodconnect_auth_session_v2';

// ── Realistic Initial Seed Data (Verified Indian NGOs & Real Geos) ──
const INITIAL_DATA = {
  ngos: [
    {
      id: 'ngo-1',
      name: 'Indian Red Cross Society',
      logo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=120&auto=format&fit=crop&q=80',
      description: 'National humanitarian organization dedicated to emergency medical response, blood banking, and disaster relief.',
      city: 'New Delhi',
      verified: true,
      supportedCampaigns: 48,
      rating: 4.9,
      contact: '+91 11 2371 6441',
      email: 'contact@indianredcross.org',
      licenseNo: 'DL-BB-2018-091',
    },
    {
      id: 'ngo-2',
      name: 'Rotary Blood Bank Delhi',
      logo: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=120&auto=format&fit=crop&q=80',
      description: 'One of northern India’s largest state-of-the-art blood banking facilities committed to 100% voluntary donation.',
      city: 'New Delhi',
      verified: true,
      supportedCampaigns: 36,
      rating: 4.8,
      contact: '+91 11 4165 9999',
      email: 'delhi@rotarybloodbank.org',
      licenseNo: 'DL-BB-2019-142',
    },
    {
      id: 'ngo-3',
      name: 'Lions Blood Center Mumbai',
      logo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=120&auto=format&fit=crop&q=80',
      description: 'Non-profit blood center providing free blood and platelets to thalassemia and cancer patients across Maharashtra.',
      city: 'Mumbai',
      verified: true,
      supportedCampaigns: 52,
      rating: 4.9,
      contact: '+91 22 2847 1212',
      email: 'support@lionsbloodcenter.org',
      licenseNo: 'MH-BB-2017-063',
    },
    {
      id: 'ngo-4',
      name: 'Sankalp India Foundation',
      logo: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=120&auto=format&fit=crop&q=80',
      description: 'Youth-run organization working towards zero preventable deaths due to blood scarcity in Karnataka.',
      city: 'Bengaluru',
      verified: true,
      supportedCampaigns: 29,
      rating: 4.7,
      contact: '+91 80 2341 5566',
      email: 'contact@sankalpindia.net',
      licenseNo: 'KA-BB-2020-215',
    },
  ],

  camps: [
    {
      id: 'camp-rohini-1',
      name: 'Saroj Super Speciality & Red Cross Camp Rohini',
      ngoId: 'ngo-1',
      ngoName: 'Indian Red Cross Society',
      date: '2025-04-14',
      time: '09:00 AM - 04:30 PM',
      address: 'Plot No. 2, Institutional Area, Sector 14 Extn, Rohini',
      city: 'New Delhi',
      area: 'Rohini / North West Delhi',
      landmark: 'Near Madhuban Chowk & Rohini East Metro Station',
      pincode: '110085',
      lat: 28.7118,
      lng: 77.1264,
      bloodGroupsNeeded: ['O+', 'O-', 'A+', 'B+', 'AB+'],
      totalSeats: 150,
      registeredCount: 74,
      status: 'Registration Open',
      contactPhone: '+91 98101 22344',
      coordinator: 'Dr. Amit Malhotra',
      facilities: ['AC Mobile Donation Bus', 'Free Hemoglobin & Vitals Screening', 'Donor Medallion', 'Juices & High-Protein Snacks', 'Emergency Medical Backup'],
      description: 'Dedicated community drive for North Delhi residents in collaboration with Saroj Hospital and Red Cross Delhi state chapter.',
    },
    {
      id: 'camp-pitampura-2',
      name: 'Pitampura Netaji Subhash Place Rotary Drive',
      ngoId: 'ngo-2',
      ngoName: 'Rotary Blood Bank Delhi',
      date: '2025-04-16',
      time: '10:00 AM - 05:00 PM',
      address: 'Max Healthcare Foyer, Ring Road, Pitampura',
      city: 'New Delhi',
      area: 'Pitampura / North West Delhi',
      landmark: 'Opposite NSP Metro Station & Netaji Subhash Place Tower',
      pincode: '110034',
      lat: 28.6946,
      lng: 77.1492,
      bloodGroupsNeeded: ['A-', 'B-', 'O-', 'AB-'],
      totalSeats: 120,
      registeredCount: 104,
      status: 'Almost Full',
      contactPhone: '+91 98118 77655',
      coordinator: 'Sunil Chawla',
      facilities: ['Air Conditioned Stations', 'Rare Rh Negative Typing', 'Instant Digital Donor Pass', 'Nutritional Goody Bag'],
      description: 'High-priority drive targeting rare negative blood groups for trauma and surgical centers in North & West Delhi.',
    },
    {
      id: 'camp-1',
      name: 'AIIMS Community Mega Trauma Blood Drive',
      ngoId: 'ngo-1',
      ngoName: 'Indian Red Cross Society',
      date: '2025-04-12',
      time: '09:00 AM - 04:00 PM',
      address: 'Main Auditorium Foyer, AIIMS Campus, Ansari Nagar East',
      city: 'New Delhi',
      area: 'AIIMS / South Delhi',
      landmark: 'Near Gate No. 2, AIIMS Metro Station',
      pincode: '110029',
      lat: 28.5672,
      lng: 77.2100,
      bloodGroupsNeeded: ['O-', 'A-', 'B-', 'AB+', 'O+'],
      totalSeats: 180,
      registeredCount: 118,
      status: 'Registration Open',
      contactPhone: '+91 98112 34567',
      coordinator: 'Dr. R. K. Sharma',
      facilities: ['Air Conditioned Lounge', 'Free Blood Typing & Vitals Check', 'Refreshments Provided', 'Donor Certificate', 'Standby Ambulance'],
      description: 'Special voluntary blood drive in partnership with AIIMS Blood Bank to maintain critical emergency trauma supplies.',
    },
    {
      id: 'camp-2',
      name: 'Connaught Place Central Park LifeSavers Camp',
      ngoId: 'ngo-2',
      ngoName: 'Rotary Blood Bank Delhi',
      date: '2025-04-15',
      time: '10:00 AM - 05:00 PM',
      address: 'Central Park Pavilion, Outer Circle, Connaught Place',
      city: 'New Delhi',
      area: 'Connaught Place / Central Delhi',
      landmark: 'Above Rajiv Chowk Metro Station Gate 6',
      pincode: '110001',
      lat: 28.6315,
      lng: 77.2167,
      bloodGroupsNeeded: ['O+', 'B+', 'A+', 'AB-'],
      totalSeats: 140,
      registeredCount: 128,
      status: 'Almost Full',
      contactPhone: '+91 98711 88223',
      coordinator: 'Vikramjit Singh',
      facilities: ['Wheelchair Accessible', 'Certified Doctors', 'Refreshments & Fruit Drinks', 'Instant Blood Group Card'],
      description: 'Downtown community drive with rotary mobile blood collection bus equipped with automated platelet apheresis.',
    },
    {
      id: 'camp-dwarka-3',
      name: 'Dwarka Sector 10 Youth & Citizen Camp',
      ngoId: 'ngo-3',
      ngoName: 'Lions Blood Center Mumbai',
      date: '2025-04-17',
      time: '09:30 AM - 03:30 PM',
      address: 'Venkateshwar Hospital Foyer, Sector 18A, Dwarka',
      city: 'New Delhi',
      area: 'Dwarka / South West Delhi',
      landmark: 'Near Dwarka Sector 12 Metro Station',
      pincode: '110075',
      lat: 28.5888,
      lng: 77.0425,
      bloodGroupsNeeded: ['O+', 'B+', 'A+', 'O-'],
      totalSeats: 130,
      registeredCount: 58,
      status: 'Registration Open',
      contactPhone: '+91 98732 11980',
      coordinator: 'Pooja Sachdeva',
      facilities: ['Doctor Consultation', 'Free Complete Blood Count (CBC)', 'Refreshments Box', 'Priority E-Certificate'],
      description: 'Large-scale voluntary camp catering to Dwarka sub-city residential societies and corporate tech corridors.',
    },
    {
      id: 'camp-5',
      name: 'South Extension Community Blood Drive',
      ngoId: 'ngo-1',
      ngoName: 'Indian Red Cross Society',
      date: '2025-04-24',
      time: '09:00 AM - 02:00 PM',
      address: 'Community Center, Block G, South Extension Part 1',
      city: 'New Delhi',
      area: 'South Extension / South Delhi',
      landmark: 'Near South Extension Metro Gate 2, Ring Road',
      pincode: '110049',
      lat: 28.5729,
      lng: 77.2223,
      bloodGroupsNeeded: ['O-', 'A-', 'B-'],
      totalSeats: 90,
      registeredCount: 34,
      status: 'Registration Open',
      contactPhone: '+91 98110 55443',
      coordinator: 'Meera Nair',
      facilities: ['Free Hemoglobin Test', 'Juices & Fresh Fruits', 'Official Red Cross Certificate'],
      description: 'Focused rare negative Rh group donor collection drive with express sanitized medical stations.',
    },
    {
      id: 'camp-karolbagh-7',
      name: 'Sir Ganga Ram Hospital Rotary Blood Drive',
      ngoId: 'ngo-2',
      ngoName: 'Rotary Blood Bank Delhi',
      date: '2025-04-22',
      time: '09:00 AM - 04:00 PM',
      address: 'Sir Ganga Ram Hospital Marg, Old Rajinder Nagar, Karol Bagh',
      city: 'New Delhi',
      area: 'Karol Bagh / Central Delhi',
      landmark: 'Adjacent to Rajendra Place Metro Station',
      pincode: '110060',
      lat: 28.6385,
      lng: 77.1895,
      bloodGroupsNeeded: ['All Groups', 'O-', 'B+'],
      totalSeats: 160,
      registeredCount: 110,
      status: 'Registration Open',
      contactPhone: '+91 98114 43322',
      coordinator: 'Dr. Pradeep Gupta',
      facilities: ['Platelet Apheresis Unit', 'Certified Pathologists', 'Nutritious Meal Box', 'LifeSaver Lapel Pin'],
      description: 'Hospital blood bank partnership drive collecting whole blood and single donor platelets.',
    },
    {
      id: 'camp-noida-8',
      name: 'Noida Sector 62 IT Corridor Red Cross Camp',
      ngoId: 'ngo-1',
      ngoName: 'Indian Red Cross Society',
      date: '2025-04-25',
      time: '10:00 AM - 05:00 PM',
      address: 'Express Trade Towers 2, Institutional Area, Sector 62',
      city: 'Noida',
      area: 'Sector 62 / Noida NCR',
      landmark: 'Near Fortis Hospital Noida & Noida Electronic City Metro',
      pincode: '201309',
      lat: 28.6258,
      lng: 77.3688,
      bloodGroupsNeeded: ['O+', 'A+', 'B+', 'AB+'],
      totalSeats: 180,
      registeredCount: 154,
      status: 'Almost Full',
      contactPhone: '+91 99105 88990',
      coordinator: 'Rohit Singhania',
      facilities: ['Mobile Donation Bus', 'Express Sanitized Pods', 'Snacks & Juices', 'E-Badge'],
      description: 'Corporate tech-park mega drive bringing mobile blood donation clinics directly to young professionals.',
    },
    {
      id: 'camp-gurgaon-9',
      name: 'Gurgaon Cyber City Medanta LifeForce Drive',
      ngoId: 'ngo-2',
      ngoName: 'Rotary Blood Bank Delhi',
      date: '2025-04-26',
      time: '09:30 AM - 04:30 PM',
      address: 'DLF CyberHub Central Plaza, DLF Phase 2',
      city: 'Gurgaon',
      area: 'Cyber City / Gurgaon NCR',
      landmark: 'Opposite Cyber City Rapid Metro Station',
      pincode: '122002',
      lat: 28.4952,
      lng: 77.0895,
      bloodGroupsNeeded: ['O-', 'A-', 'B-', 'O+'],
      totalSeats: 150,
      registeredCount: 89,
      status: 'Registration Open',
      contactPhone: '+91 98188 66440',
      coordinator: 'Kavita Chhibber',
      facilities: ['Doctor on site', 'Free Lipid & Hb Checkup', 'Cold-pressed Juices', 'Corporate Volunteer Pass'],
      description: 'Annual corporate life-force drive supporting trauma units and emergency pediatric blood transfusions.',
    },
    {
      id: 'camp-ghaziabad-10',
      name: 'Ghaziabad Raj Nagar Rotary Life-Link Camp',
      ngoId: 'ngo-2',
      ngoName: 'Rotary Blood Bank Delhi',
      date: '2025-04-28',
      time: '09:00 AM - 03:00 PM',
      address: 'Rotary Bhawan, Sector 10, Raj Nagar',
      city: 'Ghaziabad',
      area: 'Raj Nagar / Ghaziabad NCR',
      landmark: 'Near Raj Nagar District Center & ALT Center',
      pincode: '201002',
      lat: 28.6833,
      lng: 77.4416,
      bloodGroupsNeeded: ['O+', 'B+', 'AB+'],
      totalSeats: 100,
      registeredCount: 45,
      status: 'Registration Open',
      contactPhone: '+91 98108 55112',
      coordinator: 'Manoj Tyagi',
      facilities: ['Air Conditioned Hall', 'Vitals Check', 'Hot Refreshments', 'Certificate'],
      description: 'Regional community camp supplying blood components to local government dispensaries and maternity homes.',
    },
    {
      id: 'camp-3',
      name: 'Bandra West Corporate Hope Drive',
      ngoId: 'ngo-3',
      ngoName: 'Lions Blood Center Mumbai',
      date: '2025-04-18',
      time: '09:30 AM - 04:30 PM',
      address: 'MMRDA Grounds, Near BKC Connector, Bandra West',
      city: 'Mumbai',
      area: 'Bandra West / BKC',
      landmark: 'Near Bandra Kurla Complex Connector Flyover',
      pincode: '400051',
      lat: 19.0607,
      lng: 72.8362,
      bloodGroupsNeeded: ['O-', 'B-', 'A-', 'O+'],
      totalSeats: 120,
      registeredCount: 62,
      status: 'Registration Open',
      contactPhone: '+91 98200 44112',
      coordinator: 'Sneha Kulkarni',
      facilities: ['Doctors on site', 'Beverages & Snacks', 'Appreciation Medallion'],
      description: 'Annual corporate and youth blood donation initiative supporting local public pediatric hospitals.',
    },
    {
      id: 'camp-dadar-12',
      name: 'Dadar Shivaji Park Citizens Blood Camp',
      ngoId: 'ngo-3',
      ngoName: 'Lions Blood Center Mumbai',
      date: '2025-04-21',
      time: '08:30 AM - 03:00 PM',
      address: 'Swatantryaveer Savarkar Smarak Auditorium, Shivaji Park, Dadar West',
      city: 'Mumbai',
      area: 'Dadar / Central Mumbai',
      landmark: 'Opposite Shivaji Park Beach',
      pincode: '400028',
      lat: 19.0269,
      lng: 72.8375,
      bloodGroupsNeeded: ['All Groups', 'A+', 'B+', 'O+'],
      totalSeats: 150,
      registeredCount: 145,
      status: 'Almost Full',
      contactPhone: '+91 98201 99887',
      coordinator: 'Rajesh Sawant',
      facilities: ['Full Medical Team', 'Nutritious Breakfast', 'Donor Card', 'Free Sugar & BP Check'],
      description: 'Grassroots community drive collecting over 150 units for KEM & Sion Municipal hospitals.',
    },
    {
      id: 'camp-4',
      name: 'Indiranagar Youth Blood Assembly',
      ngoId: 'ngo-4',
      ngoName: 'Sankalp India Foundation',
      date: '2025-04-20',
      time: '10:00 AM - 03:30 PM',
      address: 'Indiranagar Club, 100 Feet Road, HAL 2nd Stage',
      city: 'Bengaluru',
      area: 'Indiranagar / East Bengaluru',
      landmark: 'Near Indiranagar 100 Feet Road Junction',
      pincode: '560038',
      lat: 12.9784,
      lng: 77.6408,
      bloodGroupsNeeded: ['All Groups', 'A+', 'B+', 'O+', 'AB+'],
      totalSeats: 110,
      registeredCount: 88,
      status: 'Registration Open',
      contactPhone: '+91 98450 77331',
      coordinator: 'Arun Kumar',
      facilities: ['Fast Track Donation', 'Doctors on site', 'Nutritional Goody Bag'],
      description: 'Weekend youth drive focusing on rare blood group typing and voluntary registry expansion.',
    },
    {
      id: 'camp-koramangala-14',
      name: 'Koramangala Tech LifeConnect Camp',
      ngoId: 'ngo-4',
      ngoName: 'Sankalp India Foundation',
      date: '2025-04-23',
      time: '09:30 AM - 04:00 PM',
      address: 'Koramangala Indoor Stadium Foyer, 80 Feet Road, 6th Block',
      city: 'Bengaluru',
      area: 'Koramangala / South Bengaluru',
      landmark: 'Near Sony World Signal, Koramangala',
      pincode: '560095',
      lat: 12.9352,
      lng: 77.6245,
      bloodGroupsNeeded: ['O-', 'B-', 'A-', 'O+'],
      totalSeats: 130,
      registeredCount: 71,
      status: 'Registration Open',
      contactPhone: '+91 98452 33110',
      coordinator: 'Deepa Varma',
      facilities: ['State of the Art Medical Pods', 'Free Complete Blood Picture', 'Protein Shakes & Juice', 'Donor Medal'],
      description: 'Dedicated startup and tech workers initiative to eliminate blood shortages in Bengaluru healthcare centers.',
    },
    {
      id: 'camp-pune-15',
      name: 'Pune Shivajinagar Rotary Lifeline Drive',
      ngoId: 'ngo-2',
      ngoName: 'Rotary Blood Bank Delhi',
      date: '2025-04-27',
      time: '09:00 AM - 03:30 PM',
      address: 'Sancheti Healthcare Foyer, Thube Park, Shivajinagar',
      city: 'Pune',
      area: 'Shivajinagar / Central Pune',
      landmark: 'Near Shivajinagar Railway Station',
      pincode: '411005',
      lat: 18.5314,
      lng: 73.8446,
      bloodGroupsNeeded: ['O+', 'B+', 'A+', 'AB+'],
      totalSeats: 120,
      registeredCount: 65,
      status: 'Registration Open',
      contactPhone: '+91 98220 11223',
      coordinator: 'Mahesh Deshmukh',
      facilities: ['Air Conditioned', 'Doctor Consult', 'Snacks & Juices', 'Certificate'],
      description: 'Voluntary blood drive supporting pediatric surgeries and thalassemia patient transfusions.',
    },
    {
      id: 'camp-hyderabad-16',
      name: 'Hyderabad HITEC City Cyber Blood Assembly',
      ngoId: 'ngo-4',
      ngoName: 'Sankalp India Foundation',
      date: '2025-04-29',
      time: '10:00 AM - 05:00 PM',
      address: 'Cyber Towers Courtyard, Hitec City, Madhapur',
      city: 'Hyderabad',
      area: 'HITEC City / Madhapur',
      landmark: 'Next to Hitec City Metro Station',
      pincode: '500081',
      lat: 17.4504,
      lng: 78.3808,
      bloodGroupsNeeded: ['O-', 'A-', 'B-', 'O+', 'B+'],
      totalSeats: 160,
      registeredCount: 112,
      status: 'Registration Open',
      contactPhone: '+91 98490 66778',
      coordinator: 'K. Venkatesh',
      facilities: ['Twin Mobile Donation Coaches', 'Certified Phlebotomists', 'Sandwiches & Real Juice', 'Instant E-Certificate'],
      description: 'Cyberabad corporate camp mobilizing tech workforce for voluntary emergency blood reserve.',
    },
    {
      id: 'camp-kolkata-17',
      name: 'Kolkata Park Street Humanitarian Drive',
      ngoId: 'ngo-1',
      ngoName: 'Indian Red Cross Society',
      date: '2025-04-30',
      time: '09:30 AM - 04:00 PM',
      address: 'St. Xavier’s College Grounds, 30 Mother Teresa Sarani, Park Street',
      city: 'Kolkata',
      area: 'Park Street / Central Kolkata',
      landmark: 'Near Park Street Metro Station',
      pincode: '700016',
      lat: 22.5510,
      lng: 88.3533,
      bloodGroupsNeeded: ['All Groups', 'O+', 'B+', 'A+'],
      totalSeats: 140,
      registeredCount: 82,
      status: 'Registration Open',
      contactPhone: '+91 98301 44556',
      coordinator: 'Anindya Chatterjee',
      facilities: ['Covered Air-Cooled Pavilion', 'Doctor Screening', 'Snacks Pack', 'Donor Medallion'],
      description: 'Flagship city-wide drive supporting Kolkata state blood banks and emergency thalassemia units.',
    }
  ],

  registrations: [
    {
      id: 'REG-2025-8812',
      campId: 'camp-1',
      campName: 'AIIMS Community Mega Blood Drive',
      ngoName: 'Indian Red Cross Society',
      donorName: 'Kirtika Khowal',
      donorPhone: '+91 98765 43210',
      bloodGroup: 'O+',
      date: '2025-04-12',
      timeSlot: '10:30 AM - 11:30 AM',
      location: 'Main Auditorium Foyer, AIIMS Campus, New Delhi',
      status: 'Confirmed',
      registeredAt: '2025-04-01T10:14:00Z',
      instructions: 'Please arrive 15 minutes before your time slot. Have a light meal and stay well hydrated. Carry valid photo ID.',
      reminderSet: true,
    },
    {
      id: 'REG-2025-4190',
      campId: 'camp-2',
      campName: 'Connaught Place LifeSavers Camp',
      ngoName: 'Rotary Blood Bank Delhi',
      donorName: 'Kirtika Khowal',
      donorPhone: '+91 98765 43210',
      bloodGroup: 'O+',
      date: '2025-02-10',
      timeSlot: '11:00 AM - 12:00 PM',
      location: 'Central Park Pavilion, Connaught Place, New Delhi',
      status: 'Completed',
      registeredAt: '2025-02-01T14:30:00Z',
      instructions: 'Donation successfully fulfilled on 10 Feb 2025. Units processed for pediatric care.',
      reminderSet: false,
    }
  ],

  homeCollections: [
    {
      id: 'HC-2025-108',
      donorName: 'Kirtika Khowal',
      phone: '+91 98765 43210',
      bloodGroup: 'O+',
      address: 'Flat 402, Sunshine Apartments, Sector 14, Rohini, Delhi',
      preferredDate: '2025-04-19',
      preferredTime: '10:00 AM - 12:00 PM',
      reason: 'Senior family elder care at home; unable to leave for 6 hours',
      notes: 'Please buzz building intercom 402 on arrival.',
      status: 'Scheduled',
      assignedTeam: 'Red Cross Mobile Unit #3',
      requestedAt: '2025-04-02T11:20:00Z',
      ngoName: 'Indian Red Cross Society',
    }
  ],

  bloodRequests: [
    {
      id: 'REQ-901',
      bloodGroup: 'O-',
      urgency: 'Critical',
      hospitalName: 'Safdarjung Hospital Trauma Center',
      city: 'New Delhi',
      unitsNeeded: 3,
      unitsFulfilled: 1,
      dateNeeded: '2025-04-14',
      patientCase: 'Emergency Multiple Trauma Case #8492',
      contactCoordinator: 'Hospital Blood Bank Liaison Officer',
      contactPhone: '+91 11 2616 5000 (Ext 412)',
      verificationStatus: 'Verified by SafeBlood Network',
      description: 'Immediate requirement for rare O- units for emergency emergency operation. Donors with O- group requested to coordinate.',
    },
    {
      id: 'REQ-902',
      bloodGroup: 'B-',
      urgency: 'Urgent',
      hospitalName: 'Tata Memorial Hospital',
      city: 'Mumbai',
      unitsNeeded: 4,
      unitsFulfilled: 2,
      dateNeeded: '2025-04-16',
      patientCase: 'Pediatric Oncology Chemotherapy Support',
      contactCoordinator: 'Lions Blood Bank Coordinator',
      contactPhone: '+91 22 2417 7000',
      verificationStatus: 'Verified by Tata Memorial Medical Board',
      description: 'Platelet and whole blood requirement for ongoing acute leukemia care.',
    },
    {
      id: 'REQ-903',
      bloodGroup: 'AB-',
      urgency: 'Moderate',
      hospitalName: 'Manipal Hospital HAL Airport Road',
      city: 'Bengaluru',
      unitsNeeded: 2,
      unitsFulfilled: 0,
      dateNeeded: '2025-04-18',
      patientCase: 'Cardiovascular Surgery Standby',
      contactCoordinator: 'Sankalp Medical Liaison',
      contactPhone: '+91 80 2502 4444',
      verificationStatus: 'Verified Hospital Standby',
      description: 'Standby requirement for planned bypass surgery scheduled for Thursday morning.',
    }
  ],

  contributions: [
    {
      id: 'TXN-2025-9941',
      donorName: 'Kirtika Khowal',
      ngoId: 'ngo-1',
      ngoName: 'Indian Red Cross Society',
      amount: 1200,
      paymentMethod: 'UPI / GooglePay',
      date: '2025-03-22',
      status: 'Success',
      taxExempt80G: '80G/DEL/2021/AAATR1234F',
      receiptUrl: '#',
      pointsEarned: 600,
    }
  ],

  rewards: [
    {
      id: 'rew-1',
      title: 'Apollo Pharmacy Health Voucher',
      pointsRequired: 400,
      category: 'Health & Wellness',
      value: '₹250 Voucher',
      partner: 'Apollo Pharmacy',
      expiryDays: 90,
      icon: 'HeartHandshake',
      availableCount: 45,
    },
    {
      id: 'rew-2',
      title: 'Cult.fit 1-Month Fitness Pass',
      pointsRequired: 750,
      category: 'Fitness',
      value: 'Free 30-Day Pass',
      partner: 'Cult.fit',
      expiryDays: 60,
      icon: 'Activity',
      availableCount: 20,
    },
    {
      id: 'rew-3',
      title: 'Red Cross Life Saver Pin & Medallion',
      pointsRequired: 1000,
      category: 'Recognition',
      value: 'Exclusive Physical Honor',
      partner: 'Indian Red Cross',
      expiryDays: 365,
      icon: 'Award',
      availableCount: 15,
    },
    {
      id: 'rew-4',
      title: 'BookMyShow Movie Voucher',
      pointsRequired: 500,
      category: 'Entertainment',
      value: '₹300 Voucher',
      partner: 'BookMyShow',
      expiryDays: 45,
      icon: 'Ticket',
      availableCount: 30,
    }
  ],

  redeemedRewards: [
    {
      id: 'RED-401',
      rewardTitle: 'Apollo Pharmacy Health Voucher',
      pointsSpent: 400,
      code: 'APOLLO-BC-8921',
      redeemedAt: '2025-02-15',
      status: 'Active',
    }
  ],

  certificates: [
    {
      id: 'BC-CERT-2025-0104',
      donorName: 'Kirtika Khowal',
      campName: 'Connaught Place LifeSavers Camp',
      ngoName: 'Rotary Blood Bank Delhi',
      donationDate: '2025-02-10',
      bloodGroup: 'O+',
      unitsDonated: 1,
      certificateHash: 'sha256-e9b4d8c7a6f5e4d3c2b1a0f9e8d7c6b5a4',
      verified: true,
    }
  ],

  notifications: [
    {
      id: 'notif-1',
      title: 'Upcoming Blood Drive in 48 Hours',
      message: 'Your registration for AIIMS Community Mega Blood Drive is confirmed for Saturday, 10:30 AM.',
      type: 'registration',
      time: '2 hours ago',
      read: false,
      actionLink: 'registrations',
    },
    {
      id: 'notif-2',
      title: 'Urgent Blood Need: O- Group in New Delhi',
      message: 'Safdarjung Hospital has posted a critical requirement for O- blood units.',
      type: 'urgent',
      time: '5 hours ago',
      read: false,
      actionLink: 'blood-needs',
    },
    {
      id: 'notif-3',
      title: 'Reward Points Credited',
      message: 'You earned 600 points for your financial contribution to Indian Red Cross Society.',
      type: 'reward',
      time: '3 days ago',
      read: true,
      actionLink: 'rewards',
    }
  ],

  userProfile: {
    name: 'Kirtika Khowal',
    phone: '+91 98765 43210',
    email: 'kirtika.khowal@example.com',
    bloodGroup: 'O+',
    city: 'New Delhi',
    totalDonations: 4,
    lastDonationDate: '2025-02-10',
    rewardPoints: 850,
    currentLevel: 'Life Saver Level 3',
    nextMilestonePoints: 1000,
    eligibilityStatus: 'Eligible', // 'Eligible' | 'Wait Period (X days)'
    daysUntilNextEligible: 0,
  }
};

// ── State Management Helper ──
class DataService {
  constructor() {
    this.listeners = new Set();
    this.data = this.loadData();
    this.activeRole = this.loadRole(); // 'donor' | 'ngo' | 'admin'
    this.authSession = this.loadSession();
  }

  loadSession() {
    try {
      const s = localStorage.getItem(AUTH_KEY);
      if (s) return JSON.parse(s);
    } catch (e) {}
    return null;
  }

  isAuthenticated() {
    return Boolean(this.authSession && this.authSession.token);
  }

  getSession() {
    return this.authSession;
  }

  login({ email, role = 'donor', name = 'Kirtika Khowal' }) {
    this.authSession = {
      token: `token-${Date.now()}`,
      email: email || 'kirtika.khowal@example.com',
      role: role || 'donor',
      name: name || 'Kirtika Khowal',
      loggedInAt: new Date().toISOString(),
    };
    this.activeRole = role || 'donor';
    localStorage.setItem(AUTH_KEY, JSON.stringify(this.authSession));
    localStorage.setItem(USER_KEY, this.activeRole);
    this.notify();
    return this.authSession;
  }

  logout() {
    this.authSession = null;
    localStorage.removeItem(AUTH_KEY);
    this.notify();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.camps)) {
          const existingIds = new Set(parsed.camps.map(c => c.id));
          const missingCamps = INITIAL_DATA.camps.filter(c => !existingIds.has(c.id));
          if (missingCamps.length > 0) {
            parsed.camps = [...INITIAL_DATA.camps];
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed)); } catch (e) {}
          }
        } else {
          parsed.camps = INITIAL_DATA.camps;
        }
        if (parsed.userProfile && (parsed.userProfile.name === 'Anubhav Thakur' || !parsed.userProfile.name)) {
          parsed.userProfile.name = 'Kirtika Khowal';
          parsed.userProfile.email = 'kirtika.khowal@example.com';
        }
        if (Array.isArray(parsed.registrations)) {
          parsed.registrations.forEach(r => {
            if (r.donorName === 'Anubhav Thakur') r.donorName = 'Kirtika Khowal';
          });
        }
        if (Array.isArray(parsed.homeCollections)) {
          parsed.homeCollections.forEach(h => {
            if (h.donorName === 'Anubhav Thakur') h.donorName = 'Kirtika Khowal';
          });
        }
        return parsed;
      }

      // Check migration from previous v2 state
      const oldV2 = localStorage.getItem('bloodconnect_platform_data_v2');
      if (oldV2) {
        try {
          const parsedV2 = JSON.parse(oldV2);
          const merged = {
            ...INITIAL_DATA,
            ...parsedV2,
            camps: INITIAL_DATA.camps,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        } catch (e) {}
      }
    } catch (e) {
      console.warn('Could not read BloodConnect state from localStorage:', e);
    }
    return INITIAL_DATA;
  }

  loadRole() {
    try {
      const role = localStorage.getItem(USER_KEY);
      if (role && ['donor', 'ngo', 'admin'].includes(role)) {
        return role;
      }
    } catch (e) {}
    return 'donor';
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    this.notify();
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(this.data, this.activeRole); } catch (err) { console.error(err); }
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.data, this.activeRole);
    return () => this.listeners.delete(callback);
  }

  // ── Role Management ──
  getRole() {
    return this.activeRole;
  }

  setRole(role) {
    if (['donor', 'ngo', 'admin'].includes(role)) {
      this.activeRole = role;
      localStorage.setItem(USER_KEY, role);
      this.notify();
    }
  }

  // ── Stats Summary ──
  getDonorStats() {
    const profile = this.data.userProfile;
    const completedRegs = this.data.registrations.filter(r => r.status === 'Completed').length;
    const upcomingRegs = this.data.registrations.filter(r => r.status === 'Confirmed' || r.status === 'Pending').length;
    const totalContributed = this.data.contributions
      .filter(c => c.status === 'Success')
      .reduce((sum, c) => sum + Number(c.amount || 0), 0);

    return {
      totalDonations: profile.totalDonations || completedRegs,
      upcomingCampaigns: upcomingRegs,
      totalContribution: `₹${totalContributed.toLocaleString('en-IN')}`,
      rewardPoints: profile.rewardPoints,
      currentLevel: profile.currentLevel,
      nextMilestone: profile.nextMilestonePoints,
      eligibilityStatus: profile.eligibilityStatus,
      daysUntilNextEligible: profile.daysUntilNextEligible,
      bloodGroup: profile.bloodGroup,
    };
  }

  getNgoStats() {
    const ngoCamps = this.data.camps;
    const allRegs = this.data.registrations;
    const allHcs = this.data.homeCollections;
    const allContribs = this.data.contributions;

    const totalRegistrations = allRegs.length;
    const completedDonations = allRegs.filter(r => r.status === 'Completed').length;
    const pendingHomeRequests = allHcs.filter(h => h.status === 'Requested' || h.status === 'Scheduled').length;
    const totalFunds = allContribs.reduce((sum, c) => sum + Number(c.amount || 0), 0);

    return {
      activeCampaigns: ngoCamps.filter(c => c.status !== 'Completed').length,
      totalCampaigns: ngoCamps.length,
      totalRegistrations,
      completedDonations,
      pendingHomeRequests,
      donorReach: 1240 + totalRegistrations * 12,
      fundsRaised: `₹${totalFunds.toLocaleString('en-IN')}`,
    };
  }

  // ── Camps ──
  getCamps(filters = {}) {
    let list = [...this.data.camps];
    if (filters.city && filters.city !== 'All') {
      list = list.filter(c => c.city.toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.bloodGroup && filters.bloodGroup !== 'All') {
      list = list.filter(c => 
        c.bloodGroupsNeeded.includes('All Groups') || 
        c.bloodGroupsNeeded.includes(filters.bloodGroup)
      );
    }
    if (filters.status && filters.status !== 'All') {
      list = list.filter(c => c.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.address.toLowerCase().includes(q) ||
        c.ngoName.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getCampById(id) {
    return this.data.camps.find(c => c.id === id);
  }

  createCampaign(campData) {
    const newCamp = {
      id: `camp-${Date.now()}`,
      registeredCount: 0,
      status: 'Registration Open',
      facilities: ['Free Health Checkup', 'Refreshments Provided', 'Donor Certificate'],
      ...campData,
    };
    this.data.camps.unshift(newCamp);
    
    // Add announcement notification
    this.addNotification({
      title: `New Campaign: ${newCamp.name}`,
      message: `Organized by ${newCamp.ngoName} in ${newCamp.city} on ${newCamp.date}. Registration is now open!`,
      type: 'campaign',
      actionLink: 'campaigns',
    });

    this.save();
    return newCamp;
  }

  cancelCampaign(id) {
    const camp = this.data.camps.find(c => c.id === id);
    if (camp) {
      camp.status = 'Cancelled';
      this.save();
    }
  }

  // ── Registrations ──
  getRegistrations() {
    return [...this.data.registrations];
  }

  registerForCamp({ campId, donorName, donorPhone, bloodGroup, preferredDate, timeSlot }) {
    const camp = this.getCampById(campId);
    if (!camp) throw new Error('Camp not found');

    const regId = `REG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReg = {
      id: regId,
      campId,
      campName: camp.name,
      ngoName: camp.ngoName,
      donorName: donorName || this.data.userProfile.name,
      donorPhone: donorPhone || this.data.userProfile.phone,
      bloodGroup: bloodGroup || this.data.userProfile.bloodGroup,
      date: preferredDate || camp.date,
      timeSlot: timeSlot || '10:00 AM - 11:00 AM',
      location: camp.address,
      status: 'Confirmed',
      registeredAt: new Date().toISOString(),
      instructions: 'Please arrive 10-15 minutes before your time slot. Have a healthy meal, stay well hydrated, and bring valid government photo ID.',
      reminderSet: true,
    };

    // Update camp count
    camp.registeredCount = (camp.registeredCount || 0) + 1;
    if (camp.registeredCount >= camp.totalSeats) {
      camp.status = 'Full';
    } else if (camp.registeredCount >= camp.totalSeats * 0.85) {
      camp.status = 'Almost Full';
    }

    // Award +100 Points for Registration
    this.data.userProfile.rewardPoints += 100;

    // Add to registrations list
    this.data.registrations.unshift(newReg);

    // Trigger Notification
    this.addNotification({
      title: 'Camp Registration Confirmed! 🩸',
      message: `You are confirmed for ${camp.name} on ${newReg.date} (${newReg.timeSlot}). Reference: ${regId}. +100 Points earned!`,
      type: 'registration',
      actionLink: 'registrations',
    });

    this.save();
    return newReg;
  }

  cancelRegistration(id) {
    const reg = this.data.registrations.find(r => r.id === id);
    if (reg) {
      reg.status = 'Cancelled';
      const camp = this.getCampById(reg.campId);
      if (camp && camp.registeredCount > 0) {
        camp.registeredCount -= 1;
        if (camp.status === 'Full') camp.status = 'Almost Full';
      }
      this.addNotification({
        title: 'Registration Cancelled',
        message: `Your booking for ${reg.campName} (${reg.id}) has been cancelled.`,
        type: 'registration',
        actionLink: 'registrations',
      });
      this.save();
    }
  }

  completeRegistration(id) {
    const reg = this.data.registrations.find(r => r.id === id);
    if (reg && reg.status !== 'Completed') {
      reg.status = 'Completed';
      
      // Award donation milestone
      this.data.userProfile.totalDonations = (this.data.userProfile.totalDonations || 0) + 1;
      this.data.userProfile.rewardPoints += 250;
      this.data.userProfile.lastDonationDate = new Date().toISOString().split('T')[0];

      // Issue Certificate
      const certId = `BC-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      this.data.certificates.unshift({
        id: certId,
        donorName: reg.donorName,
        campName: reg.campName,
        ngoName: reg.ngoName,
        donationDate: reg.date,
        bloodGroup: reg.bloodGroup,
        unitsDonated: 1,
        certificateHash: `sha256-${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
        verified: true,
      });

      this.addNotification({
        title: 'Donation Completed! Life Saver ✦',
        message: `Thank you for saving lives at ${reg.campName}! +250 Points awarded & your official Certificate is ready to download.`,
        type: 'certificate',
        actionLink: 'certificates',
      });

      this.save();
    }
  }

  // ── Home Collections ──
  getHomeCollections() {
    return [...this.data.homeCollections];
  }

  requestHomeCollection(reqData) {
    const id = `HC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newRequest = {
      id,
      donorName: reqData.donorName || this.data.userProfile.name,
      phone: reqData.phone || this.data.userProfile.phone,
      bloodGroup: reqData.bloodGroup || this.data.userProfile.bloodGroup,
      address: reqData.address,
      preferredDate: reqData.preferredDate,
      preferredTime: reqData.preferredTime,
      reason: reqData.reason || 'General voluntary home donation request',
      notes: reqData.notes || '',
      status: 'Requested',
      assignedTeam: 'Pending Team Allocation',
      requestedAt: new Date().toISOString(),
      ngoName: reqData.ngoName || 'Indian Red Cross Society',
    };

    this.data.homeCollections.unshift(newRequest);

    this.addNotification({
      title: 'Home Collection Requested',
      message: `Your request (${id}) has been submitted to ${newRequest.ngoName}. Our medical team will review availability and contact you shortly.`,
      type: 'home-collection',
      actionLink: 'home-collection',
    });

    this.save();
    return newRequest;
  }

  updateHomeCollectionStatus(id, newStatus, assignedTeam) {
    const req = this.data.homeCollections.find(h => h.id === id);
    if (req) {
      req.status = newStatus;
      if (assignedTeam) req.assignedTeam = assignedTeam;
      
      if (newStatus === 'Completed') {
        this.data.userProfile.totalDonations = (this.data.userProfile.totalDonations || 0) + 1;
        this.data.userProfile.rewardPoints += 250;
      }

      this.addNotification({
        title: `Home Collection Update: ${newStatus}`,
        message: `Your home collection request (${id}) status is now "${newStatus}".`,
        type: 'home-collection',
        actionLink: 'home-collection',
      });

      this.save();
    }
  }

  // ── Blood Needs / Urgent Hospital Requests ──
  getBloodRequests() {
    return [...this.data.bloodRequests];
  }

  createBloodRequest(requestData) {
    const newReq = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      unitsFulfilled: 0,
      verificationStatus: 'Verified by Medical Authority',
      ...requestData,
    };
    this.data.bloodRequests.unshift(newReq);

    this.addNotification({
      title: `Urgent Blood Need: ${newReq.bloodGroup} in ${newReq.city}`,
      message: `${newReq.hospitalName} requires ${newReq.unitsNeeded} units of ${newReq.bloodGroup} blood urgently.`,
      type: 'urgent',
      actionLink: 'blood-needs',
    });

    this.save();
    return newReq;
  }

  // ── Financial Contributions ──
  getContributions() {
    return [...this.data.contributions];
  }

  createContribution({ ngoId, amount, paymentMethod = 'UPI' }) {
    const ngo = this.data.ngos.find(n => n.id === ngoId) || this.data.ngos[0];
    const txnId = `TXN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const pointsEarned = Math.floor(Number(amount) * 0.5); // 50 points per ₹100

    const record = {
      id: txnId,
      donorName: this.data.userProfile.name,
      ngoId: ngo.id,
      ngoName: ngo.name,
      amount: Number(amount),
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
      status: 'Success',
      taxExempt80G: `80G/DEL/2025/${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      receiptUrl: '#',
      pointsEarned,
    };

    this.data.contributions.unshift(record);
    this.data.userProfile.rewardPoints += pointsEarned;

    this.addNotification({
      title: 'Thank You for Supporting Life! ❤️',
      message: `Contribution of ₹${amount} to ${ngo.name} was successful. +${pointsEarned} reward points added. 80G receipt available!`,
      type: 'reward',
      actionLink: 'contribute',
    });

    this.save();
    return record;
  }

  // ── Rewards & Points ──
  getRewards() {
    return [...this.data.rewards];
  }

  getRedeemedRewards() {
    return [...this.data.redeemedRewards];
  }

  redeemReward(rewardId) {
    const reward = this.data.rewards.find(r => r.id === rewardId);
    if (!reward) throw new Error('Reward not found');

    if (this.data.userProfile.rewardPoints < reward.pointsRequired) {
      throw new Error(`Insufficient points. You need ${reward.pointsRequired} points, but have ${this.data.userProfile.rewardPoints}.`);
    }

    this.data.userProfile.rewardPoints -= reward.pointsRequired;
    const redeemId = `RED-${Math.floor(1000 + Math.random() * 9000)}`;
    const code = `${reward.partner.substring(0, 4).toUpperCase()}-BC-${Math.floor(1000 + Math.random() * 9000)}`;

    const redemption = {
      id: redeemId,
      rewardTitle: reward.title,
      pointsSpent: reward.pointsRequired,
      code,
      redeemedAt: new Date().toISOString().split('T')[0],
      status: 'Active',
    };

    this.data.redeemedRewards.unshift(redemption);

    this.addNotification({
      title: 'Reward Redeemed! 🎉',
      message: `You redeemed "${reward.title}". Coupon code: ${code}. Enjoy your reward!`,
      type: 'reward',
      actionLink: 'rewards',
    });

    this.save();
    return redemption;
  }

  // ── Certificates ──
  getCertificates() {
    return [...this.data.certificates];
  }

  // ── Notifications ──
  getNotifications() {
    return [...this.data.notifications];
  }

  addNotification({ title, message, type = 'general', actionLink = 'notifications' }) {
    const notif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      time: 'Just now',
      read: false,
      actionLink,
    };
    this.data.notifications.unshift(notif);
    this.save();
  }

  markNotificationRead(id) {
    const n = this.data.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.save();
    }
  }

  markAllNotificationsRead() {
    this.data.notifications.forEach(n => n.read = true);
    this.save();
  }

  // ── Profile ──
  getUserProfile() {
    return { ...this.data.userProfile };
  }

  updateUserProfile(updatedFields) {
    this.data.userProfile = { ...this.data.userProfile, ...updatedFields };
    this.save();
    return this.data.userProfile;
  }

  // ── NGOs ──
  getNgos() {
    return [...this.data.ngos];
  }

  // Reset to seed data
  resetAllData() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.save();
  }
}

// Singleton Instance
export const dataService = new DataService();
