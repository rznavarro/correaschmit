// ─── TWEAKS PANEL (inlined) ───────────────────────────────────
const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.88);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);width:22px;height:22px;border-radius:6px;cursor:pointer;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;overflow-x:hidden;min-height:0}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:pointer}
  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);transition:left .15s,width .15s}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;border-radius:6px;cursor:pointer;padding:4px 6px;line-height:1.2}
  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;background:rgba(0,0,0,.15);transition:background .15s;cursor:pointer;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}
  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:pointer;background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
`;
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
  }, []);
  return {
    tweaks: values,
    setTweak
  };
}
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  React.useEffect(() => {
    const onMsg = e => {
      if (e?.data?.type === '__activate_edit_mode') setOpen(true);else if (e?.data?.type === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      panel.style.right = offsetRef.current.x + 'px';
      panel.style.bottom = offsetRef.current.y + 'px';
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}
function TweakSection({
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label);
}
function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgba(41,38,27,.5)'
    }
  }, value, unit)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakColor({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
    type: "color",
    className: "twk-swatch",
    value: value,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("div", {
    className: "twk-seg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    onClick: () => onChange(o.value)
  }, o.label))));
}

// ─── END TWEAKS PANEL ─────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "glass-dark",
  "accentColor": "#1a9fd4",
  "heroLayout": "bottom",
  "showParticles": true,
  "videoFilter": "0.55"
} /*EDITMODE-END*/;

// ─── SVG ICONS ───────────────────────────────────────────────
const IconSearch = () => /*#__PURE__*/React.createElement("svg", {
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "11",
  cy: "11",
  r: "8"
}), /*#__PURE__*/React.createElement("path", {
  d: "m21 21-4.3-4.3"
}));
const IconBed = () => /*#__PURE__*/React.createElement("svg", {
  width: "14",
  height: "14",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M2 4v16"
}), /*#__PURE__*/React.createElement("path", {
  d: "M2 8h18a2 2 0 0 1 2 2v10"
}), /*#__PURE__*/React.createElement("path", {
  d: "M2 17h20"
}), /*#__PURE__*/React.createElement("path", {
  d: "M6 8v9"
}));
const IconBath = () => /*#__PURE__*/React.createElement("svg", {
  width: "14",
  height: "14",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"
}), /*#__PURE__*/React.createElement("line", {
  x1: "10",
  x2: "8",
  y1: "5",
  y2: "7"
}), /*#__PURE__*/React.createElement("line", {
  x1: "2",
  x2: "22",
  y1: "12",
  y2: "12"
}));
const IconArea = () => /*#__PURE__*/React.createElement("svg", {
  width: "14",
  height: "14",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4"
}), /*#__PURE__*/React.createElement("rect", {
  width: "10",
  height: "7",
  x: "12",
  y: "13",
  rx: "2"
}));
const IconPin = () => /*#__PURE__*/React.createElement("svg", {
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "10",
  r: "3"
}));
const IconPhone = () => /*#__PURE__*/React.createElement("svg", {
  width: "18",
  height: "18",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.64 4.9 2 2 0 0 1 3.62 2.7h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.06 6.06l1.41-1.41a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
}));
const IconMail = () => /*#__PURE__*/React.createElement("svg", {
  width: "18",
  height: "18",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("rect", {
  width: "20",
  height: "16",
  x: "2",
  y: "4",
  rx: "2"
}), /*#__PURE__*/React.createElement("path", {
  d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
}));
const IconMapPin = () => /*#__PURE__*/React.createElement("svg", {
  width: "18",
  height: "18",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "10",
  r: "3"
}));
const IconArrow = () => /*#__PURE__*/React.createElement("svg", {
  width: "14",
  height: "14",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M5 12h14"
}), /*#__PURE__*/React.createElement("path", {
  d: "m12 5 7 7-7 7"
}));
const IconCalc = () => /*#__PURE__*/React.createElement("svg", {
  width: "22",
  height: "22",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("rect", {
  width: "16",
  height: "20",
  x: "4",
  y: "2",
  rx: "2"
}), /*#__PURE__*/React.createElement("line", {
  x1: "8",
  x2: "16",
  y1: "6",
  y2: "6"
}), /*#__PURE__*/React.createElement("line", {
  x1: "16",
  x2: "16",
  y1: "14",
  y2: "18"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16 10h.01"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 10h.01"
}), /*#__PURE__*/React.createElement("path", {
  d: "M8 10h.01"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 14h.01"
}), /*#__PURE__*/React.createElement("path", {
  d: "M8 14h.01"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 18h.01"
}), /*#__PURE__*/React.createElement("path", {
  d: "M8 18h.01"
}));

// ─── NAVBAR ───────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => {
    let ticking = false;
    const fn = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', fn, {
      passive: true
    });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return /*#__PURE__*/React.createElement("nav", {
    className: `navbar ${scrolled ? 'scrolled' : ''}`
  }, /*#__PURE__*/React.createElement("a", {
    href: "#inicio",
    className: "nav-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "uploads/logo_file-1777688829873.jpg",
    alt: "Correa Schmidt"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nav-logo-text"
  }, "Correa/Schmidt"), /*#__PURE__*/React.createElement("div", {
    className: "nav-logo-sub"
  }, "Propiedades"))), /*#__PURE__*/React.createElement("div", {
    className: "nav-links",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }
  }, ['Inicio', 'Propiedades', 'Servicios', 'Calculadora', 'Contacto'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: `#${l.toLowerCase()}`
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://www.instagram.com/correa_schmidt_propiedades/",
    target: "_blank",
    style: {
      color: 'rgba(255,255,255,0.7)',
      textDecoration: 'none',
      fontSize: '13px',
      transition: 'color 0.2s'
    },
    onMouseEnter: e => e.target.style.color = '#fff',
    onMouseLeave: e => e.target.style.color = 'rgba(255,255,255,0.7)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
  }))), /*#__PURE__*/React.createElement("a", {
    href: "https://api.whatsapp.com/send/?phone=56934423638&text&type=phone_number&app_absent=0",
    target: "_blank",
    className: "nav-cta"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  })), "Contactar")));
};

// ─── HERO ─────────────────────────────────────────────────────
const Hero = ({
  tweaks
}) => {
  const [activeTab, setActiveTab] = React.useState('Venta');
  const [region, setRegion] = React.useState('');
  const [tipo, setTipo] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);
  const tabs = ['Venta', 'Arriendo', 'Proyecto'];
  return /*#__PURE__*/React.createElement("section", {
    id: "inicio",
    className: "hero",
    style: {
      position: 'relative',
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-content",
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(24px)',
      transition: 'opacity 0.9s ease, transform 0.9s ease'
    }
  }, /*#__PURE__*/React.createElement("h1", null, "De tu propiedad", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "nos ocupamos nosotras.")), /*#__PURE__*/React.createElement("p", {
    className: "hero-sub"
  }, "Correa & Schmidt Propiedades \u2014 expertos en ventas, arriendos y administraci\xF3n inmobiliaria en Rancagua y todo Chile."), /*#__PURE__*/React.createElement("div", {
    className: "hero-buttons"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#propiedades",
    className: "btn-primary"
  }, "Ver Propiedades ", /*#__PURE__*/React.createElement(IconArrow, null)), /*#__PURE__*/React.createElement("a", {
    href: "#contacto",
    className: "btn-glass"
  }, "Hablar con un asesor")), /*#__PURE__*/React.createElement("div", {
    className: "hero-search glass-strong"
  }, /*#__PURE__*/React.createElement("div", {
    className: "search-tabs"
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    className: `search-tab ${activeTab === t ? 'active' : ''}`,
    onClick: () => setActiveTab(t)
  }, t))), /*#__PURE__*/React.createElement("div", {
    className: "search-row"
  }, /*#__PURE__*/React.createElement("select", {
    className: "search-select",
    value: tipo,
    onChange: e => setTipo(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Tipo de propiedad"), /*#__PURE__*/React.createElement("option", null, "Casa"), /*#__PURE__*/React.createElement("option", null, "Departamento"), /*#__PURE__*/React.createElement("option", null, "Parcela"), /*#__PURE__*/React.createElement("option", null, "Terreno"), /*#__PURE__*/React.createElement("option", null, "Oficina"), /*#__PURE__*/React.createElement("option", null, "Local Comercial")), /*#__PURE__*/React.createElement("select", {
    className: "search-select",
    value: region,
    onChange: e => setRegion(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Regi\xF3n"), /*#__PURE__*/React.createElement("option", null, "Regi\xF3n Metropolitana"), /*#__PURE__*/React.createElement("option", null, "O'Higgins"), /*#__PURE__*/React.createElement("option", null, "Los Lagos"), /*#__PURE__*/React.createElement("option", null, "Valpara\xEDso"), /*#__PURE__*/React.createElement("option", null, "Biob\xEDo"), /*#__PURE__*/React.createElement("option", null, "Maule")), /*#__PURE__*/React.createElement("select", {
    className: "search-select"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Comuna"), /*#__PURE__*/React.createElement("option", null, "Rancagua"), /*#__PURE__*/React.createElement("option", null, "Machal\xED"), /*#__PURE__*/React.createElement("option", null, "Puerto Varas"), /*#__PURE__*/React.createElement("option", null, "Santiago"), /*#__PURE__*/React.createElement("option", null, "Las Condes")), /*#__PURE__*/React.createElement("select", {
    className: "search-select"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Precio m\xE1x."), /*#__PURE__*/React.createElement("option", null, "Hasta UF 2.000"), /*#__PURE__*/React.createElement("option", null, "Hasta UF 5.000"), /*#__PURE__*/React.createElement("option", null, "Hasta UF 10.000"), /*#__PURE__*/React.createElement("option", null, "Hasta UF 20.000"), /*#__PURE__*/React.createElement("option", null, "Sin l\xEDmite")), /*#__PURE__*/React.createElement("button", {
    className: "btn-search"
  }, /*#__PURE__*/React.createElement(IconSearch, null), " Buscar")))));
};

// ─── STATS ────────────────────────────────────────────────────
const StatsBar = () => {
  const stats = [{
    num: '+1.700',
    label: 'Seguidores en Instagram'
  }, {
    num: '+318',
    label: 'Publicaciones activas'
  }, {
    num: '+15',
    label: 'Años de experiencia'
  }, {
    num: '100%',
    label: 'Compromiso con el cliente'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 48px',
      position: 'relative',
      zIndex: 10,
      marginTop: '-20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "stats-bar"
  }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "stat-item fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-number"
  }, s.num), /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, s.label)))));
};

// ─── PROPIEDADES ──────────────────────────────────────────────
const propiedadesData = [{
  title: 'Casa en Rancagua',
  location: 'Barrio San Damián, Rancagua',
  precio: 'UF 13.400',
  tipo: 'Venta',
  cod: 'Cód: 32.389',
  dorms: 4,
  banos: 4,
  area: '176 / 518 m²',
  img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80'
}, {
  title: 'Casa en Machalí',
  location: 'Machalí, El Romeral, Rancagua',
  precio: 'UF 4.050',
  tipo: 'Arriendo',
  arrPrecio: '$750.000',
  cod: 'Cód: 35.341',
  dorms: 3,
  banos: 3,
  area: '71 / 167 m²',
  img: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&q=80'
}, {
  title: 'Casa en Puerto Varas',
  location: 'Los Lagos, Puerto Varas',
  precio: 'UF 7.400',
  tipo: 'Venta',
  cod: 'Cód: 31.686',
  dorms: 3,
  banos: 2,
  area: '147 / 79 m²',
  img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80'
}, {
  title: 'Departamento en Rancagua',
  location: 'Centro, Rancagua',
  precio: 'UF 2.850',
  tipo: 'Venta',
  cod: 'Cód: 33.100',
  dorms: 2,
  banos: 2,
  area: '58 / 0 m²',
  img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'
}];
const PropCard = ({
  prop
}) => {
  const [hov, setHov] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "prop-card glass",
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "prop-img-wrap"
  }, /*#__PURE__*/React.createElement("img", {
    className: "prop-card-img",
    src: prop.img,
    alt: prop.title,
    style: {
      transform: hov ? 'scale(1.04)' : 'scale(1)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: `prop-badge ${prop.tipo === 'Venta' ? 'badge-venta' : 'badge-arriendo'}`
  }, prop.tipo), /*#__PURE__*/React.createElement("span", {
    className: "prop-price"
  }, prop.precio), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '14px',
      right: '14px',
      fontSize: '10px',
      background: 'rgba(0,0,0,0.5)',
      padding: '3px 8px',
      borderRadius: '100px',
      color: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(6px)'
    }
  }, prop.cod)), /*#__PURE__*/React.createElement("div", {
    className: "prop-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prop-title"
  }, prop.title), /*#__PURE__*/React.createElement("div", {
    className: "prop-loc"
  }, /*#__PURE__*/React.createElement(IconPin, null), " ", prop.location), prop.dorms > 0 && /*#__PURE__*/React.createElement("div", {
    className: "prop-specs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "prop-spec"
  }, /*#__PURE__*/React.createElement(IconBed, null), " ", prop.dorms, " dorm."), /*#__PURE__*/React.createElement("span", {
    className: "prop-spec"
  }, /*#__PURE__*/React.createElement(IconBath, null), " ", prop.banos, " ba\xF1os"), /*#__PURE__*/React.createElement("span", {
    className: "prop-spec"
  }, /*#__PURE__*/React.createElement(IconArea, null), " ", prop.area)), /*#__PURE__*/React.createElement("div", {
    className: "prop-footer"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: 'rgba(255,255,255,0.4)'
    }
  }, "Correa & Schmidt"), /*#__PURE__*/React.createElement("button", {
    className: "btn-ficha"
  }, "Ficha ", /*#__PURE__*/React.createElement(IconArrow, null)))));
};
const Propiedades = () => /*#__PURE__*/React.createElement("section", {
  id: "propiedades",
  className: "dark-section fade-up"
}, /*#__PURE__*/React.createElement("div", {
  className: "section-label"
}, "Portafolio"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '12px',
    flexWrap: 'wrap',
    gap: '16px'
  }
}, /*#__PURE__*/React.createElement("h2", {
  className: "section-title",
  style: {
    marginBottom: 0
  }
}, "Propiedades ", /*#__PURE__*/React.createElement("em", null, "Destacadas")), /*#__PURE__*/React.createElement("button", {
  className: "btn-glass",
  style: {
    fontSize: '13px',
    padding: '10px 24px',
    flexShrink: 0
  }
}, "Ver todas ", /*#__PURE__*/React.createElement(IconArrow, null))), /*#__PURE__*/React.createElement("p", {
  className: "section-sub"
}, "Las mejores propiedades de Rancagua y todo Chile, seleccionadas por nuestro equipo."), /*#__PURE__*/React.createElement("div", {
  className: "props-grid"
}, propiedadesData.map((p, i) => /*#__PURE__*/React.createElement(PropCard, {
  key: i,
  prop: p
}))));

// ─── SERVICIOS ────────────────────────────────────────────────
const Servicios = () => {
  const svcs = [{
    icon: '🏠',
    title: 'Venta',
    desc: 'Comercializamos tu propiedad con la mayor difusión del mercado, garantizando el mejor precio y proceso transparente.'
  }, {
    icon: '🔑',
    title: 'Arriendo',
    desc: 'Gestionamos el arriendo de tu propiedad de forma integral, desde la búsqueda del arrendatario hasta la firma del contrato.'
  }, {
    icon: '📋',
    title: 'Administración',
    desc: 'Administramos tu patrimonio inmobiliario con dedicación y seriedad, maximizando tu retorno mes a mes.'
  }, {
    icon: '📐',
    title: 'Arquitectura',
    desc: 'Servicios de diseño y arquitectura para remodelar, ampliar o proyectar tu propiedad con los mejores profesionales.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "servicios",
    className: "light-section fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label"
  }, "Qu\xE9 hacemos"), /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Nuestros ", /*#__PURE__*/React.createElement("em", null, "Servicios")), /*#__PURE__*/React.createElement("p", {
    className: "section-sub"
  }, "Un equipo especializado que acompa\xF1a cada etapa de tu proyecto inmobiliario."), /*#__PURE__*/React.createElement("div", {
    className: "services-grid"
  }, svcs.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "service-card glass"
  }, /*#__PURE__*/React.createElement("div", {
    className: "service-icon"
  }, s.icon), /*#__PURE__*/React.createElement("div", {
    className: "service-title"
  }, s.title), /*#__PURE__*/React.createElement("div", {
    className: "service-desc"
  }, s.desc)))));
};

// ─── CALCULADORA ──────────────────────────────────────────────
const Calculadora = () => {
  const [precioUF, setPrecioUF] = React.useState(5000);
  const [piePorc, setPiePorc] = React.useState(20);
  const [plazo, setPlazo] = React.useState(20);
  const [tasa, setTasa] = React.useState(4.5);
  const UFhoy = 38200;
  const precioClp = Math.round(precioUF * UFhoy);
  const pieUF = Math.round(precioUF * piePorc / 100);
  const montoUF = precioUF - pieUF;
  const montoCLP = montoUF * UFhoy;
  const tasaMensual = tasa / 100 / 12;
  const nMeses = plazo * 12;
  const cuota = Math.round(montoCLP * tasaMensual * Math.pow(1 + tasaMensual, nMeses) / (Math.pow(1 + tasaMensual, nMeses) - 1));
  const cuotaUF = (cuota / UFhoy).toFixed(1);
  const fmt = n => n.toLocaleString('es-CL');
  return /*#__PURE__*/React.createElement("section", {
    id: "calculadora",
    className: "dark-section fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label"
  }, "Herramientas"), /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Calculadora ", /*#__PURE__*/React.createElement("em", null, "Hipotecaria")), /*#__PURE__*/React.createElement("p", {
    className: "section-sub"
  }, "Estima la cuota mensual de tu cr\xE9dito hipotecario de forma r\xE1pida y sencilla."), /*#__PURE__*/React.createElement("div", {
    className: "calc-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "calc-panel glass-strong"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: 'rgba(26,159,212,0.15)',
      border: '1px solid rgba(26,159,212,0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(IconCalc, null)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      fontSize: '16px'
    }
  }, "Simulador de Cr\xE9dito")), /*#__PURE__*/React.createElement("div", {
    className: "calc-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "calc-label"
  }, "Precio propiedad (UF): ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--blue-light)'
    }
  }, fmt(precioUF), " UF")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "calc-range",
    min: "500",
    max: "30000",
    step: "100",
    value: precioUF,
    onChange: e => setPrecioUF(+e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "calc-input",
    value: precioUF,
    onChange: e => setPrecioUF(+e.target.value),
    style: {
      marginTop: '8px'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "calc-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "calc-label"
  }, "Pie: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--blue-light)'
    }
  }, piePorc, "% (", fmt(pieUF), " UF)")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "calc-range",
    min: "10",
    max: "50",
    step: "1",
    value: piePorc,
    onChange: e => setPiePorc(+e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "calc-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "calc-label"
  }, "Plazo: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--blue-light)'
    }
  }, plazo, " a\xF1os")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "calc-range",
    min: "5",
    max: "30",
    step: "1",
    value: plazo,
    onChange: e => setPlazo(+e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "calc-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "calc-label"
  }, "Tasa anual: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--blue-light)'
    }
  }, tasa, "%")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "calc-range",
    min: "2",
    max: "10",
    step: "0.1",
    value: tasa,
    onChange: e => setTasa(+e.target.value)
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "calc-result-box glass-blue",
    style: {
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "calc-result-label"
  }, "Cuota mensual estimada"), /*#__PURE__*/React.createElement("div", {
    className: "calc-result-value"
  }, "$", fmt(cuota)), /*#__PURE__*/React.createElement("div", {
    className: "calc-result-sub"
  }, "\u2248 ", cuotaUF, " UF / mes \xB7 Tasa ", tasa, "% anual")), /*#__PURE__*/React.createElement("div", {
    className: "calc-result-box glass-strong"
  }, /*#__PURE__*/React.createElement("div", {
    className: "calc-breakdown"
  }, /*#__PURE__*/React.createElement("div", {
    className: "calc-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "calc-row-label"
  }, "Valor propiedad"), /*#__PURE__*/React.createElement("span", {
    className: "calc-row-value"
  }, fmt(precioUF), " UF ", /*#__PURE__*/React.createElement("small", {
    style: {
      color: 'rgba(255,255,255,0.4)',
      fontSize: '11px'
    }
  }, "~$", fmt(precioClp)))), /*#__PURE__*/React.createElement("div", {
    className: "calc-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "calc-row-label"
  }, "Pie (", piePorc, "%)"), /*#__PURE__*/React.createElement("span", {
    className: "calc-row-value"
  }, fmt(pieUF), " UF")), /*#__PURE__*/React.createElement("div", {
    className: "calc-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "calc-row-label"
  }, "Monto a financiar"), /*#__PURE__*/React.createElement("span", {
    className: "calc-row-value"
  }, fmt(montoUF), " UF")), /*#__PURE__*/React.createElement("div", {
    className: "calc-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "calc-row-label"
  }, "Plazo"), /*#__PURE__*/React.createElement("span", {
    className: "calc-row-value"
  }, plazo, " a\xF1os (", plazo * 12, " cuotas)")), /*#__PURE__*/React.createElement("div", {
    className: "calc-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "calc-row-label"
  }, "UF referencial"), /*#__PURE__*/React.createElement("span", {
    className: "calc-row-value"
  }, "$", fmt(UFhoy)))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '11px',
      color: 'rgba(255,255,255,0.3)',
      lineHeight: '1.6',
      marginTop: '8px'
    }
  }, "*Simulaci\xF3n referencial. No considera seguros, gastos operacionales ni impuestos. Consulta con tu ejecutivo bancario.")))));
};

// ─── MAPA ─────────────────────────────────────────────────────
const loadLeaflet = () => new Promise(resolve => {
  if (window.L) {
    resolve();
    return;
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = resolve;
  document.head.appendChild(script);
});
const initMap = () => {
  const map = L.map('map', {
    zoomControl: true
  }).setView([-34.1703, -70.7444], 12);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);
  const blueIcon = L.divIcon({
    className: '',
    html: `<div style="background:rgba(26,159,212,0.9);width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid rgba(255,255,255,0.8);box-shadow:0 4px 12px rgba(0,0,0,0.4)"><div style="transform:rotate(45deg);display:flex;align-items:center;justify-content:center;height:100%;font-size:14px">🏠</div></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  });
  const props = [{
    pos: [-34.1703, -70.7444],
    title: 'Casa en Rancagua',
    precio: 'UF 13.400',
    tipo: 'Venta'
  }, {
    pos: [-34.1800, -70.6900],
    title: 'Casa en Machalí',
    precio: '$750.000',
    tipo: 'Arriendo'
  }, {
    pos: [-41.3187, -72.9819],
    title: 'Casa en Puerto Varas',
    precio: 'UF 7.400',
    tipo: 'Venta'
  }, {
    pos: [-34.1650, -70.7300],
    title: 'Depto. Rancagua',
    precio: 'UF 2.850',
    tipo: 'Venta'
  }, {
    pos: [-34.1750, -70.7050],
    title: 'Parcela Machalí',
    precio: 'UF 6.200',
    tipo: 'Venta'
  }];
  props.forEach(p => {
    L.marker(p.pos, {
      icon: blueIcon
    }).addTo(map).bindPopup(`<div style="font-family:Poppins,sans-serif;padding:4px 0"><strong style="font-size:14px">${p.title}</strong><br><span style="color:#1a9fd4;font-weight:600">${p.precio}</span><span style="background:${p.tipo === 'Venta' ? '#1a9fd4' : '#50dc78'};color:white;font-size:10px;padding:2px 8px;border-radius:100px;margin-left:6px">${p.tipo}</span></div>`, {
      maxWidth: 200,
      className: 'map-popup'
    });
  });
  L.marker([-34.1703, -70.7650], {
    icon: L.divIcon({
      className: '',
      html: `<div style="background:rgba(26,159,212,0.95);padding:8px 14px;border-radius:8px;border:2px solid rgba(255,255,255,0.4);box-shadow:0 4px 16px rgba(0,0,0,0.4);font-family:Poppins,sans-serif;font-size:11px;font-weight:600;color:white;white-space:nowrap">📍 Oficina Correa & Schmidt</div>`,
      iconSize: [180, 34],
      iconAnchor: [90, 17]
    })
  }).addTo(map);
};
const MapaSection = () => {
  const sectionRef = React.useRef(null);
  const loaded = React.useRef(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loaded.current) {
        loaded.current = true;
        obs.disconnect();
        loadLeaflet().then(initMap);
      }
    }, {
      rootMargin: '200px'
    });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement("section", {
    id: "mapa",
    className: "light-section fade-up",
    ref: sectionRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label"
  }, "Ubicaciones"), /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Mapa de ", /*#__PURE__*/React.createElement("em", null, "Propiedades")), /*#__PURE__*/React.createElement("p", {
    className: "section-sub"
  }, "Explora nuestras propiedades disponibles en el mapa interactivo."), /*#__PURE__*/React.createElement("div", {
    id: "map-container"
  }, /*#__PURE__*/React.createElement("div", {
    id: "map"
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.3)',
      marginTop: '12px',
      textAlign: 'center'
    }
  }, "Haz clic en los marcadores para ver detalles. Oficina: Bello Horizonte 845 oficina 403, Edificio BHBC, Rancagua."));
};

// ─── CONTACTO ─────────────────────────────────────────────────
const Contacto = () => {
  const [form, setForm] = React.useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    interes: 'Venta'
  });
  const [sent, setSent] = React.useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "contacto",
    className: "dark-section fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label"
  }, "Contacto"), /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Hablemos de ", /*#__PURE__*/React.createElement("em", null, "tu propiedad")), /*#__PURE__*/React.createElement("p", {
    className: "section-sub"
  }, "Nuestro equipo de asesores est\xE1 listo para ayudarte. Escr\xEDbenos o ll\xE1manos."), /*#__PURE__*/React.createElement("div", {
    className: "contact-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact-icon",
    style: {
      color: 'var(--blue-light)'
    }
  }, /*#__PURE__*/React.createElement(IconMapPin, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "contact-item-title"
  }, "Oficina"), /*#__PURE__*/React.createElement("div", {
    className: "contact-item-value"
  }, "Bello Horizonte 845, oficina 403", /*#__PURE__*/React.createElement("br", null), "Edificio BHBC, Rancagua"))), /*#__PURE__*/React.createElement("div", {
    className: "contact-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact-icon",
    style: {
      color: 'var(--blue-light)'
    }
  }, /*#__PURE__*/React.createElement(IconMail, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "contact-item-title"
  }, "Correo"), /*#__PURE__*/React.createElement("a", {
    href: "mailto:contacto@casasrancagua.cl",
    className: "contact-item-value"
  }, "contacto@casasrancagua.cl"))), /*#__PURE__*/React.createElement("div", {
    className: "contact-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact-icon",
    style: {
      color: 'var(--blue-light)'
    }
  }, /*#__PURE__*/React.createElement(IconPhone, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "contact-item-title"
  }, "Tel\xE9fono / WhatsApp"), /*#__PURE__*/React.createElement("a", {
    href: "https://api.whatsapp.com/send/?phone=56934423638",
    target: "_blank",
    className: "contact-item-value"
  }, "+56 9 3442 3638"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label",
    style: {
      marginBottom: '16px'
    }
  }, "S\xEDguenos"), /*#__PURE__*/React.createElement("div", {
    className: "social-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://www.instagram.com/correa_schmidt_propiedades/",
    target: "_blank",
    className: "social-btn",
    title: "Instagram"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
  }))), /*#__PURE__*/React.createElement("a", {
    href: "https://api.whatsapp.com/send/?phone=56934423638",
    target: "_blank",
    className: "social-btn",
    title: "WhatsApp"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  })))))), /*#__PURE__*/React.createElement("form", {
    className: "contact-form glass-strong",
    style: {
      padding: '32px',
      borderRadius: 'var(--radius)'
    },
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "text",
    placeholder: "Nombre completo",
    value: form.nombre,
    onChange: e => setForm({
      ...form,
      nombre: e.target.value
    }),
    required: true
  }), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "email",
    placeholder: "Correo electr\xF3nico",
    value: form.email,
    onChange: e => setForm({
      ...form,
      email: e.target.value
    }),
    required: true
  })), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "tel",
    placeholder: "Tel\xE9fono / WhatsApp"
  }), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.interes,
    onChange: e => setForm({
      ...form,
      interes: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", null, "Venta"), /*#__PURE__*/React.createElement("option", null, "Arriendo"), /*#__PURE__*/React.createElement("option", null, "Administraci\xF3n"), /*#__PURE__*/React.createElement("option", null, "Arquitectura"), /*#__PURE__*/React.createElement("option", null, "Otra consulta")), /*#__PURE__*/React.createElement("textarea", {
    className: "form-input",
    rows: "4",
    placeholder: "Cu\xE9ntanos sobre tu propiedad o necesidad...",
    value: form.mensaje,
    onChange: e => setForm({
      ...form,
      mensaje: e.target.value
    })
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-primary",
    style: {
      width: '100%',
      justifyContent: 'center'
    }
  }, sent ? '✓ Mensaje enviado — te contactaremos pronto' : 'Enviar mensaje'))));
};

// ─── FOOTER ───────────────────────────────────────────────────
const Footer = () => /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("div", {
  className: "footer-grid"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '4px'
  }
}, /*#__PURE__*/React.createElement("img", {
  src: "uploads/logo_file-1777688829873.jpg",
  alt: "Logo",
  style: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    objectFit: 'cover'
  }
}), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontWeight: 600,
    letterSpacing: '0.1em',
    fontSize: '14px'
  }
}, "CORREA/SCHMIDT"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: '10px',
    letterSpacing: '0.3em',
    color: 'rgba(255,255,255,0.4)'
  }
}, "PROPIEDADES"))), /*#__PURE__*/React.createElement("p", {
  className: "footer-brand-text"
}, "La Corredora de Propiedades con mayor prestigio de la regi\xF3n. Ventas, arriendos y administraci\xF3n en Rancagua y todo Chile."), /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.25)',
    marginTop: '12px'
  }
}, /*#__PURE__*/React.createElement("a", {
  href: "http://www.casasrancagua.cl",
  style: {
    color: 'inherit',
    textDecoration: 'none'
  }
}, "www.casasrancagua.cl"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "footer-col-title"
}, "Men\xFA"), /*#__PURE__*/React.createElement("div", {
  className: "footer-links"
}, /*#__PURE__*/React.createElement("a", {
  href: "#inicio"
}, "Inicio"), /*#__PURE__*/React.createElement("a", {
  href: "#propiedades"
}, "Ventas"), /*#__PURE__*/React.createElement("a", {
  href: "#propiedades"
}, "Arriendos"), /*#__PURE__*/React.createElement("a", {
  href: "#servicios"
}, "Nosotros"), /*#__PURE__*/React.createElement("a", {
  href: "#servicios"
}, "Arquitectura"), /*#__PURE__*/React.createElement("a", {
  href: "#contacto"
}, "Contacto"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "footer-col-title"
}, "Regiones"), /*#__PURE__*/React.createElement("div", {
  className: "footer-links"
}, /*#__PURE__*/React.createElement("a", {
  href: "#"
}, "Rancagua"), /*#__PURE__*/React.createElement("a", {
  href: "#"
}, "Machal\xED"), /*#__PURE__*/React.createElement("a", {
  href: "#"
}, "Puerto Varas"), /*#__PURE__*/React.createElement("a", {
  href: "#"
}, "Santiago"), /*#__PURE__*/React.createElement("a", {
  href: "#"
}, "Zona Sur"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "footer-col-title"
}, "Contacto"), /*#__PURE__*/React.createElement("div", {
  className: "footer-links"
}, /*#__PURE__*/React.createElement("a", {
  href: "mailto:contacto@casasrancagua.cl"
}, "contacto@casasrancagua.cl"), /*#__PURE__*/React.createElement("a", {
  href: "https://api.whatsapp.com/send/?phone=56934423638",
  target: "_blank"
}, "+56 9 3442 3638"), /*#__PURE__*/React.createElement("span", {
  style: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '13px',
    lineHeight: '1.5'
  }
}, "Bello Horizonte 845, of. 403", /*#__PURE__*/React.createElement("br", null), "Edificio BHBC, Rancagua")))), /*#__PURE__*/React.createElement("div", {
  className: "footer-bottom"
}, /*#__PURE__*/React.createElement("p", {
  className: "footer-copy"
}, "\xA9 2026 \u2014 CORREA & SCHMIDT \u2014 Todos los derechos reservados."), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center'
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "social-links"
}, /*#__PURE__*/React.createElement("a", {
  href: "https://www.instagram.com/correa_schmidt_propiedades/",
  target: "_blank",
  className: "social-btn"
}, /*#__PURE__*/React.createElement("svg", {
  width: "15",
  height: "15",
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, /*#__PURE__*/React.createElement("path", {
  d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
}))), /*#__PURE__*/React.createElement("a", {
  href: "https://api.whatsapp.com/send/?phone=56934423638",
  target: "_blank",
  className: "social-btn"
}, /*#__PURE__*/React.createElement("svg", {
  width: "15",
  height: "15",
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, /*#__PURE__*/React.createElement("path", {
  d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
})))), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.25)'
  }
}, "Desarrollado con \u2764"))));

// ─── APP ──────────────────────────────────────────────────────
const App = () => {
  const {
    tweaks,
    setTweak
  } = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks to CSS vars
  React.useEffect(() => {
    document.documentElement.style.setProperty('--blue', tweaks.accentColor);
    document.documentElement.style.setProperty('--blue-dark', tweaks.accentColor);
    const vid = document.querySelector('#video-bg');
    if (vid) vid.style.filter = `brightness(${tweaks.videoFilter}) saturate(1.1)`;
  }, [tweaks.accentColor, tweaks.videoFilter]);

  // Scroll animations
  React.useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement(Hero, {
    tweaks: tweaks
  }), /*#__PURE__*/React.createElement(StatsBar, null), /*#__PURE__*/React.createElement(Propiedades, null), /*#__PURE__*/React.createElement(Servicios, null), /*#__PURE__*/React.createElement(Calculadora, null), /*#__PURE__*/React.createElement(MapaSection, null), /*#__PURE__*/React.createElement(Contacto, null), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Color de acento"
  }, /*#__PURE__*/React.createElement(TweakColor, {
    label: "Color principal",
    value: tweaks.accentColor,
    onChange: v => setTweak('accentColor', v)
  })), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Variaciones de estilo"
  }, /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Tema",
    value: tweaks.theme,
    onChange: v => setTweak('theme', v),
    options: [{
      value: 'glass-dark',
      label: 'Dark Glass'
    }, {
      value: 'glass-warm',
      label: 'Warm'
    }, {
      value: 'glass-light',
      label: 'Light'
    }]
  })), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Video de fondo"
  }, /*#__PURE__*/React.createElement(TweakSlider, {
    label: "Brillo del video",
    value: parseFloat(tweaks.videoFilter),
    min: 0.2,
    max: 0.9,
    step: 0.05,
    onChange: v => setTweak('videoFilter', String(v))
  }))));
};
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(/*#__PURE__*/React.createElement(App, null));
