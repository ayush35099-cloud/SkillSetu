/**
 * Complete list of all 28 Indian States and 8 Union Territories
 * plus a National / All India option.
 * Maintained independently from language preferences.
 */

export const INDIAN_REGIONS = [
  {
    code: 'IN-ALL',
    name: 'All India (National)',
    nativeName: 'अखिल भारतीय / National',
    category: 'National',
    capital: 'New Delhi',
    primaryHubs: ['National Projects', 'Interstate Contracts'],
    zone: 'National'
  },
  // 28 States
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    nativeName: 'ఆంధ్రప్రదేశ్',
    category: 'State',
    capital: 'Amaravati',
    primaryHubs: ['Visakhapatnam', 'Vijayawada', 'Guntur'],
    zone: 'South'
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh',
    nativeName: 'Arunachal Pradesh',
    category: 'State',
    capital: 'Itanagar',
    primaryHubs: ['Itanagar', 'Naharlagun', 'Pasighat'],
    zone: 'Northeast'
  },
  {
    code: 'AS',
    name: 'Assam',
    nativeName: 'অসম',
    category: 'State',
    capital: 'Dispur',
    primaryHubs: ['Guwahati', 'Silchar', 'Dibrugarh'],
    zone: 'Northeast'
  },
  {
    code: 'BR',
    name: 'Bihar',
    nativeName: 'बिहार',
    category: 'State',
    capital: 'Patna',
    primaryHubs: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
    zone: 'East'
  },
  {
    code: 'CG',
    name: 'Chhattisgarh',
    nativeName: 'छत्तीसगढ़',
    category: 'State',
    capital: 'Raipur',
    primaryHubs: ['Raipur', 'Bhilai', 'Bilaspur'],
    zone: 'Central'
  },
  {
    code: 'GA',
    name: 'Goa',
    nativeName: 'गोंय / Goa',
    category: 'State',
    capital: 'Panaji',
    primaryHubs: ['Panaji', 'Margao', 'Vasco da Gama'],
    zone: 'West'
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    nativeName: 'ગુજરાત',
    category: 'State',
    capital: 'Gandhinagar',
    primaryHubs: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    zone: 'West'
  },
  {
    code: 'HR',
    name: 'Haryana',
    nativeName: 'हरियाणा',
    category: 'State',
    capital: 'Chandigarh',
    primaryHubs: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala'],
    zone: 'North'
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    nativeName: 'हिमाचल प्रदेश',
    category: 'State',
    capital: 'Shimla',
    primaryHubs: ['Shimla', 'Dharamshala', 'Solan', 'Mandi'],
    zone: 'North'
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    nativeName: 'झारखण्ड',
    category: 'State',
    capital: 'Ranchi',
    primaryHubs: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
    zone: 'East'
  },
  {
    code: 'KA',
    name: 'Karnataka',
    nativeName: 'ಕರ್ನಾಟಕ',
    category: 'State',
    capital: 'Bengaluru',
    primaryHubs: ['Bengaluru', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru'],
    zone: 'South'
  },
  {
    code: 'KL',
    name: 'Kerala',
    nativeName: 'കേരളം',
    category: 'State',
    capital: 'Thiruvananthapuram',
    primaryHubs: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
    zone: 'South'
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    nativeName: 'मध्य प्रदेश',
    category: 'State',
    capital: 'Bhopal',
    primaryHubs: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior'],
    zone: 'Central'
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    nativeName: 'महाराष्ट्र',
    category: 'State',
    capital: 'Mumbai',
    primaryHubs: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'],
    zone: 'West'
  },
  {
    code: 'MN',
    name: 'Manipur',
    nativeName: 'মণিপুর',
    category: 'State',
    capital: 'Imphal',
    primaryHubs: ['Imphal', 'Churachandpur', 'Thoubal'],
    zone: 'Northeast'
  },
  {
    code: 'ML',
    name: 'Meghalaya',
    nativeName: 'Meghalaya',
    category: 'State',
    capital: 'Shillong',
    primaryHubs: ['Shillong', 'Tura', 'Jowai'],
    zone: 'Northeast'
  },
  {
    code: 'MZ',
    name: 'Mizoram',
    nativeName: 'Mizoram',
    category: 'State',
    capital: 'Aizawl',
    primaryHubs: ['Aizawl', 'Lunglei', 'Champhai'],
    zone: 'Northeast'
  },
  {
    code: 'NL',
    name: 'Nagaland',
    nativeName: 'Nagaland',
    category: 'State',
    capital: 'Kohima',
    primaryHubs: ['Dimapur', 'Kohima', 'Mokokchung'],
    zone: 'Northeast'
  },
  {
    code: 'OD',
    name: 'Odisha',
    nativeName: 'ଓଡ଼ିଶା',
    category: 'State',
    capital: 'Bhubaneswar',
    primaryHubs: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri'],
    zone: 'East'
  },
  {
    code: 'PB',
    name: 'Punjab',
    nativeName: 'ਪੰਜਾਬ',
    category: 'State',
    capital: 'Chandigarh',
    primaryHubs: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    zone: 'North'
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    nativeName: 'राजस्थान',
    category: 'State',
    capital: 'Jaipur',
    primaryHubs: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur'],
    zone: 'North'
  },
  {
    code: 'SK',
    name: 'Sikkim',
    nativeName: 'सिक्किम',
    category: 'State',
    capital: 'Gangtok',
    primaryHubs: ['Gangtok', 'Namchi', 'Geyzing'],
    zone: 'Northeast'
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    nativeName: 'தமிழ்நாடு',
    category: 'State',
    capital: 'Chennai',
    primaryHubs: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
    zone: 'South'
  },
  {
    code: 'TS',
    name: 'Telangana',
    nativeName: 'తెలంగాణ',
    category: 'State',
    capital: 'Hyderabad',
    primaryHubs: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
    zone: 'South'
  },
  {
    code: 'TR',
    name: 'Tripura',
    nativeName: 'ত্রিপুরা',
    category: 'State',
    capital: 'Agartala',
    primaryHubs: ['Agartala', 'Udaipur', 'Dharmanagar'],
    zone: 'Northeast'
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    nativeName: 'उत्तर प्रदेश',
    category: 'State',
    capital: 'Lucknow',
    primaryHubs: ['Lucknow', 'Kanpur', 'Noida', 'Varanasi', 'Agra'],
    zone: 'North'
  },
  {
    code: 'UK',
    name: 'Uttarakhand',
    nativeName: 'उत्तराखण्ड',
    category: 'State',
    capital: 'Dehradun',
    primaryHubs: ['Dehradun', 'Haridwar', 'Haldwani', 'Roorkee'],
    zone: 'North'
  },
  {
    code: 'WB',
    name: 'West Bengal',
    nativeName: 'পশ্চিমবঙ্গ',
    category: 'State',
    capital: 'Kolkata',
    primaryHubs: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
    zone: 'East'
  },

  // 8 Union Territories
  {
    code: 'AN',
    name: 'Andaman and Nicobar Islands',
    nativeName: 'Andaman & Nicobar',
    category: 'Union Territory',
    capital: 'Port Blair',
    primaryHubs: ['Port Blair'],
    zone: 'South'
  },
  {
    code: 'CH',
    name: 'Chandigarh',
    nativeName: 'चंडीगढ़ / ਚੰਡੀਗੜ੍ਹ',
    category: 'Union Territory',
    capital: 'Chandigarh',
    primaryHubs: ['Chandigarh Urban Area'],
    zone: 'North'
  },
  {
    code: 'DN',
    name: 'Dadra & Nagar Haveli and Daman & Diu',
    nativeName: 'Dadra & Nagar Haveli and Daman & Diu',
    category: 'Union Territory',
    capital: 'Daman',
    primaryHubs: ['Daman', 'Silvassa', 'Diu'],
    zone: 'West'
  },
  {
    code: 'DL',
    name: 'Delhi (NCT)',
    nativeName: 'दिल्ली / Delhi',
    category: 'Union Territory',
    capital: 'New Delhi',
    primaryHubs: ['New Delhi', 'Central Delhi', 'South Delhi', 'Dwarka'],
    zone: 'North'
  },
  {
    code: 'JK',
    name: 'Jammu and Kashmir',
    nativeName: 'जम्मू और कश्मीर',
    category: 'Union Territory',
    capital: 'Srinagar / Jammu',
    primaryHubs: ['Srinagar', 'Jammu', 'Anantnag'],
    zone: 'North'
  },
  {
    code: 'LA',
    name: 'Ladakh',
    nativeName: 'लादाख़ / ལ་དྭགས',
    category: 'Union Territory',
    capital: 'Leh',
    primaryHubs: ['Leh', 'Kargil'],
    zone: 'North'
  },
  {
    code: 'LD',
    name: 'Lakshadweep',
    nativeName: 'ലക്ഷദ്വീപ്',
    category: 'Union Territory',
    capital: 'Kavaratti',
    primaryHubs: ['Kavaratti', 'Agatti'],
    zone: 'South'
  },
  {
    code: 'PY',
    name: 'Puducherry',
    nativeName: 'பாண்டிச்சேரி',
    category: 'Union Territory',
    capital: 'Puducherry',
    primaryHubs: ['Puducherry', 'Karaikal', 'Mahe'],
    zone: 'South'
  }
];

export const DEFAULT_REGION = 'IN-ALL'; // Default: All India (National)
