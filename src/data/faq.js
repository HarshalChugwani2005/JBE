/**
 * Frequently asked questions (FAQ page + FAQPage JSON-LD), in English, Marathi and Hindi.
 *
 * Every answer only states what the shop already publishes on this site. Where a detail
 * depends on the shop (delivery area, installation), the answer points to WhatsApp instead of
 * promising anything — edit these when the shop confirms its policy.
 *
 * Placeholders filled in at render time: {hours} (opening hours text), {address}.
 */
export const faq = [
  {
    id: 'prices',
    q: {
      en: 'How do I find out the price of a product?',
      mr: 'उत्पादनाचा दर कसा कळेल?',
      hi: 'किसी उत्पाद की कीमत कैसे पता करें?',
    },
    a: {
      en: 'We don’t list prices online because they depend on the model and the quantity. Send us a WhatsApp message, call us, or add products to your enquiry list and send them together — we’ll reply with a quotation.',
      mr: 'दर मॉडेल आणि संख्येवर अवलंबून असल्याने आम्ही ते ऑनलाइन दाखवत नाही. व्हॉट्सॲपवर संदेश पाठवा, कॉल करा किंवा उत्पादने चौकशी यादीत जोडून एकत्र पाठवा — आम्ही कोटेशन पाठवू.',
      hi: 'कीमत मॉडल और मात्रा पर निर्भर करती है, इसलिए हम इसे ऑनलाइन नहीं दिखाते। व्हाट्सएप पर संदेश भेजें, कॉल करें या उत्पादों को पूछताछ सूची में जोड़कर एक साथ भेजें — हम कोटेशन भेजेंगे।',
    },
  },
  {
    id: 'wholesale',
    q: {
      en: 'Do you sell wholesale to dealers and shops?',
      mr: 'तुम्ही डीलर आणि दुकानदारांना होलसेल विक्री करता का?',
      hi: 'क्या आप डीलरों और दुकानों को थोक में बेचते हैं?',
    },
    a: {
      en: 'Yes, we sell both wholesale and retail. In the enquiry list, choose “Wholesale (Bulk)”, set the quantities you need and send it on WhatsApp — we’ll quote bulk prices.',
      mr: 'होय, आम्ही होलसेल आणि किरकोळ दोन्ही विक्री करतो. चौकशी यादीत “होलसेल (मोठ्या प्रमाणात)” निवडा, हवी ती संख्या टाका आणि व्हॉट्सॲपवर पाठवा — आम्ही होलसेल दर कळवू.',
      hi: 'हाँ, हम थोक और खुदरा दोनों बेचते हैं। पूछताछ सूची में “थोक (थोक व्यापार)” चुनें, ज़रूरी मात्रा डालें और व्हाट्सएप पर भेजें — हम थोक कीमत बताएंगे।',
    },
  },
  {
    id: 'payment',
    q: {
      en: 'Which payment methods do you accept?',
      mr: 'कोणत्या पद्धतीने पेमेंट करता येते?',
      hi: 'आप किन तरीकों से भुगतान लेते हैं?',
    },
    a: {
      en: 'Cash, UPI and credit cards at the shop. For any other payment arrangement, please ask us on WhatsApp.',
      mr: 'दुकानात रोख, UPI आणि क्रेडिट कार्ड. इतर कोणत्याही पेमेंट व्यवस्थेसाठी कृपया व्हॉट्सॲपवर विचारा.',
      hi: 'दुकान पर नकद, UPI और क्रेडिट कार्ड। किसी और भुगतान व्यवस्था के लिए कृपया व्हाट्सएप पर पूछें।',
    },
  },
  {
    id: 'warranty',
    q: {
      en: 'Do products come with a warranty?',
      mr: 'उत्पादनांवर वॉरंटी मिळते का?',
      hi: 'क्या उत्पादों पर वारंटी मिलती है?',
    },
    a: {
      en: 'Yes. Products carry the manufacturer’s warranty shown on each product page — for example, 730 days on select ZIPSY ceiling fans. Keep your bill; if you need to make a claim, contact us and we’ll guide you.',
      mr: 'होय. प्रत्येक उत्पादनाच्या पानावर दाखवलेली उत्पादकाची वॉरंटी मिळते — उदा. निवडक ZIPSY सिलिंग फॅनवर ७३० दिवस. बिल जपून ठेवा; वॉरंटी क्लेमसाठी आमच्याशी संपर्क करा, आम्ही मार्गदर्शन करू.',
      hi: 'हाँ। हर उत्पाद पेज पर दिखाई गई निर्माता की वारंटी मिलती है — जैसे चुनिंदा ZIPSY सीलिंग फैन पर 730 दिन। बिल संभालकर रखें; वारंटी क्लेम के लिए हमसे संपर्क करें, हम मार्गदर्शन करेंगे।',
    },
  },
  {
    id: 'availability',
    q: {
      en: 'Can I check if a model is available before visiting?',
      mr: 'दुकानात येण्यापूर्वी मॉडेल उपलब्ध आहे का हे तपासता येईल का?',
      hi: 'क्या दुकान आने से पहले पता कर सकते हैं कि मॉडल उपलब्ध है?',
    },
    a: {
      en: 'Yes. Message us on WhatsApp or call with the model name, and we’ll confirm before you come.',
      mr: 'होय. मॉडेलचे नाव सांगून व्हॉट्सॲपवर संदेश पाठवा किंवा कॉल करा, तुम्ही येण्यापूर्वी आम्ही खात्री करून सांगू.',
      hi: 'हाँ। मॉडल का नाम बताकर व्हाट्सएप पर संदेश भेजें या कॉल करें, आपके आने से पहले हम पुष्टि कर देंगे।',
    },
  },
  {
    id: 'delivery',
    q: {
      en: 'Do you deliver or install products?',
      mr: 'तुम्ही डिलिव्हरी किंवा फिटिंग करून देता का?',
      hi: 'क्या आप डिलीवरी या फ़िटिंग करते हैं?',
    },
    a: {
      en: 'It depends on the product and your location. Message us on WhatsApp with your address and the products you need, and we’ll tell you what’s possible.',
      mr: 'हे उत्पादन आणि तुमच्या ठिकाणावर अवलंबून आहे. तुमचा पत्ता आणि हवी असलेली उत्पादने व्हॉट्सॲपवर पाठवा, काय शक्य आहे ते आम्ही सांगू.',
      hi: 'यह उत्पाद और आपकी जगह पर निर्भर करता है। अपना पता और ज़रूरी उत्पाद व्हाट्सएप पर भेजें, हम बताएंगे कि क्या संभव है।',
    },
  },
  {
    id: 'hours',
    q: {
      en: 'When is the shop open, and where is it?',
      mr: 'दुकान कधी उघडे असते आणि कुठे आहे?',
      hi: 'दुकान कब खुली रहती है और कहाँ है?',
    },
    a: {
      en: '{hours}. Address: {address}. The Contact page has a map and directions.',
      mr: '{hours}. पत्ता: {address}. संपर्क पानावर नकाशा आणि दिशा दिल्या आहेत.',
      hi: '{hours}. पता: {address}. संपर्क पेज पर नक्शा और रास्ता दिया है।',
    },
  },
  {
    id: 'enquiry-list',
    q: {
      en: 'How does the enquiry list work?',
      mr: 'चौकशी यादी कशी वापरायची?',
      hi: 'पूछताछ सूची कैसे काम करती है?',
    },
    a: {
      en: 'Tap “Add to List” on any product, adjust the quantities and choose wholesale or retail. Then tap “Send to WhatsApp” — all the items reach us in one message and we reply with a quotation.',
      mr: 'कोणत्याही उत्पादनावर “यादीत जोडा” दाबा, संख्या बदला आणि होलसेल किंवा किरकोळ निवडा. मग “व्हॉट्सॲपवर पाठवा” दाबा — सर्व वस्तू एकाच संदेशात आमच्याकडे येतात आणि आम्ही कोटेशन पाठवतो.',
      hi: 'किसी भी उत्पाद पर “लिस्ट में जोड़ें” दबाएं, मात्रा बदलें और थोक या खुदरा चुनें। फिर “व्हाट्सएप पर भेजें” दबाएं — सारी चीज़ें एक ही संदेश में हम तक पहुंचती हैं और हम कोटेशन भेजते हैं।',
    },
  },
  {
    id: 'language',
    q: {
      en: 'Can I use the website in Marathi or Hindi?',
      mr: 'वेबसाइट मराठी किंवा हिंदीमध्ये वापरता येते का?',
      hi: 'क्या वेबसाइट मराठी या हिंदी में इस्तेमाल कर सकते हैं?',
    },
    a: {
      en: 'Yes. Use the EN / मराठी / हिंदी switch at the top of the page (inside the menu on phones).',
      mr: 'होय. पानाच्या वरच्या बाजूला EN / मराठी / हिंदी बटण वापरा (फोनवर मेनूमध्ये).',
      hi: 'हाँ। पेज के ऊपर EN / मराठी / हिंदी बटन इस्तेमाल करें (फ़ोन पर मेनू में)।',
    },
  },
]

/**
 * FAQ in one language with placeholders filled in. `translate` comes from src/i18n/format.js
 * (passed in so this data file stays free of runtime imports).
 */
export function localizedFaq(lang, translate) {
  const vars = {
    hours: translate(lang, 'hours'),
    address: `${translate(lang, 'heroLocation')}, ${translate(lang, 'shopCity')}`,
  }
  return faq.map((item) => ({
    id: item.id,
    question: item.q[lang] ?? item.q.en,
    answer: (item.a[lang] ?? item.a.en).replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match),
  }))
}
