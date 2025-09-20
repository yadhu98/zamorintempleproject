import React, { useEffect, useMemo, useState } from 'react';

// Lightweight modal for multi-selecting temples and planning a route
// Props:
// - isOpen: boolean
// - onClose: () => void
// - data: [{ district, temples: [{ name, details, coordinates }] }]
// - onPlan: ({ selectedTemples, optimizeBy }) => void
// - hasLocation: boolean (do we have user location acquired?)
// - onRequestLocation: () => void

const Backdrop = ({ children, onClose }) => (
  <div
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
    onTouchMove={(e) => { e.stopPropagation(); }}
    onScroll={(e) => { e.stopPropagation(); }}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      overscrollBehavior: 'contain',
    }}
  >
    {children}
  </div>
);

export default function TripPlannerModal({ isOpen, onClose, data, onPlan, hasLocation, onRequestLocation, onSetStartLocation, lang = 'en' }) {
  const [districtFilter, setDistrictFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [optimizeBy, setOptimizeBy] = useState('time'); // 'time' | 'distance'
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [recent, setRecent] = useState([]);
  const [addrQuery, setAddrQuery] = useState('');
  const [addrResults, setAddrResults] = useState([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [addrError, setAddrError] = useState('');
  const [addrChosenLabel, setAddrChosenLabel] = useState('');
  const [isSmall, setIsSmall] = useState(() => typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDistrictFilter('All');
      setSearch('');
      setOptimizeBy('time');
      setSelectedKeys(new Set());
      setSuggestOpen(false);
    }
  }, [isOpen]);

  // Load recent selections from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('zp_recent_temples');
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, [isOpen]);

  // Lock body scroll when modal open to prevent background (map) scroll
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Watch viewport to switch between table and card list for small screens
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = (e) => setIsSmall(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const districts = useMemo(() => ['All', ...data.map((d) => d.district)], [data]);

  const templesFlat = useMemo(() => {
    const list = [];
    data.forEach((d, dIdx) => {
      d.temples.forEach((t, tIdx) => {
        list.push({
          key: `${dIdx}:${tIdx}`,
          district: d.district,
          name: t.name,
          details: t.details,
          coordinates: t.coordinates,
        });
      });
    });
    return list;
  }, [data]);

  const filteredTemples = useMemo(() => {
    return templesFlat.filter((t) => {
      const byDistrict = districtFilter === 'All' || t.district === districtFilter;
      const q = debouncedSearch.trim().toLowerCase();
      const bySearch = !q || t.name.toLowerCase().includes(q) || t.details?.toLowerCase().includes(q);
      return byDistrict && bySearch;
    });
  }, [templesFlat, districtFilter, debouncedSearch]);

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  // Suggest list based on search
  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return templesFlat
      .filter(t => t.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [search, templesFlat]);

  const writeRecent = (templ) => {
    try {
      const r = [{ name: templ.name, district: templ.district, coordinates: templ.coordinates, key: templ.key }]
        .concat(recent.filter(x => x.key !== templ.key))
        .slice(0, 6);
      setRecent(r);
      localStorage.setItem('zp_recent_temples', JSON.stringify(r));
    } catch {}
  };

  const toggleKey = (key) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    const templ = templesFlat.find(t => t.key === key);
    if (templ) writeRecent(templ);
  };

  const selectAllFiltered = () => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      filteredTemples.forEach((t) => next.add(t.key));
      return next;
    });
  };

  const clearSelection = () => setSelectedKeys(new Set());

  const handlePlan = () => {
    const selected = templesFlat.filter((t) => selectedKeys.has(t.key));
    if (selected.length === 0) return;
    onPlan({ selectedTemples: selected, optimizeBy });
    onClose();
  };

  const doGeocode = async () => {
    const q = addrQuery.trim();
    if (!q) return;
    setAddrLoading(true);
    setAddrError('');
    setAddrResults([]);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`;
      const r = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      if (!r.ok) throw new Error('Geocoder failed');
      const j = await r.json();
      setAddrResults(j.map((it) => ({ lat: parseFloat(it.lat), lng: parseFloat(it.lon), label: it.display_name })));
    } catch (e) {
      setAddrError('Location search failed. Try a different query.');
    } finally {
      setAddrLoading(false);
    }
  };

  if (!isOpen) return null;

  const LBL = lang === 'ml'
    ? {
  filters: 'ഫിൽട്ടറുകൾ',
        district: 'ജില്ല',
        search: 'തിരയുക',
        optimizeBy: 'ഓപ്റ്റിമൈസ് ചെയ്യുക',
        time: 'സമയം (വേഗത്തിൽ)',
        distance: 'ദൂരം (ചുരുങ്ങിയത്)',
        startLoc: 'ആരംഭസ്ഥലം',
        useMyLoc: 'എന്റെ ലൊക്കേഷൻ ഉപയോഗിക്കുക',
        typeAddress: 'വിലാസം/സ്ഥലം ടൈപ്പ് ചെയ്യുക',
        searchBtn: 'തിരയുക',
        selectAll: 'ഫിൽട്ടർ ചെയ്തവ എല്ലാം തിരഞ്ഞെടുക്കുക',
        clear: 'ക്ലിയർ',
        templesShown: 'കാണുന്നത്',
        selected: 'തിരഞ്ഞെടുത്തത്',
        planRoute: 'റൂട്ട്തയ്യാർാക്കുക',
        temple: 'ക്ഷേത്രം',
        districtCol: 'ജില്ല',
        details: 'വിവരം',
        close: 'അടയ്ക്കുക',
        locationNA: 'ലൊക്കേഷൻ ലഭ്യമല്ല',
        using: 'ഉപയോഗിക്കുന്നത്',
      }
    : {
  filters: 'Filters',
        district: 'District',
        search: 'Search',
        optimizeBy: 'Optimize by',
        time: 'Time (fastest)',
        distance: 'Distance (shortest)',
        startLoc: 'Start location',
        useMyLoc: 'Use my location',
        typeAddress: 'Type address/place',
        searchBtn: 'Search',
        selectAll: 'Select all filtered',
        clear: 'Clear',
        templesShown: 'Shown',
        selected: 'selected',
        planRoute: 'Plan route',
        temple: 'Temple',
        districtCol: 'District',
        details: 'Details',
        close: 'Close',
        locationNA: 'Location not available',
        using: 'Using',
      };

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

  return (
    <Backdrop onClose={onClose}>
      <div
        className="trip-planner-modal"
        style={{
          background: '#fff',
          width: 'min(900px, 96vw)',
          height: 'min(90vh, 100dvh - 32px)',
          maxHeight: 'min(90vh, 100dvh - 32px)',
          borderRadius: 8,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontSize: lang === 'ml' ? '0.95rem' : '1rem',
        }}
      >
        <div style={{ padding: '12px 16px', background: '#E68057', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{lang === 'ml' ? 'നിങ്ങളുടെ ക്ഷേത്ര യാത്ര പ്ലാൻ ചെയ്യുക' : 'Plan your temple trip'}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>

  <div
    className="tp-body"
    style={{
      padding: 16,
      display: isSmall ? 'flex' : 'grid',
      flexDirection: isSmall ? 'column' : undefined,
      gap: 16,
      overflow: 'hidden',
      flex: 1,
      minHeight: 0,
      gridTemplateColumns: isSmall ? undefined : '260px 1fr',
    }}
  >
          {!isSmall && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ fontWeight: 600 }}>{LBL.district}</label>
              <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} style={{ padding: 8 }}>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <label style={{ fontWeight: 600 }}>{LBL.search}</label>
              <div style={{ position: 'relative' }}>
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setSuggestOpen(true); }}
                  onFocus={() => setSuggestOpen(true)}
                  placeholder={lang === 'ml' ? 'ക്ഷേത്രം/വിവരം' : 'Temple name or details'}
                  style={{ padding: 8, width: '100%' }}
                />
                {suggestOpen && (suggestions.length > 0 || (!search && recent.length > 0)) && (
                  <div className="fade-slide-in" style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#fff', border: '1px solid #eee', borderRadius: 6, boxShadow: '0 8px 20px rgba(0,0,0,0.08)', zIndex: 5, maxHeight: 220, overflow: 'auto' }}>
                    {search && suggestions.length > 0 && suggestions.map(s => (
                      <div key={s.key} style={{ padding: '8px 10px', cursor: 'pointer' }} onMouseDown={() => { toggleKey(s.key); setSuggestOpen(false); }}>
                        {lang === 'ml' ? toMlName(s.name) : s.name} <span style={{ color: '#666', fontSize: 12 }}>• {lang === 'ml' ? toMlDistrict(s.district) : s.district}</span>
                      </div>
                    ))}
                    {!search && recent.length > 0 && (
                      <div style={{ padding: '6px 10px', fontSize: 12, color: '#666' }}>{lang === 'ml' ? 'ഇപ്പോൾ തിരഞ്ഞെടുത്തത്' : 'Recent selections'}</div>
                    )}
                    {!search && recent.map(r => (
                      <div key={r.key} style={{ padding: '8px 10px', cursor: 'pointer' }} onMouseDown={() => { toggleKey(r.key); setSuggestOpen(false); }}>
                        {lang === 'ml' ? toMlName(r.name) : r.name} <span style={{ color: '#666', fontSize: 12 }}>• {lang === 'ml' ? toMlDistrict(r.district) : r.district}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label style={{ fontWeight: 600 }}>{LBL.optimizeBy}</label>
              <div>
                <label style={{ marginRight: 12 }}>
                  <input type="radio" name="opt" checked={optimizeBy === 'time'} onChange={() => setOptimizeBy('time')} /> {LBL.time}
                </label>
                <label>
                  <input type="radio" name="opt" checked={optimizeBy === 'distance'} onChange={() => setOptimizeBy('distance')} /> {LBL.distance}
                </label>
              </div>

              <div style={{ marginTop: 8, padding: 8, border: '1px solid #eee', borderRadius: 6 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{LBL.startLoc}</div>
                {hasLocation ? (
                  <div style={{ color: '#2e7d32' }}>{lang === 'ml' ? 'നിങ്ങളുടെ ലൊക്കേഷൻ സജ്ജമാണ്' : 'Your current location is set.'}</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ color: '#a2574f' }}>{LBL.locationNA}.</div>
                    <button onClick={onRequestLocation} style={{ background: '#a2574f', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}>{LBL.useMyLoc}</button>
                  </div>
                )}
                <div style={{ marginTop: 8 }}>
                  <div style={{ marginBottom: 6, fontWeight: 600 }}>{LBL.typeAddress}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input value={addrQuery} onChange={(e) => setAddrQuery(e.target.value)} placeholder={LBL.typeAddress} style={{ flex: 1, padding: 8 }} />
                    <button onClick={doGeocode} style={{ background: '#E68057', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}>{addrLoading ? (lang === 'ml' ? 'തിരയുന്നു…' : 'Searching…') : LBL.searchBtn}</button>
                  </div>
                  {addrError && <div style={{ color: '#b71c1c', marginTop: 6 }}>{addrError}</div>}
                  {addrChosenLabel && <div style={{ color: '#2e7d32', marginTop: 6 }}>{LBL.using}: {addrChosenLabel}</div>}
                  {addrResults.length > 0 && (
                    <div style={{ marginTop: 8, border: '1px solid #eee', borderRadius: 6, maxHeight: 140, overflow: 'auto' }}>
                      {addrResults.map((r, idx) => (
                        <div key={idx} style={{ padding: 8, cursor: 'pointer' }}
                          onClick={() => { onSetStartLocation?.({ lat: r.lat, lng: r.lng }); setAddrChosenLabel(r.label); setAddrResults([]); }}
                          onKeyDown={() => {}}
                          tabIndex={0}
                        >
                          {r.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={selectAllFiltered} style={{ background: '#eee', border: '1px solid #ccc', padding: '6px 8px', borderRadius: 4, cursor: 'pointer' }}>{LBL.selectAll}</button>
                <button onClick={clearSelection} style={{ background: '#eee', border: '1px solid #ccc', padding: '6px 8px', borderRadius: 4, cursor: 'pointer' }}>{LBL.clear}</button>
              </div>
            </div>
          )}

          {isSmall && (
            <div style={{ border: '1px solid #eee', borderRadius: 6, overflow: 'hidden' }}>
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                style={{ width: '100%', textAlign: 'left', background: '#E68057', color: '#fff', border: 'none', padding: '10px 12px', cursor: 'pointer', fontWeight: 600 }}
              >
                {LBL.filters}
              </button>
              {filtersOpen && (
                <div
                  style={{ padding: 12, background: '#f9f9f9', maxHeight: '35vh', overflow: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onScroll={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label style={{ fontWeight: 600 }}>{LBL.district}</label>
                    <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} style={{ padding: 8 }}>
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>

                    <label style={{ fontWeight: 600 }}>{LBL.search}</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setSuggestOpen(true); }}
                        onFocus={() => setSuggestOpen(true)}
                        placeholder={lang === 'ml' ? 'ക്ഷേത്രം/വിവരം' : 'Temple name or details'}
                        style={{ padding: 8, width: '100%' }}
                      />
                      {suggestOpen && (suggestions.length > 0 || (!search && recent.length > 0)) && (
                        <div className="fade-slide-in" style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#fff', border: '1px solid #eee', borderRadius: 6, boxShadow: '0 8px 20px rgba(0,0,0,0.08)', zIndex: 5, maxHeight: 220, overflow: 'auto' }}>
                          {search && suggestions.length > 0 && suggestions.map(s => (
                            <div key={s.key} style={{ padding: '8px 10px', cursor: 'pointer' }} onMouseDown={() => { toggleKey(s.key); setSuggestOpen(false); }}>
                              {lang === 'ml' ? toMlName(s.name) : s.name} <span style={{ color: '#666', fontSize: 12 }}>• {lang === 'ml' ? toMlDistrict(s.district) : s.district}</span>
                            </div>
                          ))}
                          {!search && recent.length > 0 && (
                            <div style={{ padding: '6px 10px', fontSize: 12, color: '#666' }}>{lang === 'ml' ? 'ഇപ്പോൾ തിരഞ്ഞെടുത്തത്' : 'Recent selections'}</div>
                          )}
                          {!search && recent.map(r => (
                            <div key={r.key} style={{ padding: '8px 10px', cursor: 'pointer' }} onMouseDown={() => { toggleKey(r.key); setSuggestOpen(false); }}>
                              {lang === 'ml' ? toMlName(r.name) : r.name} <span style={{ color: '#666', fontSize: 12 }}>• {lang === 'ml' ? toMlDistrict(r.district) : r.district}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <label style={{ fontWeight: 600 }}>{LBL.optimizeBy}</label>
                    <div>
                      <label style={{ marginRight: 12 }}>
                        <input type="radio" name="opt" checked={optimizeBy === 'time'} onChange={() => setOptimizeBy('time')} /> {LBL.time}
                      </label>
                      <label>
                        <input type="radio" name="opt" checked={optimizeBy === 'distance'} onChange={() => setOptimizeBy('distance')} /> {LBL.distance}
                      </label>
                    </div>

                    <div style={{ marginTop: 8, padding: 8, border: '1px solid #eee', borderRadius: 6 }}>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>{LBL.startLoc}</div>
                      {hasLocation ? (
                        <div style={{ color: '#2e7d32' }}>{lang === 'ml' ? 'നിങ്ങളുടെ ലൊക്കേഷൻ സജ്ജമാണ്' : 'Your current location is set.'}</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{ color: '#a2574f' }}>{LBL.locationNA}.</div>
                          <button onClick={onRequestLocation} style={{ background: '#a2574f', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}>{LBL.useMyLoc}</button>
                        </div>
                      )}
                      <div style={{ marginTop: 8 }}>
                        <div style={{ marginBottom: 6, fontWeight: 600 }}>{LBL.typeAddress}</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input value={addrQuery} onChange={(e) => setAddrQuery(e.target.value)} placeholder={LBL.typeAddress} style={{ flex: 1, padding: 8 }} />
                          <button onClick={doGeocode} style={{ background: '#E68057', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}>{addrLoading ? (lang === 'ml' ? 'തിരയുന്നു…' : 'Searching…') : LBL.searchBtn}</button>
                        </div>
                        {addrError && <div style={{ color: '#b71c1c', marginTop: 6 }}>{addrError}</div>}
                        {addrChosenLabel && <div style={{ color: '#2e7d32', marginTop: 6 }}>{LBL.using}: {addrChosenLabel}</div>}
                        {addrResults.length > 0 && (
                          <div style={{ marginTop: 8, border: '1px solid #eee', borderRadius: 6, maxHeight: 140, overflow: 'auto' }}>
                            {addrResults.map((r, idx) => (
                              <div key={idx} style={{ padding: 8, cursor: 'pointer' }}
                                onClick={() => { onSetStartLocation?.({ lat: r.lat, lng: r.lng }); setAddrChosenLabel(r.label); setAddrResults([]); }}
                                onKeyDown={() => {}}
                                tabIndex={0}
                              >
                                {r.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={selectAllFiltered} style={{ background: '#eee', border: '1px solid #ccc', padding: '6px 8px', borderRadius: 4, cursor: 'pointer' }}>{LBL.selectAll}</button>
                      <button onClick={clearSelection} style={{ background: '#eee', border: '1px solid #ccc', padding: '6px 8px', borderRadius: 4, cursor: 'pointer' }}>{LBL.clear}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minHeight: 0 }}>
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><strong>{filteredTemples.length}</strong> {LBL.templesShown} • <strong>{selectedKeys.size}</strong> {LBL.selected}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  disabled={!hasLocation || selectedKeys.size === 0}
                  onClick={handlePlan}
                  style={{ background: hasLocation && selectedKeys.size > 0 ? '#E68057' : '#ccc', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: hasLocation && selectedKeys.size > 0 ? 'pointer' : 'not-allowed' }}
                >
                  {LBL.planRoute}
                </button>
              </div>
            </div>
            <div
              className="table-wrap"
              style={{ overflow: 'auto', border: '1px solid #eee', borderRadius: 6, flex: 1, minHeight: 0, overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onScroll={(e) => e.stopPropagation()}
            >
              {!isSmall ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#fafafa' }}>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}></th>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>{LBL.temple}</th>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>{LBL.districtCol}</th>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>{LBL.details}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTemples.map((t) => (
                      <tr key={t.key}>
                        <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>
                          <input type="checkbox" checked={selectedKeys.has(t.key)} onChange={() => toggleKey(t.key)} />
                        </td>
                        <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>{lang === 'ml' ? toMlName(t.name) : t.name}</td>
                        <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>{lang === 'ml' ? toMlDistrict(t.district) : t.district}</td>
                        <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3', color: '#555' }}>{lang === 'ml' ? toMlDetails(t.details) : t.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {filteredTemples.map((t) => (
                    <label key={t.key} style={{ display: 'block', padding: 12, borderBottom: '1px solid #f3f3f3', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <input
                          type="checkbox"
                          checked={selectedKeys.has(t.key)}
                          onChange={() => toggleKey(t.key)}
                          style={{ marginTop: 2 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{lang === 'ml' ? toMlName(t.name) : t.name}</div>
                          <div style={{ marginTop: 2, fontSize: 12, color: '#666' }}>{lang === 'ml' ? toMlDistrict(t.district) : t.district}</div>
                          {t.details && (
                            <div style={{ marginTop: 6, fontSize: 12, color: '#555', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                              {lang === 'ml' ? toMlDetails(t.details) : t.details}
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ background: '#eee', border: '1px solid #ccc', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}>{LBL.close}</button>
          <button
            disabled={!hasLocation || selectedKeys.size === 0}
            onClick={handlePlan}
            style={{ background: hasLocation && selectedKeys.size > 0 ? '#E68057' : '#ccc', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: hasLocation && selectedKeys.size > 0 ? 'pointer' : 'not-allowed' }}
          >
            {LBL.planRoute}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}
