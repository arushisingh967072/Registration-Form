interface CountryData {
  [country: string]: {
    __countryCode?: string;
    [state: string]: string[] | string;
  };
}

export const countryData: CountryData = {
  'United States': {
    __countryCode: '+1',
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
    'Illinois': ['Chicago', 'Springfield', 'Naperville', 'Peoria'],
  },
  'United Kingdom': {
    __countryCode: '+44',
    'England': ['London', 'Manchester', 'Birmingham', 'Liverpool'],
    'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'],
    'Wales': ['Cardiff', 'Swansea', 'Newport', 'Wrexham'],
    'Northern Ireland': ['Belfast', 'Derry', 'Lisburn', 'Newry'],
  },
  'Canada': {
    __countryCode: '+1',
    'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton'],
    'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau'],
    'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby'],
    'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'],
  },
  'Australia': {
    __countryCode: '+61',
    'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Parramatta'],
    'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'],
    'Queensland': ['Brisbane', 'Gold Coast', 'Townsville', 'Cairns'],
    'Western Australia': ['Perth', 'Fremantle', 'Mandurah', 'Bunbury'],
  },
  'India': {
    __countryCode: '+91',
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane'],
    'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
    'Delhi': ['New Delhi', 'Delhi Cantonment', 'Narela', 'Rohini'],
  },
};
