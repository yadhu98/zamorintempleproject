import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import zLogo from './images/ZamorinLogo-removebg-preview.png'
import LocImage from './images/locIcon.png';
import Member1 from './images/Person1.jpg'
import Manager from './images/Manager.jpg'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Slideshow from './ImageSlider';
import data from './templeData.json'
import TripPlannerModal from './TripPlannerModal';
import InfoManual from './InfoManual';
import TempleDetailsModal from './TempleDetailsModal';


// const data = [
//   {
//     district: 'Kozhikode',
//     temples: [
//       {
//         name: 'Sree Tali Devaswom (Siva & Krishna)',
//         details: 'Address: Tali, Kozhikode-2, Contact: 0495 2703610',
//         coordinates: { lat: 11.248147944046364, lng: 75.787605411904 },
//         slides : [
//           'https://www.citybit.in/wp-content/uploads/2023/10/Tali-Shiva-Temple.jpg',
//           'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/22/cb/17/inside-tali-temple.jpg?w=700&h=400&s=1',
//           'https://www.shutterstock.com/image-photo/hindu-temple-tali-shiva-known-600w-2430677279.jpg'
//         ]
//       },
//       {
//         name: 'Sree Ramaswami Temple, (Sreerama)',
//         details: 'Address: Tali Devaswom, Tali, Kozhikode-2, Contact: 0495 2703610',
//         coordinates: { lat: 11.248832823384667, lng: 75.78693262786435 },
//         slides : [
//           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF7Jkm_r4VFyz9rsy20YP9ojMq7So_ZbEJAA&s',
//           'https://content3.jdmagicbox.com/comp/kozhikode/j6/0495px495.x495.220319002104.v8j6/catalogue/tali-temple-pond-vadakara-beach-kozhikode-temples-GU8KwBGM8i.jpg',
//         ]
//       },
//       {
//         name: 'Sree Valayanad Devaswom, (Devi)',
//         details: 'Address: P.O. Kommeri, Kozhikode - 7, Contact: 0495 2741083',
//         coordinates: { lat: 11.24397061799881, lng: 75.80394439470938 },
//         slides : [
//           'https://media.holidify.com/images/cmsuploads/compressed/gallery-images-03-1_20241203173837.jpg',
//           'https://s3.ap-south-1.amazonaws.com/esapp/evmpic/1548926275184.jpg',
//           'https://media1.thrillophilia.com/filestore/ycip9bow7p7ei8a0q8hv3r5rjy3t_gallery-images-07.jpg?w=400&dpr=2'
//         ]
//       },
//     ]
//   },
//   {
//     district: 'Malappuram',
//     temples: [
//       {
//         name: 'Sree Thirunavaya Devaswom, (Navamukundan),',
//         details: 'Address: P.O. Thirunavaya, Tirur,Malappuram Contact: 0494 2603747)',
//         coordinates: { lat: 10.863878637593611, lng: 75.98167325237682 },
//         slides : [
//           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPxbK3zXCsFWjxXeUnv3BgVXBh67n8AJcUYw&s',
//           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFYSTZ-uazKHQiodIHHPkSb9aRxHbkj4yCag&s',
//           'https://i.ytimg.com/vi/52qkqyAXaBI/maxresdefault.jpg'
//         ]
//       },
//       {
//         name: 'Sree Thriprangode Devaswom, (Siva),',
//         details: 'Address: P.O. Thriprangode, Tirur, Malappuram, Contact: 0494 2566046',
//         coordinates: { lat: 10.855840083961287, lng: 75.94775633888423 },
//         slides : [
//           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm3t4JrQCeWbPq_tqxmGYa0-E5yIJ-q8pmLA&s',
//           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNG_xYJsY_TGUKhfg6Cz326tNdE6Z9lVjleg&s',
//           'https://lightuptemples.com/wp-content/uploads/temple/profile_image/malappuram-sri-triprangode-shiva-temple-kerala.jpg'
//         ]
//       },
//       {
//         name: 'Sree Alathiyur Perumthrikovil Devaswom (Hanuman kavu), (Sreerama),',
//         details: 'Address: P.O. Poyilisseri, Tirur, Malappuram., Contact: 0494 2430666',
//         coordinates: { lat: 10.872272578183443, lng: 75.93921531375074 },
//         slides : [
//           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoiiwhr_jeeIdt5mEZOIIuo77m1uLfsJSlmA&s',
//           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrYnQuO-ynpVnhA19_gv1mn1svHnEWvhuEbA&s',
//           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxhsc_9NbMcnljj2ZiTy1AUkO7kr55aAPCOA&s'
//         ]
//       },
//     ]
//   },
//   {
//     district: 'Palakkad',
//     temples: [
//       {
//         name: 'Sree Panamanna Sankaranarayanaswami Temple',
//         details: 'Address: Sree Panamanna Devaswom,Ambalavattom, P.O. Panamanna, Ottappalam, Palakkad., Contact: 0466 2242666',
//         coordinates: { lat: 10.804542123558923, lng: 76.35485975184109 },
//         slides : [
//           'https://lh4.googleusercontent.com/proxy/rWwMd7mkxKKbGQ3KV5u22bRBOQfOUm3gqWXe1KGTc0oXRCDACpmujtl5-_HiYmle0c7irVzrVciDck8m65eix6agKj8M4k9simfzepQHnpIty-Rwu4uaH0sL',
//           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLOTFOv1ZTUQ5J5LlHb9LR9V_t-KD5OpgWgQ&s',
//         ]
//       },
//       {
//         name: 'Sree Kooradi Siva Temple',
//         details: 'Address: Sree Panamanna Devaswom, Panamanna, Ottapalam,Palakkad., Contact: 0466 2242666',
//         coordinates: { lat: 10.800971607281141, lng: 76.35727363111587 },
//         slides : [
//           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfqw13Zt_YvmSevcndtA8Dhz62OlI8cPiQ8w&s',
//         ]
//       },
//       {
//         name: 'Sree Pattarkonam Siva Temple',
//         details: 'Address: Sree Panamanna Devaswom, Panamanna,Ottapalam, Palakkad, Contact: 0466 2242666',
//         coordinates: { lat: 10.822430460489567, lng: 76.35498735335702 },
//         slides : [
//           'https://content.jdmagicbox.com/v2/comp/palakkad/k5/9999px491.x491.180223213012.p7k5/catalogue/pattarkonam-shiva-temple-palakkad-temples-gd3g5tie39-250.jpg',
//         ]
//       },
//     ]
//   }
// ];

const truste = [
  {
    name : 'H.H. K C Unnianujan Raja, The Zamorin Raja of Calicut',
    position : 'Patron',
    image : Member1
  },
    {
      name : 'Smt. Maya Govind',
      position : 'Manager',
      image : Manager
    }
]

function App() {
  const mapRef = useRef(null);
  // Temple details modal state
  const [templeOpen, setTempleOpen] = useState(false);
  const [activeDistrict, setActiveDistrict] = useState(null);
  const [activeMember, setActiveMember] = useState(null);
  const [activeTemple,setActiveTemple] = useState(null);
  const [mapStyle, setMapStyle] = useState("2");
  const [modalContent, setModalContent] = useState(null);
  const leafletMap = useRef(null);
  // const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapPosition, setMapPosition] = useState({ lat: 11.2588, lng: 76.0, zoom: 8 });
  const [userLocation, setUserLocation] = useState(null); // { lat, lng }
  const userMarkerRef = useRef(null);

  // Trip planning state
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [routeLayer, setRouteLayer] = useState(null);
  const [routeSummary, setRouteSummary] = useState(null); // { distanceKm, durationMin, order: [idx...] }
  const [stopMarkers, setStopMarkers] = useState([]); // L.Marker[] for selected stops labels
  const [navActive, setNavActive] = useState(false);
  const navWatchIdRef = useRef(null);
  const headingMarkerRef = useRef(null);
  const [plannedPoints, setPlannedPoints] = useState(null); // points array used for planning (start + stops)
  const [lang, setLang] = useState('en'); // 'en' | 'ml'
  const [helpOpen, setHelpOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Navigation + guidance state
  const [routeInfo, setRouteInfo] = useState(null); // { route, orderedPoints }
  const [navIdx, setNavIdx] = useState({ leg: 0, step: 0 });
  const [nextTurnText, setNextTurnText] = useState('');
  const [nextTurnDistM, setNextTurnDistM] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const speechRef = useRef(null);
  const currentStepLayerRef = useRef(null);
  const [dwellDefaultMin, setDwellDefaultMin] = useState(60);
  const [dwellOverrides, setDwellOverrides] = useState({}); // {1: 60, 2: 45, ...}
  const [etaSchedule, setEtaSchedule] = useState([]);
  const navUserDotRef = useRef(null);
  // UI: summary and loading
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [planning, setPlanning] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  // Lock scroll when temple modal is open
  useEffect(() => {
    if (!templeOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove('modal-open');
    };
  }, [templeOpen]);

  const i18n = useMemo(() => ({
    en: {
      appTitle: "Zamorin's Central Devaswom - Temples",
      toggleMap: 'Toggle map style',
      planTrip: 'Plan trip',
      helpBtn: 'Help',
  zamorins: "Zamorin's",
      districts: 'Districts',
      trustees: 'Trustee',
      summary: 'Trip summary',
      distance: 'Distance',
      eta: 'ETA',
      clear: 'Clear',
      fit: 'Fit to route',
      openInGMaps: 'Open in Google Maps',
      startNav: 'Start navigation',
      stopNav: 'Stop navigation',
      common: { close: 'Close' },
  help: {
        title: 'How to use',
        section: {
          gettingStarted: 'Getting started',
          onMap: 'On the map',
          navigation: 'Navigation',
          notes: 'Notes',
        },
        step: {
          openPlanner: 'Click “Plan trip”.',
          setStart: 'Set start: use “Use my location” or type an address and pick a result.',
          selectTemples: 'Filter/search and select desired temples.',
          optimize: 'Choose “Optimize by Time” or “Optimize by Distance”.',
          planRoute: 'Click “Plan route” to draw and label the optimized loop.',
        },
        tip: {
          labels: 'Numbered labels (1..N) indicate the visiting order for selected temples.',
          summary: 'Use the summary card to Fit route, Open in Google Maps, or Start navigation.',
          fitClear: '“Clear” removes the route and labels; markers remain available.',
        },
        nav: {
          inApp: '“Start navigation” enables live tracking with a blue arrow that follows your device heading.',
          google: '“Open in Google Maps” opens the full loop with all selected temples as stops.',
        },
        note: {
          permissions: 'Location permission is required for accurate tracking.',
          heading: 'Heading requires a mobile device with compass; on desktop the arrow may not rotate.',
          osrm: 'Routing uses public OSRM; when unavailable, we estimate with straight lines.',
        },
      },
    },
    ml: {
      appTitle: "സാമൂതിരിയുടെ സെൻട്രൽ ദേവസ്വം - ക്ഷേത്രങ്ങൾ",
      toggleMap: 'മാപ്പ് സ്റ്റൈൽ മാറ്റുക',
      planTrip: 'ട്രിപ്പ് പ്ലാൻ ചെയ്യുക',
  helpBtn: 'സഹായം',
  zamorins: 'സാമൂതിരിയുടെ',
      districts: 'ജില്ലകൾ',
      trustees: 'ട്രസ്റ്റികൾ',
      summary: 'യാത്രാ സംഗ്രഹം',
      distance: 'ദൂരം',
      eta: 'അഞ്ചുമിനിട്ട് കാലം',
      clear: 'ക്ലിയർ',
      fit: 'റൂട്ടിലേക്ക് ഫിറ്റ് ചെയ്യുക',
      openInGMaps: 'ഗൂഗിള്‍ മാപ്സിൽ തുറക്കുക',
      startNav: 'നാവിഗേഷൻ ആരംഭിക്കുക',
      stopNav: 'നാവിഗേഷൻ നിർത്തുക',
      common: { close: 'അടയ്ക്കുക' },
  help: {
        title: 'ഉപയോഗ മാർഗ്ഗ നിർദ്ദേശം',
        section: {
          gettingStarted: 'ആരംഭിക്കാൻ',
          onMap: 'മാപ്പിൽ',
          navigation: 'ദിശാനിർദ്ദേശം',
          notes: 'ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ',
        },
        step: {
          openPlanner: '“ട്രിപ്പ് പ്ലാൻ ചെയ്യുക” ക്ലിക്ക് ചെയ്യുക.',
          setStart: 'സ്റ്റാർട്ട് സജ്ജമാക്കുക: “Use my location” അല്ലെങ്കിൽ വിലാസം ടൈപ്പ് ചെയ്ത് തിരഞ്ഞെടുക്കുക.',
          selectTemples: 'ഫിൽട്ടർ/തിരയൽ ഉപയോഗിച്ച് ക്ഷേത്രങ്ങൾ തിരഞ്ഞെടുക്കുക.',
          optimize: '“Time” അല്ലെങ്കിൽ “Distance” ഓപ്റ്റിമൈസേഷൻ തിരഞ്ഞെടുക്കുക.',
          planRoute: '“Plan route” ക്ലിക്ക് ചെയ്താൽ റൂട്ടും ലേബലുകളും കാണിക്കും.',
        },
        tip: {
          labels: 'ലേബലുകൾ (1..N) സന്ദർശന ക്രമം കാണിക്കുന്നു.',
          summary: 'സംഗ്രഹ കാർഡ് ഉപയോഗിച്ച് Fit, Google Maps തുറക്കൽ, അല്ലെങ്കിൽ നാവിഗേഷൻ ആരംഭിക്കൽ ചെയ്യാം.',
          fitClear: '“Clear” അമർത്തിയാൽ റൂട്ട് നീക്കം ചെയ്യും.',
        },
        nav: {
          inApp: '“നാവിഗേഷൻ ആരംഭിക്കുക” അമർത്തിയാൽ ബ്ലൂ ആറോ നിങ്ങളുടെ ദിശയിൽ നീങ്ങും.',
          google: '“ഗൂഗിള്‍ മാപ്സിൽ തുറക്കുക” അമർത്തിയാൽ മുഴുവൻ യാത്ര അവിടെ തുറക്കും.',
        },
        note: {
          permissions: 'കൃത്യമായ ട്രാക്കിംഗിനായി ലൊക്കേഷൻ അനുമതി ആവശ്യമാണ്.',
          heading: 'ഹെഡിംഗ് മൊബൈലിൽ ലഭ്യമാണ്; ഡെസ്ക്ടോപ്പിൽ ആറോ തിരിയാതെ ഇരിക്കാം.',
          osrm: 'റൂട്ടിങ് പൊതുവായ OSRM ഉപയോഗിക്കുന്നു; ലഭ്യമല്ലെങ്കിൽ ഏകദേശ വരകൾ ഉപയോഗിക്കും.',
        },
      },
    },
  }), []);

  const t = (key) => {
    const parts = key.split('.');
    let cur = i18n[lang];
    for (const p of parts) cur = cur?.[p];
    return cur ?? key;
  };

  // Malayalam localization helpers for data strings
  const toMlDistrict = (d) => {
    const map = { Kozhikode: 'കോഴിക്കോട്', Malappuram: 'മലപ്പുറം', Palakkad: 'പാലക്കാട്' };
    return map[d] || d;
  };
  const toMlName = (s) => {
    if (!s) return s;
    const repl = [
      ['Sree', 'ശ്രീ'],
      ['Sri ', 'ശ്രീ '],
      ['Temple', 'ക്ഷേത്രം'],
      ['Devaswom', 'ദേവസ്വം'],
      ['Kshetram', 'ക്ഷേത്രം'],
      ['Kovil', 'കോവിൽ'],
      ['Siva', 'ശിവ'],
      ['Shiva', 'ശിവ'],
      ['Krishna', 'കൃഷ്ണ'],
      ['Rama', 'രാമ'],
      ['Navamukundan', 'നവമുകുന്ദൻ'],
      ['Ayyappa', 'അയ്യപ്പൻ'],
      ['Ayyapa', 'അയ്യപ്പൻ'],
      ['Bhagavathy', 'ഭഗവതി'],
      ['Devi', 'ദേവി'],
      ['Mahavishnu', 'മഹാവിഷ്ണു'],
      ['Vishnu', 'വിഷ്ണു'],
      ['Narasimham', 'നരസിംഹം'],
      ['Hanuman', 'ഹനുമാൻ'],
      ['Swami', 'സ്വാമി'],
    ];
    let out = s;
    repl.forEach(([a, b]) => {
      out = out.replaceAll(a, b);
    });
    return out;
  };
  const toMlDetails = (s) => {
    if (!s) return s;
    let out = s;
    out = out.replace('Address:', 'വിലാസം:');
    out = out.replace('Contact:', 'ബന്ധപ്പെടുക:');
    out = out.replace('P.O.', 'പി.ഒ.');
    return out;
  };

  // Route ordering helpers (Nearest Neighbor + 2-Opt)
  const nearestNeighborOrder = (matrix) => {
    const n = matrix.length;
    const visited = new Array(n).fill(false);
    const order = [0];
    visited[0] = true;
    for (let step = 1; step < n; step++) {
      const last = order[order.length - 1];
      let best = -1;
      let bestVal = Infinity;
      for (let j = 1; j < n; j++) {
        if (!visited[j] && matrix[last][j] != null) {
          const v = matrix[last][j];
          if (v < bestVal) { bestVal = v; best = j; }
        }
      }
      if (best === -1) break;
      visited[best] = true;
      order.push(best);
    }
    order.push(0);
    return order;
  };

  const twoOpt = (order, matrix) => {
    const n = order.length;
    let improved = true;
    const cost = (i, j) => matrix[i][j] ?? Infinity;
    const pathCost = (ord) => {
      let c = 0;
      for (let i = 0; i < ord.length - 1; i++) c += cost(ord[i], ord[i + 1]);
      return c;
    };
    let bestOrder = order.slice();
    let bestCost = pathCost(bestOrder);
    while (improved) {
      improved = false;
      for (let i = 1; i < n - 2; i++) {
        for (let k = i + 1; k < n - 1; k++) {
          const a = bestOrder[i - 1], b = bestOrder[i];
          const c2 = bestOrder[k], d = bestOrder[k + 1];
          const delta = cost(a, c2) + cost(b, d) - (cost(a, b) + cost(c2, d));
          if (delta < -1e-6) {
            const newOrder = bestOrder.slice(0, i).concat(bestOrder.slice(i, k + 1).reverse(), bestOrder.slice(k + 1));
            bestOrder = newOrder;
            bestCost = bestCost + delta;
            improved = true;
          }
        }
      }
    }
    return bestOrder;
  };

  const computeTotals = (matrix, order) => {
    let sum = 0;
    for (let i = 0; i < order.length - 1; i++) sum += matrix[order[i]][order[i + 1]] ?? 0;
    return sum;
  };

  // Acquire browser geolocation
  const acquireLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setMapPosition({ lat: latitude, lng: longitude, zoom: 12 });
      },
      (err) => {
        console.error('Geolocation error', err);
        alert('Unable to retrieve your location. Please allow location permission.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  // Allow manual start location via search
  const setManualStartLocation = (loc) => {
    setUserLocation(loc);
    setMapPosition({ lat: loc.lat, lng: loc.lng, zoom: 12 });
  };

  // Helpers: distances
  const toRad = (x) => (x * Math.PI) / 180;
  const distMeters = (a, b) => {
    const R = 6371000; // meters
    const dLat = toRad(b[0] - a[0]);
    const dLng = toRad(b[1] - a[1]);
    const lat1 = toRad(a[0]);
    const lat2 = toRad(b[0]);
    const aa = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
    return R * c;
  };

  const buildCoords = (points) => points.map((p) => `${p.lng},${p.lat}`).join(';');

  const fetchOsrmTable = async (points) => {
    const base = 'https://router.project-osrm.org/table/v1/driving/';
    const url = `${base}${buildCoords(points)}?annotations=duration,distance`;
    const r = await fetch(url);
    if (!r.ok) throw new Error('OSRM table failed');
    const j = await r.json();
    return j; // { durations, distances }
  };

  const fetchOsrmRoute = async (orderedPoints) => {
    const base = 'https://router.project-osrm.org/route/v1/driving/';
    const coords = buildCoords(orderedPoints);
    const url = `${base}${coords}?overview=full&geometries=geojson&steps=true&annotations=distance,duration`;
    const r = await fetch(url);
    if (!r.ok) throw new Error('OSRM route failed');
    const j = await r.json();
    return j.routes?.[0]; // single best route with legs and steps
  };

  // Build a readable instruction from an OSRM step
  const formatInstruction = (step) => {
    if (!step?.maneuver) return '';
    const { type, modifier, exit } = step.maneuver;
    const road = step.name || '';
    const turnWord = (m) => {
      if (!m) return '';
      const map = {
        left: 'left', right: 'right', straight: 'straight', slight_left: 'slight left', slight_right: 'slight right', uturn: 'U-turn'
      };
      return map[m] || m;
    };
    switch (type) {
      case 'depart':
        return 'Head ' + (turnWord(modifier) || 'on your route');
      case 'turn':
        return `Turn ${turnWord(modifier)}${road ? ` onto ${road}` : ''}`;
      case 'new name':
        return `Continue${road ? ` onto ${road}` : ''}`;
      case 'merge':
        return `Merge${road ? ` onto ${road}` : ''}`;
      case 'roundabout':
      case 'rotary':
        return `At the roundabout, take exit ${exit || ''}${road ? ` onto ${road}` : ''}`;
      case 'on ramp':
        return `Take the ramp${road ? ` to ${road}` : ''}`;
      case 'off ramp':
        return `Take the exit${road ? ` to ${road}` : ''}`;
      case 'arrive':
        return 'Arrive at destination';
      case 'continue':
      default:
        return `Continue${road ? ` on ${road}` : ''}`;
    }
  };

  // Compute distance remaining within a step geometry from current lat/lng
  const stepRemainingMeters = (curLat, curLng, step) => {
    const coords = step?.geometry?.coordinates;
    if (!coords || coords.length < 2) return step?.distance ?? 0;
    // Convert to [lat,lng]
    const latlngs = coords.map(([lng, lat]) => [lat, lng]);
    // Find nearest segment index
    let bestIdx = 0, bestDist = Infinity;
    for (let i = 0; i < latlngs.length; i++) {
      const d = distMeters([curLat, curLng], latlngs[i]);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }
    // Sum from nearest point to end
    let sum = distMeters([curLat, curLng], latlngs[Math.min(bestIdx + 1, latlngs.length - 1)]);
    for (let i = Math.min(bestIdx + 1, latlngs.length - 1); i < latlngs.length - 1; i++) {
      sum += distMeters(latlngs[i], latlngs[i + 1]);
    }
    return Math.min(sum, step?.distance ?? sum);
  };

  // Compute ETA schedule per stop with dwell times
  const computeSchedule = (route, order, startDate, dwellMin, overrides) => {
    if (!route?.legs) return [];
    const out = [];
    let t = new Date(startDate);
    for (let i = 0; i < route.legs.length; i++) {
      const driveSec = route.legs[i].duration || 0;
      const arrival = new Date(t.getTime() + driveSec * 1000);
      // If this leg ends at a temple stop (exclude final return where order idx is 0)
      const destIdx = order[i + 1];
      if (destIdx !== 0) {
        const stopNumber = i + 1; // 1-based stop order
        const dwell = (overrides?.[stopNumber] ?? dwellMin) * 60; // sec
        const depart = new Date(arrival.getTime() + dwell * 1000);
        out.push({ stopNumber, arrival, depart, driveMinutes: Math.round(driveSec / 60) });
        t = depart; // include dwell before next leg
      } else {
        // return to start
        t = arrival;
      }
    }
    return out;
  };

  // Display helpers
  const formatDist = (m) => {
    if (m == null) return '';
    if (m >= 1000) return `${(m / 1000).toFixed(m >= 5000 ? 0 : 1)} km`;
    return `${Math.max(0, Math.round(m))} m`;
  };

  const haversineKm = (a, b) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const aa = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
    return R * c;
  };

  const planTrip = async (selectedTemples, optimizeBy) => {
    if (!userLocation) {
      acquireLocation();
      return;
    }
    setPlanning(true);
    try {
      // Clear any existing route
      if (routeLayer) {
        leafletMap.current.removeLayer(routeLayer);
        setRouteLayer(null);
      }

      // Clear old stop labels
      stopMarkers.forEach((m) => {
        try { leafletMap.current.removeLayer(m); } catch { /* noop */ }
      });
      setStopMarkers([]);

      // Build points with user as first
      const points = [userLocation, ...selectedTemples.map((t) => ({ lat: t.coordinates.lat, lng: t.coordinates.lng }))];

      // Try OSRM matrix first
      let matrix, altMatrix;
      try {
        const table = await fetchOsrmTable(points);
        const durations = table.durations; // seconds
        const distances = table.distances; // meters
        matrix = optimizeBy === 'time' ? durations : distances;
        altMatrix = optimizeBy === 'time' ? distances : durations;
      } catch (e) {
        console.warn('Falling back to Haversine matrix', e);
        // Build symmetric matrix in km and seconds (assume 35 km/h avg)
        const n = points.length;
        const dist = Array.from({ length: n }, () => Array(n).fill(0));
        const dur = Array.from({ length: n }, () => Array(n).fill(0));
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            if (i === j) continue;
            const dKm = haversineKm(points[i], points[j]);
            dist[i][j] = dKm * 1000; // meters
            dur[i][j] = (dKm / 35) * 3600; // seconds
          }
        }
        matrix = optimizeBy === 'time' ? dur : dist;
        altMatrix = optimizeBy === 'time' ? dist : dur;
      }

      // Build initial NN order and improve with 2-opt
      let order = nearestNeighborOrder(matrix);
      order = twoOpt(order, matrix);

      // Compute totals based on both matrices for summary
      const totalPrimary = computeTotals(matrix, order);
      const totalAlt = computeTotals(altMatrix, order);
      const distanceMeters = optimizeBy === 'time' ? totalAlt : totalPrimary; // if primary is time, alt is distance
      const durationSeconds = optimizeBy === 'time' ? totalPrimary : totalAlt;

      // Request OSRM route geometry and steps if possible
      let layer = null;
      let osrmRoute = null;
      try {
        const orderedPoints = order.map((idx) => points[idx]);
        // Ensure closed loop
        if (orderedPoints[0].lat !== orderedPoints[orderedPoints.length - 1].lat || orderedPoints[0].lng !== orderedPoints[orderedPoints.length - 1].lng) {
          orderedPoints.push(orderedPoints[0]);
        }
        osrmRoute = await fetchOsrmRoute(orderedPoints);
        const geo = osrmRoute?.geometry;
        if (geo?.coordinates) {
          const latlngs = geo.coordinates.map(([lng, lat]) => [lat, lng]);
          layer = L.polyline(latlngs, { color: '#E68057', weight: 5, opacity: 0.9 });
        }
      } catch (e) {
        console.warn('OSRM route geometry failed, fallback to straight lines', e);
      }

      if (!layer) {
        const latlngs = order.map((idx) => [points[idx].lat, points[idx].lng]);
        // ensure closed loop
        if (latlngs[0][0] !== latlngs[latlngs.length - 1][0] || latlngs[0][1] !== latlngs[latlngs.length - 1][1]) {
          latlngs.push(latlngs[0]);
        }
        layer = L.polyline(latlngs, { color: '#E68057', weight: 4, dashArray: '6 8' });
      }

      layer.addTo(leafletMap.current);
      setRouteLayer(layer);
      leafletMap.current.fitBounds(layer.getBounds(), { padding: [30, 30] });

      // Prefer OSRM totals if available
      const totalDistance = osrmRoute?.distance ?? (optimizeBy === 'time' ? (computeTotals(altMatrix, order)) : (computeTotals(matrix, order)));
      const totalDuration = osrmRoute?.duration ?? (optimizeBy === 'time' ? (computeTotals(matrix, order)) : (computeTotals(altMatrix, order)));

      setRouteSummary({
        distanceKm: (totalDistance || 0) / 1000,
        durationMin: (totalDuration || 0) / 60,
        order,
      });
      setPlannedPoints(points);

      // Store route info for navigation/ETAs
      if (osrmRoute) setRouteInfo({ route: osrmRoute, orderedPoints: order.map((idx) => points[idx]), order });
      else setRouteInfo(null);

      // Compute initial ETA schedule (assume dwellDefault)
      const schedule = computeSchedule(osrmRoute, order, new Date(), dwellDefaultMin, {});
      setEtaSchedule(schedule);

      // Add labeled markers for selected stops in visiting order (1..N)
      const labels = [];
      const orderedStops = order.slice(1, -1); // exclude the starting point at 0 and last 0
      orderedStops.forEach((ordIdx, i) => {
        const p = points[ordIdx];
        const label = i + 1;
        const marker = L.marker([p.lat, p.lng], {
          icon: L.divIcon({
            className: 'stop-label',
            html: `<div style="background:#2e7d32;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:600;border:2px solid #fff;box-shadow:0 0 0 1px #2e7d32;">${label}</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          })
        }).addTo(leafletMap.current).bindTooltip(`Stop ${label}`);
        labels.push(marker);
      });
      setStopMarkers(labels);
    } catch (err) {
      console.error('Failed to plan trip', err);
      alert('Failed to plan trip. Please try again.');
    } finally {
      setPlanning(false);
    }
  };

  // Export planned route to Google Maps with waypoints
  const exportToGoogleMaps = () => {
    if (!routeSummary || !plannedPoints) return;
    const idxs = routeSummary.order;
    if (idxs.length < 2) return;
    const originPt = plannedPoints[idxs[0]];
    const destPt = plannedPoints[idxs[idxs.length - 1]];
    const wp = idxs.slice(1, -1).map((i) => `${plannedPoints[i].lat},${plannedPoints[i].lng}`).join('|');
    const origin = `${originPt.lat},${originPt.lng}`;
    const destination = `${destPt.lat},${destPt.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`
      + (wp ? `&waypoints=${encodeURIComponent(wp)}` : '')
      + `&travelmode=driving`;
    window.open(url, '_blank');
  };

  // Voice helper
  const speak = (text) => {
    if (!voiceEnabled || !text) return;
    try {
      const utter = new SpeechSynthesisUtterance(text);
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
      speechRef.current = utter;
    } catch {}
  };

  // Navigation mode: live tracking with arrow marker + current step highlight
  const startNavigation = () => {
    if (!userLocation) { acquireLocation(); return; }
    if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
    setNavActive(true);
    setSummaryExpanded(false); // minimize summary to prioritize map

    // Ensure user dot marker exists
    if (!navUserDotRef.current) {
      navUserDotRef.current = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 6, color: '#1976d2', fillColor: '#2196f3', fillOpacity: 0.9, weight: 2,
      }).addTo(leafletMap.current).bindTooltip('You are here');
    } else {
      navUserDotRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    }

    // Heading arrow setup
    if (headingMarkerRef.current) {
      try { leafletMap.current.removeLayer(headingMarkerRef.current); } catch {}
      headingMarkerRef.current = null;
    }
    const arrowIcon = L.divIcon({
      className: 'heading-arrow',
      html: '<div style="width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:18px solid #1976d2;transform:rotate(0deg);"></div>',
      iconSize: [20, 20], iconAnchor: [10, 10],
    });
    headingMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: arrowIcon, zIndexOffset: 1000 }).addTo(leafletMap.current);
    leafletMap.current.setView([userLocation.lat, userLocation.lng], 16);

    // Ensure the route line is visible
    if (!routeLayer && routeInfo?.route?.geometry?.coordinates) {
      const latlngs = routeInfo.route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      const layer = L.polyline(latlngs, { color: '#E68057', weight: 5, opacity: 0.9 }).addTo(leafletMap.current);
      setRouteLayer(layer);
    }

    // Initialize step pointer and highlight
    if (routeInfo?.route?.legs?.length) {
      setNavIdx({ leg: 0, step: 0 });
      const step0 = routeInfo.route.legs[0].steps?.[0];
      if (step0?.geometry?.coordinates) {
        if (currentStepLayerRef.current) { try { leafletMap.current.removeLayer(currentStepLayerRef.current); } catch {} }
        const latlngs = step0.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        currentStepLayerRef.current = L.polyline(latlngs, { color: '#1976d2', weight: 6, opacity: 0.9 }).addTo(leafletMap.current);
      }
      const instr = formatInstruction(step0);
      setNextTurnText(instr);
      setNextTurnDistM(step0?.distance ?? null);
      speak(instr);
    }

    navWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, heading } = pos.coords;
        // Update markers
        if (navUserDotRef.current) navUserDotRef.current.setLatLng([latitude, longitude]);
        if (headingMarkerRef.current) {
          headingMarkerRef.current.setLatLng([latitude, longitude]);
          const el = headingMarkerRef.current.getElement();
          if (el) { const tri = el.querySelector('div'); if (tri) tri.style.transform = `rotate(${heading || 0}deg)`; }
        }

        // Update next-turn and advance steps
        if (routeInfo?.route?.legs?.length) {
          let { leg, step } = navIdx;
          let curStep = routeInfo.route.legs[leg]?.steps?.[step];
          if (curStep) {
            const rem = stepRemainingMeters(latitude, longitude, curStep);
            setNextTurnDistM(rem);
            // Advance when close to end
            if (rem < 25) {
              // move to next step
              const stepsLen = routeInfo.route.legs[leg].steps.length;
              if (step + 1 < stepsLen) {
                step += 1;
              } else {
                // next leg
                const legsLen = routeInfo.route.legs.length;
                if (leg + 1 < legsLen) {
                  leg += 1; step = 0;
                } else {
                  // finished
                  setNextTurnText('Route complete');
                  setNextTurnDistM(0);
                  speak('Route complete');
                }
              }
              setNavIdx({ leg, step });
              curStep = routeInfo.route.legs[leg]?.steps?.[step];
              const instr = formatInstruction(curStep);
              setNextTurnText(instr);
              if (curStep) setNextTurnDistM(curStep.distance ?? null);
              speak(instr);
              // Update highlight
              if (currentStepLayerRef.current) { try { leafletMap.current.removeLayer(currentStepLayerRef.current); } catch {} }
              if (curStep?.geometry?.coordinates) {
                const latlngs = curStep.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                currentStepLayerRef.current = L.polyline(latlngs, { color: '#1976d2', weight: 6, opacity: 0.9 }).addTo(leafletMap.current);
              }
            }
          }
        }
      },
      (err) => { console.error('watchPosition error', err); stopNavigation(); },
      { enableHighAccuracy: true, maximumAge: 500, timeout: 10000 }
    );
  };

  const stopNavigation = () => {
    setNavActive(false);
    // keep user's last preference; do not force expand
    if (navWatchIdRef.current != null) { navigator.geolocation.clearWatch(navWatchIdRef.current); navWatchIdRef.current = null; }
    if (headingMarkerRef.current) { try { leafletMap.current.removeLayer(headingMarkerRef.current); } catch {} headingMarkerRef.current = null; }
    if (currentStepLayerRef.current) { try { leafletMap.current.removeLayer(currentStepLayerRef.current); } catch {} currentStepLayerRef.current = null; }
  };

  // Recompute schedule when dwell settings change
  useEffect(() => {
    if (routeInfo?.route && routeSummary?.order) {
      setEtaSchedule(computeSchedule(routeInfo.route, routeSummary.order, new Date(), dwellDefaultMin, dwellOverrides));
    }
  }, [dwellDefaultMin, dwellOverrides, routeInfo, routeSummary]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Leaflet map
    leafletMap.current = L.map(mapRef.current, {
      zoomControl: false,
      tap: false,
    }).setView([mapPosition.lat, mapPosition.lng], mapPosition.zoom);

    // OpenStreetMap Tile Layer

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; OpenStreetMap contributors',
    // }).addTo(leafletMap.current);
    switch (mapStyle) {
      case "1":
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(leafletMap.current);
        break;
      case "2":
        // OpenStreetMap Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(leafletMap.current);
        break;
      default:
        console.log("no case")
    }




    // Use Feather icon for the custom marker
    // const featherIconSVG = feather.icons['map-pin'].toSvg({ width: 32, height: 32, color: '#4CAF50' });

    // Custom marker icon using Feather SVG
    const customIcon = L.icon({
      iconUrl: LocImage, // Path to your PNG image
      iconSize: [60, 60], // Adjust based on your image dimensions
      iconAnchor: [16, 32], // Anchor point of the icon (centered at the bottom)
      popupAnchor: [0, -32], // Popup position relative to the marker
    });

    // Add markers for each temple
  data.forEach(district => {
      district.temples.forEach(temple => {
        const marker = L.marker([temple.coordinates.lat, temple.coordinates.lng], { icon: customIcon })
          .addTo(leafletMap.current);

        // Store the marker so we can reference it later
        temple.marker = marker;

        // Bind tooltip to show the name of the temple when hovering over the marker
        marker.bindTooltip(temple.name, { permanent: false, direction: 'top' });

        marker.on('click', () => {
          setModalContent(temple); // Set the modal content
          setTempleOpen(true);
        });
      });
    });

    // If we already have a user location, render its marker
    if (userLocation) {
      const youIcon = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 8,
        color: '#1976d2',
        fillColor: '#2196f3',
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(leafletMap.current).bindTooltip('You are here');
      userMarkerRef.current = youIcon;
    }

    // Cleanup map instance
    return () => {
      leafletMap.current.remove();
    };
  }, [mapPosition,mapStyle,userLocation]);

  const focusOnTemple = (lat, lng, temple) => {
    if (leafletMap.current && temple.marker) {
      leafletMap.current.setView([lat, lng], 16); // Focus on the clicked temple

      // Set Tooltip for the temple
      const marker = temple.marker;
      marker.bindTooltip(temple.name).openTooltip(); // Add tooltip with temple name

      // Add a label near the marker with the temple name
      marker.bindPopup(`<b>${temple.name}</b>`).openPopup(); // Display temple name in a label format



    }

    setMapPosition({ lat, lng, zoom: 16 });
  };

  // const toggleSidebar = () => {
  //   setSidebarOpen(!sidebarOpen);
  // };

  const handleAccordionClick = (district) => {
    setActiveDistrict(activeDistrict === district ? null : district);
  };

  const handleAcordionClickTwo = (truste) => {
    setActiveMember(activeMember === truste ? null : truste)
  }

  const handleTempleClick = (temple) => {
    setActiveTemple(temple);
    focusOnTemple(temple.coordinates.lat, temple.coordinates.lng, temple);
  };

  const renderAccordion = () => {
    return data.map((district, index) => (
      <div key={index} className="accordion-item">
        <button className="accordion-header" onClick={() => handleAccordionClick(district.district)}>
          {district.district}
        </button>
        <div className={`accordion-body ${activeDistrict === district.district ? 'open' : ''}`}>
        {console.log("Accordion Body Class:", activeDistrict === district.district ? 'open' : 'closed')}
          <ul>
            {district.temples.map((temple, idx) => (
              <li style={{color : activeTemple === temple ? '#E68057' : 'black', cursor :'pointer'}} key={idx} onClick={() => handleTempleClick(temple)}>
                Zamorin's {temple.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ));
  };


// 




const renderAccordionTwo = () => {
  return truste.map((trusteItem, index) => (
    <div key={index} className="accordion-item">
      <button className="accordion-header" onClick={() => handleAcordionClickTwo(trusteItem.name)}>
        {trusteItem.position}
      </button>
      <div style={{display: 'flex', alignItems : 'center' , justifyContent : 'center', flexDirection :'column'}} className={`accordion-body ${activeMember === trusteItem.name ? 'open' : ''}`}>
          <img style={{height : '180px' , width : '150px'}} src={trusteItem.image} alt="image1"/>
          <div style={{display : 'flex' , flexDirection : 'column'}}>

          </div>
          <h4>{trusteItem.name}</h4>
          <span>{trusteItem.position}</span>
      </div>
    </div>
  ));
};

// 
  const closeModal = () => {
    setTempleOpen(false);
  };

  return (
    <div className="app" style={{ fontSize: lang === 'ml' ? '0.95rem' : '1rem' }}>
      {/* loader overlay during planning */}
      {planning && (
        <div className="planning-overlay" aria-live="polite" role="status">
          <div className="spinner" />
          <div className="planning-text">Calculating the best route…</div>
        </div>
      )}
      <header className="app-header" style={{ backgroundColor: '#E68057', color: 'white', textAlign: 'center', padding: '1rem' , display :'flex',alignItems: 'center',justifyContent : 'space-between'}}>
        <div className="brand" style={{display : 'flex', alignItems:'center', gap: 8}}>
          <img src={zLogo} style={{width : "80px" , height : '60px'}} alt="Zamorin Logo"/>
          <h3 className="app-title" style={{ margin: 0, fontSize: lang === 'ml' ? '1.05rem' : '1.15rem' }}>{t('appTitle')}</h3>
        </div>
  <button className="hamburger" aria-label="Menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>☰</button>
  <div className="header-actions">
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ backgroundColor: '#fff', color: '#333', border: 'none', borderRadius: '4px', padding: '0.5rem 0.8rem', cursor: 'pointer' }}>
            <option value="en">English</option>
            <option value="ml">മലയാളം</option>
          </select>
          <button style={{ backgroundColor: '#a2574f', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer' }} onClick={() => setMapStyle((s) => s === '1' ? '2' : '1')}>{t('toggleMap')}</button>
          <button style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer' }} onClick={() => setPlannerOpen(true)}>{t('planTrip')}</button>
          <button style={{ backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer' }} onClick={() => setHelpOpen(true)}>{t('helpBtn')}</button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setMobileMenuOpen(false); }}>
          <nav className="mobile-menu" role="menu" aria-label="Main menu">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
              <strong>{t('appTitle')}</strong>
              {/* <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" style={{ background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button> */}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10,alignItems: 'stretch' ,padding: '0 12px', height: 'calc(100% - 44px)', overflow: 'auto' }}>
              <select value={lang} onChange={(e) => { setLang(e.target.value); setMobileMenuOpen(false); }} style={{ backgroundColor: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: 6, padding: '10px 12px', cursor: 'pointer' }}>
                <option value="en">English</option>
                <option value="ml">മലയാളം</option>
              </select>
              <button onClick={() => { setMapStyle((s) => s === '1' ? '2' : '1'); setMobileMenuOpen(false); }} style={{ background: '#a2574f', color: '#fff', border: 'none', padding: '12px', borderRadius: 6, textAlign: 'left' }}>{t('toggleMap')}</button>
              <button onClick={() => { setPlannerOpen(true); setMobileMenuOpen(false); }} style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '12px', borderRadius: 6, textAlign: 'left' }}>{t('planTrip')}</button>
              <button onClick={() => { setHelpOpen(true); setMobileMenuOpen(false); }} style={{ background: '#1976d2', color: '#fff', border: 'none', padding: '12px', borderRadius: 6, textAlign: 'left' }}>{t('helpBtn')}</button>

              {/* Districts and temples in mobile drawer */}
              <div style={{ marginTop: 8 }}>
                <h4 style={{ margin: '8px 0' }}>{t('districts')}</h4>
                <div style={{ border: '1px solid #eee', borderRadius: 6, overflow: 'hidden' }}>
                  {data.map((district, index) => (
                    <details key={index} style={{ borderBottom: '1px solid #f2f2f2' }}>
                      <summary style={{ padding: '10px 12px', background: '#fafafa', cursor: 'pointer' }}>
                        {lang === 'ml' ? (district.district_ml || toMlDistrict(district.district)) : district.district}
                      </summary>
                      <ul style={{ listStyle: 'none', margin: 0, padding: '8px 12px' }}>
                        {district.temples.map((temple, idx) => (
                          <li key={idx} style={{ padding: '6px 0', borderBottom: '1px solid #f5f5f5' }}>
                            <button
                              onClick={() => { setMobileMenuOpen(false); setActiveTemple(temple); focusOnTemple(temple.coordinates.lat, temple.coordinates.lng, temple); setModalContent(temple); setTempleOpen(true); }}
                              style={{ background: 'transparent', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer' }}
                            >
                              {t('zamorins')} {lang === 'ml' ? (temple.name_ml || toMlName(temple.name)) : temple.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </div>

              {/* Trustees */}
              <div style={{ marginTop: 10 }}>
                <h4 style={{ margin: '8px 0' }}>{t('trustees')}</h4>
                <div style={{ border: '1px solid #eee', borderRadius: 6, padding: '8px 12px' }}>
                  {truste.map((tr, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                      <img src={tr.image} alt={tr.name} style={{ width: 40, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ fontSize: 14 }}>{tr.name}</strong>
                        <span style={{ fontSize: 12, color: '#666' }}>{tr.position}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}

      <div className="content">
        <div className="sidebar" 
        >
          
          <h3>{t('districts')}</h3>
          <div className="accordion">
            {data.map((district, index) => (
              <div key={index} className="accordion-item">
                <button className="accordion-header" onClick={() => handleAccordionClick(district.district)}>
                  {lang === 'ml' ? (district.district_ml || toMlDistrict(district.district)) : district.district}
                </button>
                <div className={`accordion-body ${activeDistrict === district.district ? 'open' : ''}`}>
                  {console.log("Accordion Body Class:", activeDistrict === district.district ? 'open' : 'closed')}
                  <ul>
                    {district.temples.map((temple, idx) => (
                      <li
                        style={{
                          color: activeTemple === temple ? '#E68057' : 'black',
                          cursor: 'pointer',
                          fontSize: lang === 'ml' ? '0.95em' : '1em',
                        }}
                        key={idx}
                        onClick={() => handleTempleClick(temple)}
                      >
                        {t('zamorins')} {lang === 'ml' ? (temple.name_ml || toMlName(temple.name)) : temple.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <h3>{t('trustees')}</h3>
          <div className='accordion'>
          {renderAccordionTwo()}
          </div>
        </div>
  <div id="map" ref={mapRef} style={{ width:'75%' , height: '100vh' }}></div>
      </div>

      {/* Route summary overlay */}
      {routeSummary && (
        <div
          className={`route-summary ${summaryExpanded ? 'expanded' : 'minimized'}`}
          onClick={() => { if (!summaryExpanded) setSummaryExpanded(true); }}
          style={{ position: 'fixed', right: 16, bottom: 16, background: '#fff', borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.15)', padding: summaryExpanded ? '12px 14px' : '8px 10px', zIndex: 1200, minWidth: 260, cursor: !summaryExpanded ? 'pointer' : 'default' }}
        >
          <div className="summary-handle" onClick={(e) => { e.stopPropagation(); setSummaryExpanded((v) => !v); }} aria-label="Toggle summary" title="Toggle summary" />

          {summaryExpanded ? (
            <>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{t('summary')}</div>
              <div>{t('distance')}: {routeSummary.distanceKm.toFixed(1)} km</div>
              <div>{t('eta')}: {Math.round(routeSummary.durationMin)} min</div>

              {navActive && routeInfo?.route?.legs && (
                <div aria-live="polite" role="status" style={{ marginTop: 8, padding: 8, background: '#f6f8fa', borderRadius: 6 }}>
                  <div style={{ fontWeight: 600 }}>{nextTurnText || 'Follow route'}</div>
                  {nextTurnDistM != null && <div>{formatDist(nextTurnDistM)} to next turn</div>}
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    <input type="checkbox" checked={voiceEnabled} onChange={(e) => setVoiceEnabled(e.target.checked)} /> Voice guidance
                  </label>
                </div>
              )}

              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => { if (routeLayer) { leafletMap.current.removeLayer(routeLayer); setRouteLayer(null); } setRouteSummary(null); setRouteInfo(null); setEtaSchedule([]); }} style={{ background: '#eee', border: '1px solid #ccc', padding: '6px 10px', borderRadius: 4, cursor: 'pointer' }}>{t('clear')}</button>
                {routeLayer && (
                  <button onClick={() => leafletMap.current.fitBounds(routeLayer.getBounds())} style={{ background: '#E68057', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 4, cursor: 'pointer' }}>{t('fit')}</button>
                )}
                <button onClick={exportToGoogleMaps} style={{ background: '#1a73e8', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 4, cursor: 'pointer' }}>{t('openInGMaps')}</button>
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                {!navActive ? (
                  <button onClick={startNavigation} style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 4, cursor: 'pointer' }}>{t('startNav')}</button>
                ) : (
                  <button onClick={stopNavigation} style={{ background: '#b71c1c', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 4, cursor: 'pointer' }}>{t('stopNav')}</button>
                )}
              </div>

              {routeInfo?.route?.legs && (
                <div style={{ marginTop: 10, borderTop: '1px solid #eee', paddingTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <label>Per-stop time (min)</label>
                    <input type="number" min={0} max={600} value={dwellDefaultMin} onChange={(e) => setDwellDefaultMin(parseInt(e.target.value || '0', 10))} style={{ width: 80 }} />
                  </div>
                  {etaSchedule.length > 0 && (
                    <div style={{ maxHeight: 160, overflow: 'auto', border: '1px solid #eee', borderRadius: 6, padding: 8 }}>
                      {etaSchedule.map((s, ix) => (
                        <div key={ix} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                          <div>
                            Stop {s.stopNumber}: {(() => {
                              // show temple name for stop
                              if (!routeSummary?.order || !plannedPoints) return '';
                              const ordIdx = routeSummary.order[s.stopNumber];
                              const pt = plannedPoints[ordIdx];
                              // find temple by coordinates
                              let name = '';
                              data.forEach(d => d.temples.forEach(t => { if (Math.abs(t.coordinates.lat - pt.lat) < 1e-6 && Math.abs(t.coordinates.lng - pt.lng) < 1e-6) name = t.name; }));
                              return name;
                            })()}
                          </div>
                          <div title={`Arrive ~ ${s.arrival.toLocaleTimeString()}`}>ETA: {s.arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input type="number" min={0} max={600} value={dwellOverrides[s.stopNumber] ?? ''} placeholder={dwellDefaultMin} onChange={(e) => setDwellOverrides((prev) => ({ ...prev, [s.stopNumber]: e.target.value === '' ? undefined : parseInt(e.target.value || '0', 10) }))} style={{ width: 64 }} />
                            <span>min</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="summary-mini">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="mini-dot" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong>{t('summary')}</strong>
                  {navActive && (
                    <span style={{ fontSize: 12, color: '#555' }}>
                      {(nextTurnText || 'Follow route') + (nextTurnDistM != null ? ` • ${formatDist(nextTurnDistM)}` : '')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Temple details modal */}
      <TempleDetailsModal
        isOpen={templeOpen}
        onClose={() => setTempleOpen(false)}
        temple={modalContent}
        lang={lang}
        t={t}
        toMlName={toMlName}
        toMlDetails={toMlDetails}
      />

      {/* Trip Planner Modal */}
      <TripPlannerModal
        isOpen={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        data={data}
        hasLocation={!!userLocation}
        onRequestLocation={() => acquireLocation()}
        onPlan={({ selectedTemples, optimizeBy }) => planTrip(selectedTemples, optimizeBy)}
        onSetStartLocation={setManualStartLocation}
        lang={lang}
      />

      <InfoManual isOpen={helpOpen} onClose={() => setHelpOpen(false)} t={t} lang={lang} />
    </div>
  );
}

export default App;
