import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import zLogo from './images/ZamorinLogo-removebg-preview.png'
import LocImage from './images/locIcon.png';
import Member1 from './images/Person1.jpg'
import Manager from './images/Manager.jpg'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Slideshow from './ImageSlider';


const data = [
  {
    district: 'Kozhikode',
    temples: [
      {
        name: 'Sree Tali Devaswom (Siva & Krishna)',
        details: 'Address: Tali, Kozhikode-2, Contact: 0495 2703610',
        coordinates: { lat: 11.248147944046364, lng: 75.787605411904 },
        slides : [
          'https://www.citybit.in/wp-content/uploads/2023/10/Tali-Shiva-Temple.jpg',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/22/cb/17/inside-tali-temple.jpg?w=700&h=400&s=1',
          'https://www.shutterstock.com/image-photo/hindu-temple-tali-shiva-known-600w-2430677279.jpg'
        ]
      },
      {
        name: 'Sree Ramaswami Temple, (Sreerama)',
        details: 'Address: Tali Devaswom, Tali, Kozhikode-2, Contact: 0495 2703610',
        coordinates: { lat: 11.248832823384667, lng: 75.78693262786435 },
        slides : [
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF7Jkm_r4VFyz9rsy20YP9ojMq7So_ZbEJAA&s',
          'https://content3.jdmagicbox.com/comp/kozhikode/j6/0495px495.x495.220319002104.v8j6/catalogue/tali-temple-pond-vadakara-beach-kozhikode-temples-GU8KwBGM8i.jpg',
        ]
      },
      {
        name: 'Sree Valayanad Devaswom, (Devi)',
        details: 'Address: P.O. Kommeri, Kozhikode - 7, Contact: 0495 2741083',
        coordinates: { lat: 11.24397061799881, lng: 75.80394439470938 },
        slides : [
          'https://media.holidify.com/images/cmsuploads/compressed/gallery-images-03-1_20241203173837.jpg',
          'https://s3.ap-south-1.amazonaws.com/esapp/evmpic/1548926275184.jpg',
          'https://media1.thrillophilia.com/filestore/ycip9bow7p7ei8a0q8hv3r5rjy3t_gallery-images-07.jpg?w=400&dpr=2'
        ]
      },
    ]
  },
  {
    district: 'Malappuram',
    temples: [
      {
        name: 'Sree Thirunavaya Devaswom, (Navamukundan),',
        details: 'Address: P.O. Thirunavaya, Tirur,Malappuram Contact: 0494 2603747)',
        coordinates: { lat: 10.863878637593611, lng: 75.98167325237682 },
        slides : [
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPxbK3zXCsFWjxXeUnv3BgVXBh67n8AJcUYw&s',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFYSTZ-uazKHQiodIHHPkSb9aRxHbkj4yCag&s',
          'https://i.ytimg.com/vi/52qkqyAXaBI/maxresdefault.jpg'
        ]
      },
      {
        name: 'Sree Thriprangode Devaswom, (Siva),',
        details: 'Address: P.O. Thriprangode, Tirur, Malappuram, Contact: 0494 2566046',
        coordinates: { lat: 10.855840083961287, lng: 75.94775633888423 },
        slides : [
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm3t4JrQCeWbPq_tqxmGYa0-E5yIJ-q8pmLA&s',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNG_xYJsY_TGUKhfg6Cz326tNdE6Z9lVjleg&s',
          'https://lightuptemples.com/wp-content/uploads/temple/profile_image/malappuram-sri-triprangode-shiva-temple-kerala.jpg'
        ]
      },
      {
        name: 'Sree Alathiyur Perumthrikovil Devaswom (Hanuman kavu), (Sreerama),',
        details: 'Address: P.O. Poyilisseri, Tirur, Malappuram., Contact: 0494 2430666',
        coordinates: { lat: 10.872272578183443, lng: 75.93921531375074 },
        slides : [
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoiiwhr_jeeIdt5mEZOIIuo77m1uLfsJSlmA&s',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrYnQuO-ynpVnhA19_gv1mn1svHnEWvhuEbA&s',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxhsc_9NbMcnljj2ZiTy1AUkO7kr55aAPCOA&s'
        ]
      },
    ]
  },
  {
    district: 'Palakkad',
    temples: [
      {
        name: 'Sree Panamanna Sankaranarayanaswami Temple',
        details: 'Address: Sree Panamanna Devaswom,Ambalavattom, P.O. Panamanna, Ottappalam, Palakkad., Contact: 0466 2242666',
        coordinates: { lat: 10.804542123558923, lng: 76.35485975184109 },
        slides : [
          'https://lh4.googleusercontent.com/proxy/rWwMd7mkxKKbGQ3KV5u22bRBOQfOUm3gqWXe1KGTc0oXRCDACpmujtl5-_HiYmle0c7irVzrVciDck8m65eix6agKj8M4k9simfzepQHnpIty-Rwu4uaH0sL',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLOTFOv1ZTUQ5J5LlHb9LR9V_t-KD5OpgWgQ&s',
        ]
      },
      {
        name: 'Sree Kooradi Siva Temple',
        details: 'Address: Sree Panamanna Devaswom, Panamanna, Ottapalam,Palakkad., Contact: 0466 2242666',
        coordinates: { lat: 10.800971607281141, lng: 76.35727363111587 },
        slides : [
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfqw13Zt_YvmSevcndtA8Dhz62OlI8cPiQ8w&s',
        ]
      },
      {
        name: 'Sree Pattarkonam Siva Temple',
        details: 'Address: Sree Panamanna Devaswom, Panamanna,Ottapalam, Palakkad, Contact: 0466 2242666',
        coordinates: { lat: 10.822430460489567, lng: 76.35498735335702 },
        slides : [
          'https://content.jdmagicbox.com/v2/comp/palakkad/k5/9999px491.x491.180223213012.p7k5/catalogue/pattarkonam-shiva-temple-palakkad-temples-gd3g5tie39-250.jpg',
        ]
      },
    ]
  }
];

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
  const modalRef = useRef(null);
  const [activeDistrict, setActiveDistrict] = useState(null);
  const [activeMember, setActiveMember] = useState(null);
  const [activeTemple,setActiveTemple] = useState(null);
  const [mapStyle, setMapStyle] = useState("2");
  const [modalContent, setModalContent] = useState(null);
  const leafletMap = useRef(null);
  // const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapPosition, setMapPosition] = useState({ lat: 11.2588, lng: 76.0, zoom: 8 });

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
          if (modalRef.current) {
            modalRef.current.style.display = 'flex';
          }


          // Update the active marker and previous marker
        });
      });
    });

    // Cleanup map instance
    return () => {
      leafletMap.current.remove();
    };
  }, [mapPosition,mapStyle]);

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
    if (modalRef.current) {
      modalRef.current.style.display = 'none';
    }
  };

  return (
    <div className="app">
      <header style={{ backgroundColor: '#E68057', color: 'white', textAlign: 'center', padding: '1rem' , display :'flex',alignItems: 'center',justifyContent : 'space-between'}}>
        <div style={{display : 'flex'}}>
          <img src={zLogo} style={{width : "80px" , height : '60px'}} alt=""/>
          <h3>Zamorin's Central Devaswom - Temples</h3>
        </div>
        
        <button style={{ backgroundColor: '#a2574f', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer' }} onClick={() => mapStyle === '1' ? setMapStyle('2') : setMapStyle('1')}>Toggle map style</button>
      </header>
      <div className="content">
        <div className="sidebar" 
        >
          
          <h3>Districts</h3>
          <div className="accordion">
            {renderAccordion()}
          </div>
          <h3>Trustee</h3>
          <div className='accordion'>
          {renderAccordionTwo()}
          </div>
        </div>
        <div id="map" ref={mapRef} style={{ width:'75%' , height: '100vh' }}></div>
      </div>

      {/* Modal */}
      <div id="modal" ref={modalRef} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        {
          console.log("modalContenrt",modalContent)
        }
        
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', width: '600px', textAlign: 'center' }}>
        <Slideshow slides={modalContent?.slides}/>
          <h2>Zamorin's {modalContent?.name}</h2>
          <p>{modalContent?.details}</p>
          {/* Add a Directions button */}
          <button style={{ backgroundColor: '#E68057', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer' }} onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${modalContent?.coordinates.lat},${modalContent?.coordinates.lng}`, '_blank')}>
            Get Directions
          </button>
          <button style={{ backgroundColor: '#a2574f', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer', marginLeft: '10px' }} onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default App;
