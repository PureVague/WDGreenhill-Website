export interface Faq {
  id: string;
  question: string;
  answer: string; // Markdown
  draft: boolean;
}

export const kawaiFaqs: Faq[] = [
  {
    id: "firmware-update",
    question: "How can I update the firmware on my Kawai piano?",
    answer: `Kawai periodically releases firmware updates that improve stability, add features, and address known issues. Updates are delivered via USB storage device and are installed through the piano's system menu.

Visit [kawai-global.com/support/updates](https://www.kawai-global.com/support/updates) and locate your piano model. Download the firmware package to a FAT32-formatted USB drive (the drive must be empty and formatted correctly — NTFS drives are not supported). Insert the USB into your piano, power on the instrument, and navigate to **Function → System → Version → Update** or similar (exact menu path varies by model — consult your owner's manual).

The update process typically takes 2–5 minutes. **Do not power off the piano during an update**, as this can corrupt the firmware and render the instrument inoperable. If an update fails or your piano becomes unresponsive, contact us at [support@wdgreenhill.com](mailto:support@wdgreenhill.com) — we can assist with firmware recovery.`,
    draft: true,
  },
  {
    id: "pedal-function",
    question: "How should the pedals on a digital piano function?",
    answer: `A typical Kawai digital piano features three pedals: sustain (damper), sostenuto, and soft (una corda), mirroring the arrangement of a grand piano. The **sustain pedal** is the most commonly used — depressing it lifts all dampers simultaneously, allowing notes to ring freely after the keys are released. On Kawai Grand Feel instruments, the sustain pedal incorporates half-pedal detection, enabling expressive partial damping just as on an acoustic grand.

The **sostenuto pedal** (centre) sustains only the notes that are physically depressed at the moment the pedal is pushed, leaving subsequently played notes unaffected. This is used for specific repertoire techniques. The **soft pedal** (left) shifts the hammer mechanism fractionally, reducing volume and slightly altering tone — on acoustic pianos this physically moves the hammers, and Kawai simulates this effect digitally.

If a pedal feels spongy, fails to spring back, does not register in the software, or activates the wrong function, the most common causes are a faulty pedal switch, a damaged spring in the pedal mechanism, or a loose connector on the pedal wiring harness. We stock genuine Kawai pedal mechanism parts for most models — contact [sales@wdgreenhill.com](mailto:sales@wdgreenhill.com) with your model number.`,
    draft: true,
  },
  {
    id: "key-noise",
    question: "Why can I hear the keyboard action on my piano?",
    answer: `Mechanical key noise on a Kawai digital piano is almost always normal and expected — especially on instruments with weighted hammer action or Grand Feel wooden-key mechanisms. The clicking and clacking of hammer weights engaging and releasing is an intentional consequence of the weighted action design, which closely replicates the feel of an acoustic piano's repetition mechanism.

However, key noise that is *excessive*, has developed suddenly, or is clearly different from key to key may indicate a worn bushing, a displaced key return spring, or a key that has come partially free from its pivot rail. On Grand Feel actions with wooden keys, the wood can also swell slightly with changes in humidity, causing intermittent friction and clicking. On Responsive Hammer Compact actions, worn pivot bushings can develop an audible rattle as the hammer weight bounces.

If the noise is disruptive, first check that the piano lid (fallboard) is fully open, as a partially closed fallboard resonates against struck keys. If the issue persists, we can supply genuine Kawai action parts (bushings, key return springs, hammer weights) — contact [support@wdgreenhill.com](mailto:support@wdgreenhill.com) with a description of the noise and your model number.`,
    draft: true,
  },
  {
    id: "upper-sustain",
    question: "Why does the upper register sustain without using the pedal?",
    answer: `This is intentional behaviour, faithfully reproducing an acoustic phenomenon present on concert grand pianos known as **string resonance** and **free-string sympathetic vibration**. On an acoustic grand piano, the top two or three octaves (above approximately G6) have no dampers — their strings are short enough that they decay naturally before interference becomes musically problematic. This means that on an acoustic piano, striking any note in the upper register will cause that note to ring until it decays naturally, regardless of the sustain pedal.

Kawai's Harmonic Imaging and Harmonic Imaging XL technologies model this behaviour accurately. If you find the effect excessive for your playing style, it can be moderated on many Kawai models via the **Virtual Technician** menu under "Damper Resonance" or "String Resonance" settings — reducing these values will shorten the natural sustain of the upper register while maintaining the sympathetic resonance of strings in the mid-range.

If sustain is occurring unexpectedly in the *middle* register (below G6) without the pedal engaged, this is more likely a hardware fault — typically a faulty sustain pedal switch that is permanently closed, or a stuck damper key contact. In this case, contact [support@wdgreenhill.com](mailto:support@wdgreenhill.com) for diagnostics.`,
    draft: true,
  },
  {
    id: "no-sound",
    question: "There's no sound coming from my Kawai digital piano — what should I check?",
    answer: `Before assuming a hardware fault, work through these checks in order:

**1. Volume and master volume.** Confirm the master volume dial or slider is not at zero, and that no individual Part volume has been muted via the Function menu.

**2. Headphone jack.** Insert a known-working pair of headphones into the headphone socket and listen. If sound is audible through headphones but not the speakers, the fault lies in the speaker amplifier chain or speaker cones themselves, not in the tone-generation circuitry. If there is also no headphone output, the problem is upstream — in the tone generator, DAC, or main PCB.

**3. Local Control.** If the piano is connected to an external MIDI device or DAW, check that Local Control is enabled (Function → MIDI → Local Control → On). With Local Control off, the piano sends MIDI data but does not produce internal sound.

**4. Connections.** If using external amplification, verify all audio cables are seated fully and that the amplifier or mixer channel is not muted.

If none of the above resolves the issue, the likely culprits are a failed amplifier board, a blown speaker, or a faulty main PCB. We stock amplifier boards and speaker assemblies for many Kawai models — email [sales@wdgreenhill.com](mailto:sales@wdgreenhill.com) with your model and serial number.`,
    draft: true,
  },
  {
    id: "touch-sensitivity",
    question: "Can I adjust the key touch sensitivity / weighting on my Kawai?",
    answer: `Yes. Kawai digital pianos include a **Touch Sensitivity** setting that adjusts how the instrument interprets the force of your keystrokes relative to output volume — it does not physically change the action weight.

On most models, access this via **Function → Piano → Touch** (or similar, depending on model). Options typically range from **Light** (louder output with less keystroke force) through **Normal** to **Heavy** (requires a firm stroke to reach full volume), with some models offering a **Fixed** setting that produces the same velocity regardless of touch.

The physical weight of the action itself cannot be adjusted electronically — it is a property of the hammer mechanism. If keys feel physically stiffer than expected, particularly on a relatively new instrument, ensure the piano has been at room temperature for at least an hour (cold conditions stiffen key felts and pivot bushings). If the weight feels uneven between keys, a worn or displaced key bushing may be the cause — contact us for genuine Kawai key bushing stock.`,
    draft: true,
  },
  {
    id: "tuning",
    question: "Can I tune a Kawai digital piano, and does it ever go out of tune?",
    answer: `Digital pianos do not go out of tune in the traditional sense — the pitch of every note is generated digitally and will remain stable regardless of temperature, humidity, or time. This is one of the primary practical advantages over acoustic instruments.

However, Kawai digital pianos do allow pitch adjustment for ensemble playing or recording situations where the reference pitch differs from standard A440. The **Master Tuning** setting (Function → Piano → Master Tuning on most models) allows adjustment in 0.5 Hz steps, typically from A427 to A453. Some models also allow fine-tuning in cents.

Note that **temperament** (scale tuning) is also adjustable on many Kawai models, with options including Equal, Just Major, Just Minor, Kirnberger III, and others — useful for period repertoire or specific ensemble contexts. If you are hearing pitch instability that appears to have developed over time, this is most likely an electronic fault rather than tuning drift, and we would recommend submitting a support request.`,
    draft: true,
  },
  {
    id: "bluetooth-midi",
    question: "How do I connect my Kawai piano via Bluetooth MIDI?",
    answer: `Kawai began introducing Bluetooth MIDI on select models from around 2016. Models with Bluetooth MIDI capability include the CA and CN series from that period onwards, though not all models in each range include it — check your specification sheet or owner's manual to confirm.

To pair: ensure Bluetooth is enabled on your piano (Function → Bluetooth MIDI → On or similar). On your iOS device, open the app you want to use (e.g. GarageBand, Kawai PianoRemote, forScore). For iOS, Bluetooth MIDI pairing happens through the app itself rather than through the iOS Bluetooth settings — look for a MIDI connect button or Bluetooth setup within the app. On Android, pairing behaviour varies by app and Android version.

If the piano does not appear as a Bluetooth device, confirm the piano's Bluetooth MIDI mode is enabled and that no other device is currently paired (Kawai Bluetooth MIDI is typically one-to-one). Disconnect any existing paired devices via the piano's Function menu before pairing to a new device.

We do not supply Bluetooth module replacements at this time, but if you are experiencing Bluetooth connectivity issues we can advise on whether the issue is software or hardware — please email [support@wdgreenhill.com](mailto:support@wdgreenhill.com).`,
    draft: true,
  },
  {
    id: "warranty-repairs",
    question: "What is the difference between in-warranty and out-of-warranty repairs?",
    answer: `In the United Kingdom, new Kawai digital pianos are sold with a manufacturer's warranty — typically **3 years** for home models and **1 year** for professional/stage models, though this varies by retailer and model. During the warranty period, faults covered by the warranty should be directed to the retailer from whom the piano was purchased, or to Kawai UK directly, who will arrange authorised service at no cost to you.

**WDGreenhill handles out-of-warranty repairs.** We are officially recommended by Kawai UK for all non-warranty servicing in the UK. This includes instruments that are outside their original warranty period, or faults that are excluded from warranty coverage (such as liquid damage, physical impact, or misuse).

For out-of-warranty repairs, we can:
- Supply genuine Kawai spare parts for self-repair or for your local technician
- Provide remote technical guidance via email
- Assess and quote for bench repairs where the instrument is sent to us

To begin a repair request, use our [support request form](/kawai-support/request) or email [support@wdgreenhill.com](mailto:support@wdgreenhill.com) with your model, serial number, and a description of the fault.`,
    draft: true,
  },
];
