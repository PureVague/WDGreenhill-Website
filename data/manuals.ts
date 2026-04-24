export type ManualType = "owner" | "service" | "schematic";
export type ManualFormat = "pdf" | "paper" | "both";

export interface Manual {
  id: string;
  brand: string;
  model: string;
  type: ManualType;
  format: ManualFormat;
  price: number; // GBP ex VAT
  inStock: boolean;
  year?: string;
  notes?: string;
}

export const manuals: Manual[] = [
  // Hammond
  { id: "ham-b3-svc", brand: "Hammond", model: "B3", type: "service", format: "paper", price: 35.00, inStock: true, year: "1955–1974" },
  { id: "ham-b3-own", brand: "Hammond", model: "B3", type: "owner", format: "pdf", price: 18.00, inStock: true, year: "1955–1974" },
  { id: "ham-c3-svc", brand: "Hammond", model: "C3", type: "service", format: "paper", price: 35.00, inStock: true, year: "1955–1974" },
  { id: "ham-l122-svc", brand: "Hammond", model: "L-122", type: "service", format: "paper", price: 30.00, inStock: true },
  { id: "ham-m3-svc", brand: "Hammond", model: "M3", type: "service", format: "paper", price: 28.00, inStock: true },
  { id: "ham-xb2-svc", brand: "Hammond", model: "XB-2", type: "service", format: "pdf", price: 22.00, inStock: true },
  { id: "ham-sk1-svc", brand: "Hammond", model: "SK1", type: "service", format: "pdf", price: 20.00, inStock: true },

  // Leslie
  { id: "les-122-svc", brand: "Leslie", model: "122", type: "service", format: "paper", price: 28.00, inStock: true },
  { id: "les-147-svc", brand: "Leslie", model: "147", type: "service", format: "paper", price: 28.00, inStock: true },
  { id: "les-760-svc", brand: "Leslie", model: "760", type: "service", format: "pdf", price: 22.00, inStock: true },

  // Yamaha
  { id: "yam-cs80-svc", brand: "Yamaha", model: "CS-80", type: "service", format: "paper", price: 42.00, inStock: true },
  { id: "yam-dx7-svc", brand: "Yamaha", model: "DX7", type: "service", format: "pdf", price: 22.00, inStock: true },
  { id: "yam-clp130-svc", brand: "Yamaha", model: "CLP-130", type: "service", format: "pdf", price: 20.00, inStock: true },
  { id: "yam-clp430-svc", brand: "Yamaha", model: "CLP-430", type: "service", format: "pdf", price: 22.00, inStock: true },
  { id: "yam-p125-own", brand: "Yamaha", model: "P-125", type: "owner", format: "pdf", price: 15.00, inStock: true },
  { id: "yam-psr-e473-own", brand: "Yamaha", model: "PSR-E473", type: "owner", format: "pdf", price: 15.00, inStock: true },
  { id: "yam-genos-svc", brand: "Yamaha", model: "Genos", type: "service", format: "pdf", price: 35.00, inStock: true },

  // Kawai
  { id: "kaw-cn3-svc", brand: "Kawai", model: "CN3", type: "service", format: "pdf", price: 22.00, inStock: true },
  { id: "kaw-ca65-svc", brand: "Kawai", model: "CA65", type: "service", format: "pdf", price: 24.00, inStock: true },
  { id: "kaw-es8-svc", brand: "Kawai", model: "ES8", type: "service", format: "pdf", price: 22.00, inStock: true },
  { id: "kaw-mp11-svc", brand: "Kawai", model: "MP11", type: "service", format: "pdf", price: 24.00, inStock: true },
  { id: "kaw-vpc1-svc", brand: "Kawai", model: "VPC1", type: "service", format: "pdf", price: 20.00, inStock: true },

  // Roland
  { id: "rol-juno106-svc", brand: "Roland", model: "Juno-106", type: "service", format: "paper", price: 32.00, inStock: true },
  { id: "rol-juno106-sch", brand: "Roland", model: "Juno-106", type: "schematic", format: "pdf", price: 18.00, inStock: true },
  { id: "rol-fp90-svc", brand: "Roland", model: "FP-90", type: "service", format: "pdf", price: 25.00, inStock: true },
  { id: "rol-rd2000-svc", brand: "Roland", model: "RD-2000", type: "service", format: "pdf", price: 28.00, inStock: true },
  { id: "rol-ep09-svc", brand: "Roland", model: "EP-09", type: "service", format: "paper", price: 30.00, inStock: true },

  // Fender Rhodes
  { id: "frd-stage-73-svc", brand: "Fender Rhodes", model: "Stage 73", type: "service", format: "paper", price: 38.00, inStock: true },
  { id: "frd-suitcase-svc", brand: "Fender Rhodes", model: "Suitcase 73", type: "service", format: "paper", price: 38.00, inStock: true },
  { id: "frd-stage-88-svc", brand: "Fender Rhodes", model: "Stage 88", type: "service", format: "paper", price: 40.00, inStock: true },

  // Wurlitzer
  { id: "wrl-200-svc", brand: "Wurlitzer", model: "200", type: "service", format: "paper", price: 35.00, inStock: true },
  { id: "wrl-200a-svc", brand: "Wurlitzer", model: "200A", type: "service", format: "paper", price: 35.00, inStock: true },
  { id: "wrl-145-svc", brand: "Wurlitzer", model: "145", type: "service", format: "paper", price: 32.00, inStock: true },
  { id: "wrl-140-own", brand: "Wurlitzer", model: "140", type: "owner", format: "pdf", price: 15.00, inStock: true },

  // Technics
  { id: "tec-sx-pr900-svc", brand: "Technics", model: "SX-PR900", type: "service", format: "paper", price: 28.00, inStock: true },
  { id: "tec-sx-pc55-svc", brand: "Technics", model: "SX-PC55", type: "service", format: "pdf", price: 22.00, inStock: true },
  { id: "tec-kn7000-svc", brand: "Technics", model: "KN7000", type: "service", format: "paper", price: 30.00, inStock: true },
  { id: "tec-kn7000-own", brand: "Technics", model: "KN7000", type: "owner", format: "pdf", price: 18.00, inStock: true },

  // Korg
  { id: "krg-t1-svc", brand: "Korg", model: "T1", type: "service", format: "paper", price: 30.00, inStock: true },
  { id: "krg-triton-svc", brand: "Korg", model: "Triton", type: "service", format: "pdf", price: 28.00, inStock: true },
  { id: "krg-m1-svc", brand: "Korg", model: "M1", type: "service", format: "paper", price: 30.00, inStock: true, year: "1988" },
  { id: "krg-kronos-svc", brand: "Korg", model: "Kronos", type: "service", format: "pdf", price: 32.00, inStock: true },

  // Thomas
  { id: "tho-321-svc", brand: "Thomas", model: "321", type: "service", format: "paper", price: 25.00, inStock: true, notes: "Original Thomas Organ Corporation document" },
  { id: "tho-500-svc", brand: "Thomas", model: "500 Paganini", type: "service", format: "paper", price: 28.00, inStock: true },
  { id: "tho-643-svc", brand: "Thomas", model: "643 Mk II", type: "service", format: "paper", price: 28.00, inStock: true, notes: "From original WDGreenhill archive" },

  // Farfisa
  { id: "far-fast5-svc", brand: "Farfisa", model: "Fast 5", type: "service", format: "paper", price: 30.00, inStock: true },
  { id: "far-combo-svc", brand: "Farfisa", model: "Compact Combo", type: "service", format: "paper", price: 30.00, inStock: true, year: "1967–1975" },
  { id: "far-vip-svc", brand: "Farfisa", model: "VIP-500", type: "service", format: "paper", price: 28.00, inStock: false, notes: "Out of stock — enquire for ETA" },

  // Lowrey
  { id: "low-magic-genie-svc", brand: "Lowrey", model: "Magic Genie 44", type: "service", format: "paper", price: 28.00, inStock: true },
  { id: "low-holiday-svc", brand: "Lowrey", model: "Holiday", type: "service", format: "paper", price: 28.00, inStock: true },
  { id: "low-holiday-own", brand: "Lowrey", model: "Holiday", type: "owner", format: "pdf", price: 15.00, inStock: true },

  // Casio
  { id: "cas-px560-svc", brand: "Casio", model: "PX-560", type: "service", format: "pdf", price: 22.00, inStock: true },
  { id: "cas-ct-x5000-own", brand: "Casio", model: "CT-X5000", type: "owner", format: "pdf", price: 15.00, inStock: true },

  // Kurzweil
  { id: "krz-pc3-svc", brand: "Kurzweil", model: "PC3", type: "service", format: "pdf", price: 28.00, inStock: true },
  { id: "krz-k2600-svc", brand: "Kurzweil", model: "K2600", type: "service", format: "paper", price: 35.00, inStock: false, notes: "Out of stock" },

  // Conn
  { id: "con-643-svc", brand: "Conn", model: "643", type: "service", format: "paper", price: 28.00, inStock: true, year: "1970s" },
  { id: "con-544-svc", brand: "Conn", model: "544", type: "service", format: "paper", price: 26.00, inStock: true },
];

export function searchManuals(query: string): Manual[] {
  const q = query.toLowerCase();
  return manuals.filter(
    (m) =>
      m.brand.toLowerCase().includes(q) ||
      m.model.toLowerCase().includes(q)
  );
}
