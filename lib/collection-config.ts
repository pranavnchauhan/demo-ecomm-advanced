export interface CollectionConfig {
  handle: string
  title: string
  tagline: string
  intro: string // SEO-rich intro paragraph below tagline
  metaTitle: string
  metaDescription: string
  heroColor: string // Tailwind bg class for hero accent
  heroImage?: string // Path to hero image in /public
  comingSoon?: boolean // Show "Coming Soon" overlay
  benefits: { title: string; description: string }[]
  whoItsFor: string[] // "Perfect for" bullet points
  faqs: { question: string; answer: string }[]
}

export const COLLECTION_CONFIGS: Record<string, CollectionConfig> = {
  "bath-salts": {
    handle: "bath-salts",
    title: "Bath Salts",
    tagline: "Drop The Chemicals. Keep The Clean.",
    intro: "Salt & Stone AU Bath Salts are handcrafted in small batches on the NSW coast using mineral-rich Himalayan pink salt, dead sea salt, and pure essential oils. Each blend is designed to transform your bath into a restorative ritual — soothing tired muscles, softening skin, and calming the mind after a long day. Unlike commercial bath products loaded with synthetic fragrances, artificial colours, and chemical preservatives, our bath salts contain only natural minerals and therapeutic-grade essential oils. Available in Lavender & Chamomile, Eucalyptus & Peppermint, Rose Geranium, and Citrus Burst — each in a recyclable glass jar with a compostable kraft label.",
    metaTitle: "Natural Bath Salts | Himalayan & Dead Sea Salt Blends",
    metaDescription:
      "Handcrafted mineral-rich bath salts with Himalayan pink salt, dead sea salt, and pure essential oils. Australian made, vegan, eco-friendly packaging. Free AU shipping over $79.",
    heroColor: "bg-[#c4a875]/10",
    heroImage: "/images/collections/bath-salts.jpg",
    whoItsFor: [
      "Anyone looking to unwind after a long day with a natural, chemical-free bath soak",
      "People with dry or sensitive skin seeking mineral-rich hydration",
      "Athletes and active people wanting natural muscle recovery after training",
      "Gift buyers looking for a beautiful, eco-friendly self-care present",
      "Parents wanting a gentle, natural bath product free from synthetic chemicals",
    ],
    benefits: [
      {
        title: "Mineral-Rich Natural Salts",
        description:
          "A blend of Himalayan pink salt and dead sea salt delivers over 80 essential minerals including magnesium, potassium, and calcium — naturally detoxifying and deeply nourishing for your skin.",
      },
      {
        title: "Pure Essential Oil Fragrances",
        description:
          "No synthetic fragrances or artificial colours. Each blend uses therapeutic-grade essential oils for a genuine aromatherapy experience that soothes both body and mind.",
      },
      {
        title: "Muscle Recovery & Relaxation",
        description:
          "Magnesium-rich salts help ease muscle tension and promote relaxation. Perfect as a post-workout soak or an evening wind-down ritual before bed.",
      },
      {
        title: "Eco-Friendly Packaging",
        description:
          "Packaged in reusable glass jars with compostable kraft labels and recycled paper inserts. No single-use plastics — ever.",
      },
    ],
    faqs: [
      {
        question: "How much bath salt should I use per bath?",
        answer:
          "Add 2-4 tablespoons to a warm bath and allow to dissolve for 1-2 minutes before soaking. Adjust the amount to your preference — more salt means a stronger mineral soak.",
      },
      {
        question: "Are the bath salts safe for sensitive skin?",
        answer:
          "Yes. All our bath salts are free from synthetic fragrances, artificial colours, parabens, and sulphates. The essential oils used are gentle and well-tolerated by most skin types. If you have very sensitive skin, we recommend the Lavender & Chamomile blend.",
      },
      {
        question: "Can I use them in a foot bath?",
        answer:
          "Absolutely. Add 1-2 tablespoons to a bowl of warm water for a soothing foot soak. The eucalyptus and peppermint blend is especially refreshing for tired feet.",
      },
      {
        question: "What scent options are available?",
        answer:
          "We offer four blends: Lavender & Chamomile (calming), Eucalyptus & Peppermint (invigorating), Rose Geranium (floral and balancing), and Citrus Burst (uplifting). Each uses only pure essential oils.",
      },
      {
        question: "How long do they last once opened?",
        answer:
          "Bath salts have a long shelf life. Once opened, they will stay fresh for 12-18 months when stored in their glass jar with the lid sealed. Keep in a cool, dry place away from moisture.",
      },
      {
        question: "Are they safe to use during pregnancy?",
        answer:
          "Plain salt baths are generally considered safe during pregnancy, but some essential oils should be avoided. Please consult your healthcare provider before use if you are pregnant or breastfeeding.",
      },
      {
        question: "Will they stain my bathtub?",
        answer:
          "No. Our bath salts use no artificial colours or dyes. The Himalayan pink salt may give the water a very light pink tint, but this rinses away cleanly and will not stain your tub.",
      },
      {
        question: "Are the jars reusable?",
        answer:
          "Yes! The glass jars are designed to be reused. They make great storage for cotton pads, hair ties, or even spices in the kitchen. We also offer refill pouches to reduce waste.",
      },
    ],
  },

  "body-scrubs": {
    handle: "body-scrubs",
    title: "Body Scrubs",
    tagline: "Drop The Synthetic. Keep The Natural.",
    intro: "Salt & Stone AU Body Scrubs are handmade exfoliants crafted with raw organic sugar, virgin coconut oil, and botanical extracts sourced from Australian and global suppliers. Each scrub gently buffs away dead skin cells while deeply moisturising, leaving your skin silky smooth without the tight, stripped feeling that chemical exfoliants can cause. We never use microplastics, synthetic fragrances, or artificial preservatives — just real ingredients your skin will love. Available in Coffee & Vanilla, Lemon Myrtle, Coconut & Lime, and Australian Native Botanicals. Hand-filled into recyclable amber glass jars on the NSW coast.",
    metaTitle: "Natural Body Scrubs | Organic Sugar & Coconut Oil",
    metaDescription:
      "Handcrafted natural body scrubs with organic sugar, coconut oil, and botanical extracts. Australian made, vegan, no microplastics. Free AU shipping over $79.",
    heroColor: "bg-[#8a6c4f]/10",
    heroImage: "/images/collections/body-scrubs.jpg",
    whoItsFor: [
      "Anyone wanting smoother, softer skin without harsh chemical exfoliants",
      "People with dry, rough, or uneven skin texture looking for a natural solution",
      "Eco-conscious shoppers seeking body care without microplastics or synthetic ingredients",
      "Gift buyers looking for a luxurious, handmade self-care product",
      "Those transitioning from commercial body care to clean, natural alternatives",
    ],
    benefits: [
      {
        title: "Gentle Physical Exfoliation",
        description:
          "Raw organic sugar granules provide effective yet gentle exfoliation that sloughs away dead skin cells without micro-tears. Suitable for all skin types, including sensitive skin.",
      },
      {
        title: "Deep Moisturising Formula",
        description:
          "Virgin coconut oil and shea butter melt into your skin during use, leaving it deeply hydrated and nourished — no need for body lotion afterwards.",
      },
      {
        title: "No Microplastics",
        description:
          "Unlike many commercial scrubs that contain polyethylene microbeads, our scrubs use only biodegradable, natural exfoliants that are safe for waterways and marine life.",
      },
      {
        title: "Australian Botanical Extracts",
        description:
          "Infused with native Australian botanicals like lemon myrtle, kakadu plum, and wattle seed for antioxidant-rich skin nourishment unique to the Australian landscape.",
      },
    ],
    faqs: [
      {
        question: "How often should I use a body scrub?",
        answer:
          "We recommend using a body scrub 2-3 times per week. Over-exfoliating can irritate the skin. Apply to damp skin in the shower, massage in circular motions, and rinse thoroughly.",
      },
      {
        question: "Can I use it on my face?",
        answer:
          "Our body scrubs are formulated for the body and may be too abrasive for delicate facial skin. We recommend using a dedicated facial exfoliant for your face.",
      },
      {
        question: "Will the coconut oil clog my pores?",
        answer:
          "Coconut oil is mildly comedogenic. For most people, using a body scrub in the shower (where it's rinsed off) does not cause issues. If you are prone to body acne, try the Lemon Myrtle blend which has a lighter oil base.",
      },
      {
        question: "What scent options do you offer?",
        answer:
          "We have four blends: Coffee & Vanilla (energising), Lemon Myrtle (fresh and native), Coconut & Lime (tropical), and Australian Native Botanicals (earthy and grounding). All scented with pure essential oils only.",
      },
      {
        question: "How should I store the scrub?",
        answer:
          "Keep the glass jar sealed and store in a cool, dry place. Avoid getting water into the jar as this can reduce shelf life. Use the included wooden scoop to keep the product clean.",
      },
      {
        question: "Is it safe to use on sunburned skin?",
        answer:
          "No. Avoid using any exfoliant on sunburned, broken, or irritated skin. Wait until the skin has fully healed before resuming use.",
      },
      {
        question: "Are your body scrubs vegan?",
        answer:
          "Yes, all our body scrubs are 100% vegan. We use shea butter and coconut oil as our base — no beeswax, lanolin, or animal-derived ingredients.",
      },
      {
        question: "Can the scrub make my shower slippery?",
        answer:
          "The oils in the scrub can make wet surfaces slippery. We recommend rinsing the shower floor after use and using a non-slip bath mat for safety.",
      },
    ],
  },

  "essential-oils": {
    handle: "essential-oils",
    title: "Essential Oils",
    tagline: "Drop The Harsh. Keep The Gentle.",
    intro: "Salt & Stone AU Essential Oils are therapeutic-grade blends sourced from Australian and international botanical farms. Each oil is steam-distilled or cold-pressed to preserve the full spectrum of natural plant compounds — delivering genuine aromatherapy benefits rather than synthetic fragrance. Our range includes single-origin oils like Australian tea tree and eucalyptus, as well as curated blends for relaxation, focus, and energy. Perfect for diffusing, adding to bath salts, blending into carrier oils for massage, or enhancing your skincare routine. Every bottle is made in Australia, vegan, and packaged in UV-protective amber glass with a calibrated dropper.",
    metaTitle: "Essential Oils | Australian Therapeutic-Grade Blends",
    metaDescription:
      "Therapeutic-grade essential oil blends sourced from Australian and global botanicals. For diffusing, bathing, and wellness. Vegan, Australian made. Free AU shipping over $79.",
    heroColor: "bg-[#6c8a6c]/10",
    heroImage: "/images/collections/essential-oils.jpg",
    whoItsFor: [
      "Aromatherapy enthusiasts looking for genuine therapeutic-grade oils, not synthetic fragrances",
      "Yoga and meditation practitioners wanting to enhance their practice with natural scents",
      "People with sleep difficulties seeking calming lavender, chamomile, or vetiver blends",
      "DIY skincare and body care makers who need high-quality base oils for formulations",
      "Anyone wanting to replace chemical air fresheners and candles with natural diffuser oils",
    ],
    benefits: [
      {
        title: "Therapeutic-Grade Quality",
        description:
          "Steam-distilled or cold-pressed from premium botanicals. No synthetic additives, no dilution, no fragrance oils. Every batch is tested for purity and potency.",
      },
      {
        title: "Australian & Global Botanicals",
        description:
          "Featuring native Australian oils like tea tree, eucalyptus, and lemon myrtle alongside globally sourced lavender, peppermint, and frankincense.",
      },
      {
        title: "Versatile Use",
        description:
          "Designed for diffusing, adding to baths, blending into carrier oils for massage, or incorporating into DIY body care recipes. Each bottle includes usage guidelines.",
      },
      {
        title: "UV-Protective Packaging",
        description:
          "Packaged in amber glass bottles with calibrated droppers to preserve oil integrity and ensure precise dosing. Recyclable packaging with no plastics.",
      },
    ],
    faqs: [
      {
        question: "Can I apply essential oils directly to my skin?",
        answer:
          "Most essential oils should be diluted in a carrier oil (like jojoba or sweet almond oil) before applying to skin. A general guideline is 2-3 drops of essential oil per teaspoon of carrier oil. Always patch test on a small area first.",
      },
      {
        question: "How do I use essential oils in a diffuser?",
        answer:
          "Add 3-5 drops to your diffuser's water reservoir. The number of drops depends on the size of your room and diffuser. Start with fewer drops and increase to your preferred strength.",
      },
      {
        question: "Are your essential oils safe for pets?",
        answer:
          "Some essential oils can be harmful to pets, particularly cats and birds. Tea tree, eucalyptus, and peppermint should be used with caution around animals. Always diffuse in a well-ventilated area and ensure pets can leave the room.",
      },
      {
        question: "What is the difference between essential oils and fragrance oils?",
        answer:
          "Essential oils are extracted from real plants and contain natural therapeutic compounds. Fragrance oils are synthetic, lab-created scents with no therapeutic benefit. All Salt & Stone AU oils are 100% pure essential oils — never fragrance oils.",
      },
      {
        question: "How should I store essential oils?",
        answer:
          "Store in a cool, dark place with the cap tightly sealed. Our amber glass bottles protect against UV degradation. Properly stored, most essential oils last 1-3 years. Citrus oils have a shorter shelf life of about 12 months.",
      },
      {
        question: "Can I add essential oils to my bath salts?",
        answer:
          "Absolutely! Add 3-5 drops of essential oil to your bath salts before adding them to the water. The salt acts as a dispersant, helping the oil blend evenly into the bath rather than floating on the surface.",
      },
      {
        question: "Are your essential oils safe during pregnancy?",
        answer:
          "Some essential oils should be avoided during pregnancy. Please consult your healthcare provider before using any essential oils if you are pregnant or breastfeeding.",
      },
      {
        question: "What blends do you recommend for sleep?",
        answer:
          "Our Calm & Rest blend (lavender, chamomile, and vetiver) is specifically designed for evening relaxation and better sleep. Add a few drops to your diffuser 30 minutes before bed, or add to a warm bath with our bath salts.",
      },
    ],
  },

  candles: {
    handle: "candles",
    title: "Soy Candles",
    tagline: "Drop The Artificial. Keep The Pure.",
    intro: "Salt & Stone AU Soy Candles are hand-poured on the NSW coast using 100% natural soy wax, lead-free cotton wicks, and pure essential oil fragrances. Unlike paraffin candles that release petroleum-based toxins when burned, our soy candles provide a clean, slow burn with an exceptional scent throw — filling your room with natural fragrance without compromising air quality. Each candle is poured into a reusable ceramic vessel and finished with a cork lid, designed to be repurposed as a planter, pencil holder, or storage pot long after the wax is gone. Available in Coastal Breeze, Bushland Dusk, Sandalwood & Vanilla, and Native Wildflower.",
    metaTitle: "Soy Candles | Hand-Poured with Essential Oils",
    metaDescription:
      "Hand-poured soy wax candles with cotton wicks and pure essential oil fragrances. Clean burn, no toxins, reusable ceramic vessels. Australian made. Free AU shipping over $79.",
    heroColor: "bg-[#a8956e]/10",
    heroImage: "/images/collections/candles.jpg",
    whoItsFor: [
      "Anyone wanting a clean-burning candle without the toxins released by paraffin wax",
      "Home decor enthusiasts looking for beautiful, reusable ceramic candle vessels",
      "People with allergies or sensitivities to synthetic fragrances and petrochemicals",
      "Gift buyers seeking a premium, handmade Australian product in eco-friendly packaging",
      "Yoga, meditation, and wellness practitioners wanting natural ambience for their practice",
    ],
    benefits: [
      {
        title: "100% Natural Soy Wax",
        description:
          "Made from renewable soybeans — not petroleum. Soy wax burns cleaner than paraffin, producing significantly less soot and no harmful chemicals like toluene or benzene.",
      },
      {
        title: "Pure Essential Oil Fragrances",
        description:
          "Scented exclusively with therapeutic-grade essential oils. No synthetic fragrance oils, no phthalates, no artificial scent boosters. Real plant-based fragrance, naturally.",
      },
      {
        title: "Long, Clean Burn Time",
        description:
          "Soy wax has a lower melting point than paraffin, meaning it burns 30-50% longer. Our standard candle provides 40+ hours of burn time with a consistent scent throw.",
      },
      {
        title: "Reusable Ceramic Vessel",
        description:
          "Each candle is poured into a handmade ceramic vessel with a cork lid. Once the candle is finished, clean out any remaining wax and reuse as a planter, storage pot, or decorative piece.",
      },
    ],
    faqs: [
      {
        question: "How long do the candles burn?",
        answer:
          "Our standard candle provides approximately 40-45 hours of burn time. For the best results, trim the wick to 5mm before each use and burn for at least 2 hours per session to ensure an even wax pool.",
      },
      {
        question: "Why soy wax instead of paraffin?",
        answer:
          "Paraffin wax is a petroleum by-product that releases harmful chemicals like toluene and benzene when burned. Soy wax is made from renewable soybeans, burns cleaner, lasts longer, and has a better scent throw with essential oils.",
      },
      {
        question: "Can I reuse the ceramic vessel?",
        answer:
          "Absolutely! Once the candle is finished, place the vessel in the freezer for an hour, then pop out any remaining wax. Wash with warm soapy water and reuse as a planter, pencil holder, or storage pot.",
      },
      {
        question: "What scent options are available?",
        answer:
          "We offer four essential oil blends: Coastal Breeze (sea salt, bergamot, and white tea), Bushland Dusk (eucalyptus, cedar, and vetiver), Sandalwood & Vanilla (warm and grounding), and Native Wildflower (boronia, wattle, and honey).",
      },
      {
        question: "Are the candles safe for people with allergies?",
        answer:
          "Our candles are free from synthetic fragrances, parabens, phthalates, and petroleum. However, essential oils are plant-derived and may affect those with specific plant allergies. Check the ingredients list on each candle if you have known sensitivities.",
      },
      {
        question: "How should I care for the wick?",
        answer:
          "Trim the wick to approximately 5mm before each burn. This prevents mushrooming, reduces soot, and ensures a clean, even flame. A wick trimmer or small scissors work well.",
      },
      {
        question: "Do the candles contain lead?",
        answer:
          "No. All our candles use lead-free, unbleached cotton wicks. We never use zinc-core or metal-core wicks.",
      },
      {
        question: "Can I use the candles outdoors?",
        answer:
          "Yes, but wind will affect burn time and scent throw. For outdoor use, place in a sheltered area away from strong breezes. The ceramic vessel is designed to handle temperature changes, but avoid exposing to rain.",
      },
    ],
  },

  "hand-wash": {
    handle: "hand-wash",
    title: "Hand Wash",
    tagline: "Drop The Irritants. Keep The Care.",
    intro: "Salt & Stone AU Hand Wash is a gentle foaming formula made with plant-derived cleansers, moisturising botanicals, and pure essential oils. Designed for everyday use, it effectively cleans without stripping your skin of its natural moisture barrier — leaving hands soft, hydrated, and lightly fragranced. We use no sulphates, no synthetic fragrances, no parabens, and no triclosan. Packaged in refillable amber glass bottles with a stainless steel pump, our hand wash is designed to look beautiful on your kitchen or bathroom bench while minimising plastic waste. Available in Lemon Myrtle & Aloe, Lavender & Oat Milk, and Eucalyptus & Tea Tree.",
    metaTitle: "Natural Hand Wash | Plant-Based & Gentle",
    metaDescription:
      "Gentle foaming hand wash with plant-derived cleansers and moisturising botanicals. No sulphates, no parabens. Refillable glass bottles. Australian made. Free AU shipping over $79.",
    heroColor: "bg-[#7c9a8a]/10",
    heroImage: "/images/collections/hand-wash.jpg",
    whoItsFor: [
      "Families looking for a gentle, natural hand wash safe for all ages",
      "People with sensitive or eczema-prone skin who react to commercial hand soaps",
      "Eco-conscious shoppers wanting to reduce plastic waste with refillable bottles",
      "Interior design enthusiasts wanting a beautiful glass bottle on the bathroom bench",
      "Anyone wanting to switch from chemical-laden antibacterial soaps to a natural alternative",
    ],
    benefits: [
      {
        title: "Plant-Derived Cleansers",
        description:
          "Made with coconut and olive-derived surfactants that clean effectively without the harshness of sulphates. Gentle enough for frequent hand washing throughout the day.",
      },
      {
        title: "Moisturising Botanicals",
        description:
          "Infused with aloe vera, oat extract, and vitamin E to keep hands hydrated and soft. No tight, dry feeling after washing.",
      },
      {
        title: "Refillable Glass Bottles",
        description:
          "Our amber glass bottles with stainless steel pumps are designed to last. Purchase a refill pouch to top up — reducing plastic waste by up to 80% compared to buying new bottles.",
      },
      {
        title: "Essential Oil Fragrances",
        description:
          "Scented with pure essential oils only. No synthetic fragrances or artificial scent boosters. A light, natural fragrance that doesn't linger or overpower.",
      },
    ],
    faqs: [
      {
        question: "Is the hand wash suitable for children?",
        answer:
          "Yes. Our hand wash uses gentle, plant-derived ingredients with no harsh chemicals. It is suitable for all ages. The foaming formula is easy for small hands to use and rinses away cleanly.",
      },
      {
        question: "How do the refill pouches work?",
        answer:
          "Simply unscrew the pump from your glass bottle, pour in the refill pouch contents, and reattach the pump. Each refill pouch fills one bottle. The pouches use 80% less packaging than a new bottle.",
      },
      {
        question: "Will it kill bacteria as well as antibacterial soaps?",
        answer:
          "Regular hand washing with any soap is effective at removing bacteria and viruses. The physical action of washing and rinsing is what removes germs. Our tea tree and eucalyptus blend also has natural antimicrobial properties.",
      },
      {
        question: "What scent options do you have?",
        answer:
          "We offer three blends: Lemon Myrtle & Aloe (fresh and clean), Lavender & Oat Milk (calming and gentle), and Eucalyptus & Tea Tree (invigorating and cleansing). All scented with pure essential oils.",
      },
      {
        question: "Is it suitable for people with eczema?",
        answer:
          "Our hand wash is free from common irritants including sulphates, parabens, and synthetic fragrances. The Lavender & Oat Milk blend is our gentlest option and is well-tolerated by most people with sensitive or eczema-prone skin. As with any product, we recommend patch testing first.",
      },
      {
        question: "Can I use it as a body wash?",
        answer:
          "While formulated for hands, the gentle plant-based formula could be used as a body wash in a pinch. However, our body scrubs are specifically formulated for full-body care and will give you better results.",
      },
      {
        question: "How long does one bottle last?",
        answer:
          "A 500ml bottle typically lasts 4-6 weeks with regular use by a household of two. The foaming formula means you need less product per wash compared to traditional liquid soaps.",
      },
      {
        question: "Is the pump replaceable?",
        answer:
          "Yes. The stainless steel pump is designed for long-term use, but if it ever wears out, replacement pumps are available on our website. The pump fits standard bottle necks.",
      },
    ],
  },
}

export function getCollectionConfig(handle: string): CollectionConfig | null {
  return COLLECTION_CONFIGS[handle] || null
}
