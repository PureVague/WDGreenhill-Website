export interface KawaiModel {
  slug: string;
  name: string;
  series: string;
  yearRange: string;
  description: string;
}

export const kawaiModels: KawaiModel[] = [
  // CA Series — Concert Artist
  { slug: "ca13", name: "CA13", series: "CA", yearRange: "2012–2015", description: "Entry Concert Artist with Grand Feel keyboard action and Harmonic Imaging sound technology." },
  { slug: "ca15", name: "CA15", series: "CA", yearRange: "2012–2016", description: "Mid-range Concert Artist with Shigeru Kawai SK-EX sound samples." },
  { slug: "ca17", name: "CA17", series: "CA", yearRange: "2013–2017", description: "Upper mid-range Concert Artist with Grand Feel II action and integrated Bluetooth." },
  { slug: "ca18", name: "CA18", series: "CA", yearRange: "2018–2021", description: "Successor to the CA17 with improved Grand Feel Compact action." },
  { slug: "ca48", name: "CA48", series: "CA", yearRange: "2018–2022", description: "Mid-level Concert Artist with Grand Feel action and 40W amplification." },
  { slug: "ca5", name: "CA5", series: "CA", yearRange: "2009–2012", description: "Earlier Concert Artist with Responsive Hammer Compact action." },
  { slug: "ca51", name: "CA51", series: "CA", yearRange: "2021–present", description: "Current entry Concert Artist with Grand Feel Compact action and Harmonic Imaging XL." },
  { slug: "ca58", name: "CA58", series: "CA", yearRange: "2019–2022", description: "Concert Artist with Grand Feel Compact action and wooden keys." },
  { slug: "ca63", name: "CA63", series: "CA", yearRange: "2013–2016", description: "Premium Concert Artist with Grand Feel II action and 4-speaker system." },
  { slug: "ca65", name: "CA65", series: "CA", yearRange: "2016–2019", description: "Upper Concert Artist with Grand Feel III action and Virtual Technician feature." },
  { slug: "ca67", name: "CA67", series: "CA", yearRange: "2019–2022", description: "Advanced Concert Artist with Grand Feel III action and Bluetooth MIDI/audio." },
  { slug: "ca7", name: "CA7", series: "CA", yearRange: "2009–2013", description: "Premium Concert Artist with Grand Feel action and Shigeru Kawai sound samples." },
  { slug: "ca71", name: "CA71", series: "CA", yearRange: "2021–present", description: "Current mid-range Concert Artist with Grand Feel action and wooden keys." },
  { slug: "ca78", name: "CA78", series: "CA", yearRange: "2022–present", description: "High-end Concert Artist with Grand Feel III action and 4-speaker configuration." },
  { slug: "ca9", name: "CA9", series: "CA", yearRange: "2011–2014", description: "Flagship Concert Artist of its era with Grand Feel action." },
  { slug: "ca91", name: "CA91", series: "CA", yearRange: "2021–present", description: "Premium Concert Artist with Grand Feel action and Shigeru Kawai sampling." },
  { slug: "ca93", name: "CA93", series: "CA", yearRange: "2016–2021", description: "High-end Concert Artist with Grand Feel Ebony and Ivory touch." },
  { slug: "ca95", name: "CA95", series: "CA", yearRange: "2018–2021", description: "Advanced Concert Artist with Grand Feel action and 6-speaker system." },
  { slug: "ca97", name: "CA97", series: "CA", yearRange: "2016–2019", description: "Flagship Concert Artist with Grand Feel III action and Shigeru Kawai EX grand." },
  { slug: "ca98", name: "CA98", series: "CA", yearRange: "2022–present", description: "Current flagship Concert Artist with Grand Feel III action and Spatial Headphone Sound." },
  { slug: "ca99", name: "CA99", series: "CA", yearRange: "2021–present", description: "Top-of-line Concert Artist with Millennium III Grand Feel and full Shigeru sampling." },

  // CL Series — Classic
  { slug: "cl20", name: "CL20", series: "CL", yearRange: "2005–2010", description: "Entry Classic series with Responsive Hammer II action." },
  { slug: "cl25", name: "CL25", series: "CL", yearRange: "2007–2012", description: "Mid Classic series digital piano." },
  { slug: "cl26", name: "CL26", series: "CL", yearRange: "2010–2014", description: "Classic series with improved sound and hammer action." },
  { slug: "cl30", name: "CL30", series: "CL", yearRange: "2012–2016", description: "Classic series with let-off simulation." },
  { slug: "cl35", name: "CL35", series: "CL", yearRange: "2016–2019", description: "Slimline Classic series with Harmonic Imaging." },
  { slug: "cl36", name: "CL36", series: "CL", yearRange: "2019–2023", description: "Current Classic series, compact upright design." },

  // CN Series — Concert Niveau
  { slug: "cn2", name: "CN2", series: "CN", yearRange: "2004–2008", description: "Early Concert Niveau with Responsive Hammer action." },
  { slug: "cn21", name: "CN21", series: "CN", yearRange: "2010–2013", description: "Mid-range CN with Responsive Hammer II." },
  { slug: "cn22", name: "CN22", series: "CN", yearRange: "2012–2015", description: "Concert Niveau with improved HI sound samples." },
  { slug: "cn23", name: "CN23", series: "CN", yearRange: "2013–2016", description: "CN with Harmonic Imaging XL." },
  { slug: "cn24", name: "CN24", series: "CN", yearRange: "2014–2017", description: "Mid CN with wooden key option." },
  { slug: "cn25", name: "CN25", series: "CN", yearRange: "2015–2018", description: "CN with Bluetooth MIDI." },
  { slug: "cn27", name: "CN27", series: "CN", yearRange: "2017–2020", description: "CN with Grand Feel Compact action." },
  { slug: "cn29", name: "CN29", series: "CN", yearRange: "2019–2022", description: "CN with Virtual Technician software." },
  { slug: "cn3", name: "CN3", series: "CN", yearRange: "2005–2009", description: "Entry Concert Niveau with Responsive Hammer action." },
  { slug: "cn31", name: "CN31", series: "CN", yearRange: "2021–present", description: "Current entry CN with Responsive Hammer Compact II." },
  { slug: "cn32", name: "CN32", series: "CN", yearRange: "2022–present", description: "Mid CN with GFC action." },
  { slug: "cn33", name: "CN33", series: "CN", yearRange: "2022–present", description: "CN with Harmonic Imaging XL sound." },
  { slug: "cn34", name: "CN34", series: "CN", yearRange: "2023–present", description: "CN with enhanced piano sound samples." },
  { slug: "cn35", name: "CN35", series: "CN", yearRange: "2023–present", description: "Upper CN with full Virtual Technician." },
  { slug: "cn37", name: "CN37", series: "CN", yearRange: "2023–present", description: "Premium CN with Grand Feel Compact action." },
  { slug: "cn39", name: "CN39", series: "CN", yearRange: "2023–present", description: "High CN with wooden keys and HIIX sound." },
  { slug: "cn4", name: "CN4", series: "CN", yearRange: "2006–2010", description: "Concert Niveau with enhanced hammer escapement." },
  { slug: "cn41", name: "CN41", series: "CN", yearRange: "2024–present", description: "Current flagship CN with Grand Feel Compact III." },
  { slug: "cn42", name: "CN42", series: "CN", yearRange: "2024–present", description: "Advanced CN with Shigeru Kawai SK-EX samples." },
  { slug: "cn43", name: "CN43", series: "CN", yearRange: "2024–present", description: "Top CN with full 88-note Spatial Headphone Sound." },
  { slug: "cn301", name: "CN301", series: "CN", yearRange: "2021–present", description: "Slimline CN in gloss finishes with GFC action." },

  // CS Series
  { slug: "cs10", name: "CS10", series: "CS", yearRange: "2012–2016", description: "CS with integrated stand and integrated speaker system." },
  { slug: "cs11", name: "CS11", series: "CS", yearRange: "2014–2018", description: "CS with wooden key Grand Feel Compact action." },
  { slug: "cs3", name: "CS3", series: "CS", yearRange: "2005–2009", description: "Early CS with Responsive Hammer III." },
  { slug: "cs4", name: "CS4", series: "CS", yearRange: "2007–2011", description: "CS with improved pedal mechanism." },
  { slug: "cs6", name: "CS6", series: "CS", yearRange: "2009–2013", description: "CS with Harmonic Imaging sound." },
  { slug: "cs7", name: "CS7", series: "CS", yearRange: "2010–2014", description: "Premium CS with wooden key action." },
  { slug: "cs8", name: "CS8", series: "CS", yearRange: "2012–2016", description: "CS with extended sound library." },
  { slug: "cs9", name: "CS9", series: "CS", yearRange: "2014–2018", description: "Flagship CS with Grand Feel III action." },

  // ES Series — Portable
  { slug: "es1", name: "ES1", series: "ES", yearRange: "2002–2006", description: "Early portable stage piano with Responsive Hammer action." },
  { slug: "es100", name: "ES100", series: "ES", yearRange: "2015–2018", description: "Portable ES with 192-voice polyphony." },
  { slug: "es110", name: "ES110", series: "ES", yearRange: "2018–2021", description: "Portable with Responsive Hammer Compact II and Bluetooth." },
  { slug: "es3", name: "ES3", series: "ES", yearRange: "2004–2008", description: "Portable stage piano with grade-weighted action." },
  { slug: "es4", name: "ES4", series: "ES", yearRange: "2006–2010", description: "ES with improved grand feel action." },
  { slug: "es5", name: "ES5", series: "ES", yearRange: "2008–2012", description: "ES with Harmonic Imaging sound." },
  { slug: "es520", name: "ES520", series: "ES", yearRange: "2021–present", description: "Current portable ES with RHCII action and 88 keys." },
  { slug: "es6", name: "ES6", series: "ES", yearRange: "2010–2013", description: "Stage piano with Grand Feel action." },
  { slug: "es7", name: "ES7", series: "ES", yearRange: "2011–2015", description: "Advanced stage piano with extensive sound library." },
  { slug: "es8", name: "ES8", series: "ES", yearRange: "2015–2020", description: "Professional stage piano with 88-note Grand Feel action." },
  { slug: "es920", name: "ES920", series: "ES", yearRange: "2022–present", description: "Current flagship portable with Grand Feel Compact III action." },

  // KDP/KCP Series
  { slug: "kcp80", name: "KCP80", series: "KDP/KCP", yearRange: "2006–2010", description: "KCP entry level with Responsive Hammer action." },
  { slug: "kdp80", name: "KDP80", series: "KDP/KCP", yearRange: "2011–2015", description: "KDP entry digital piano with integrated stand." },
  { slug: "kdp90", name: "KDP90", series: "KDP/KCP", yearRange: "2013–2017", description: "KDP mid-range with Responsive Hammer II." },
  { slug: "kdp110", name: "KDP110", series: "KDP/KCP", yearRange: "2017–2021", description: "KDP with Harmonic Imaging XL and twin speakers." },

  // MP Series — Professional Stage
  { slug: "mp4", name: "MP4", series: "MP", yearRange: "2005–2009", description: "Professional stage piano with 88-key Responsive Hammer action." },
  { slug: "mp5", name: "MP5", series: "MP", yearRange: "2006–2010", description: "MP with wooden key action." },
  { slug: "mp6", name: "MP6", series: "MP", yearRange: "2008–2012", description: "Pro stage piano with extended sound palette." },
  { slug: "mp7", name: "MP7", series: "MP", yearRange: "2012–2016", description: "MP with balanced hammer action and MIDI." },
  { slug: "mp8", name: "MP8", series: "MP", yearRange: "2008–2013", description: "MP with Grand Feel action." },
  { slug: "mp8ii", name: "MP8ii", series: "MP", yearRange: "2013–2017", description: "Revised MP8 with improved key action and sound." },
  { slug: "mp10", name: "MP10", series: "MP", yearRange: "2016–2020", description: "MP with Grand Feel III action and high-resolution sampling." },
  { slug: "mp11", name: "MP11", series: "MP", yearRange: "2015–2019", description: "Flagship stage piano with Shigeru Kawai SK-EX samples." },

  // VPC Series
  { slug: "vpc1", name: "VPC1", series: "VPC", yearRange: "2013–present", description: "Virtual Piano Controller — 88-key Grand Feel wooden action, no internal sounds. Designed for use with software pianos like Pianoteq and Ivory." },
];

export const kawaiSeriesOrder = ["CA", "CL", "CN", "CS", "ES", "KDP/KCP", "MP", "VPC"] as const;

export function getModelBySlug(slug: string): KawaiModel | undefined {
  return kawaiModels.find((m) => m.slug === slug);
}

export function getModelsBySeries(series: string): KawaiModel[] {
  return kawaiModels.filter((m) => m.series === series);
}
