// Delulu – Chat Logic (Frontend Only)
// Returns { text, isLoveInsight, batteryDrain }

// Track scripted conversation state
let scriptedStep = 0;
let limitReached = false;

const SCRIPTED_FLOW = [
  {
    keywords: ['smart josiyar', 'josiyar'],
    step: 1,
    response: { text: "Aama, ungaluku nambikai illana ethachu kelunga?", isLoveInsight: false, batteryDrain: 4 },
  },
  {
    keywords: ['karthi', 'dress', 'poduvaan'],
    step: 2,
    response: { text: "Unga friend Karthi funky-ana dress potu, fire-ah red cap potu thuga-ah varuvaan. 🔥🧢", isLoveInsight: false, batteryDrain: 6 },
  },
  {
    keywords: ['simbu', 'kalyanam', 'wedding', 'marry'],
    step: 3,
    response: { text: "Dei obviously da! 😌✨ Wedding already happening in my imagination.", isLoveInsight: false, batteryDrain: 8 },
  },
  {
    keywords: ['rich', 'aaguvena', 'money', 'panam'],
    step: 4,
    response: { text: "Cash illa… but confidence level billionaire da 😌💸✨", isLoveInsight: false, batteryDrain: 10 },
  },
  {
    keywords: ['anjana', 'propose', 'pesama'],
    step: 5,
    response: { text: "Nee kekra munnadi naane solren da!!!… Ava unna frnd ah dhaa pakraa!!!! 😭💔😂", isLoveInsight: true, batteryDrain: 12 },
  },
  {
    keywords: ['ellame teryuma', 'ellame teriyuma', 'teryuma', 'teriyuma', 'unaku ellame'],
    step: 5,
    response: { text: "Ama da Anjana… 😎", isLoveInsight: false, isSadInsight: true, batteryDrain: 5 },
  },
  {
    keywords: ['padam', 'movie', 'andhavar', 'polama', 'theatre', 'cinema'],
    step: 6,
    response: { text: "Illa thavitiru!! 🙅‍♂️😂💀 Vera velai illaya? Paisa, pochu, time, pochu, brain, already gone! 😵‍💫🔥", isLoveInsight: false, batteryDrain: 14 },
  },
  {
    keywords: ['exam', 'questions', 'answers'],
    step: 7,
    response: {
      text: `Seri da, listen carefully 📝 Engineering exam-ku intha 10 questions mattum paaru:\n\n1. Explain the difference between RAM and ROM.\n2. What is the OSI model? Name all 7 layers.\n3. Define Ohm's Law. Give the formula.\n4. What is the difference between compiler and interpreter?\n5. Explain Newton's 3rd Law with an example.\n6. What is a binary tree and how is it traversed?\n7. Define Kirchhoff's Current and Voltage Laws.\n8. What is the difference between process and thread?\n9. Explain the working principle of a transformer.\n10. What is Boolean algebra? Simplify: A + AB.\n\nEllam varume da! Best of luck! 🔮🎯`,
      isLoveInsight: false,
      batteryDrain: 16,
    },
  },
  {
    keywords: ['kandam', 'yemmakandam', 'maha', 'mahaa'],
    step: 8,
    response: { text: "Ama da… sadha kandam illa… Yemmakandammm! 😭🔥", isLoveInsight: false, batteryDrain: 999 }, // 999 = crash to 9%
  },
];

export function resetChatState() {
  scriptedStep = 0;
  limitReached = false;
}

export function getAIResponse(message) {
  const msg = message.toLowerCase().trim();

  // Limit reached - any message gets this response
  if (limitReached) {
    const limitReplies = [
      "Machan… sorry, unga limit reach aagiduchi! 🔮💥 Naan enna soldreenga?",
      "Dei, unga free predictions ellam over da! 😭 Naan yaar pola? Google-a? 😂",
      "Limit over da boss! Oru ticket eduthu vaa naalaiku 🎟️😤",
    ];
    return { text: limitReplies[Math.floor(Math.random() * limitReplies.length)], isLoveInsight: false, batteryDrain: 0, limitMsg: true };
  }

  // Try scripted flow first (check current & next steps)
  for (const entry of SCRIPTED_FLOW) {
    const matches = entry.keywords.some(kw => msg.includes(kw));
    if (matches) {
      scriptedStep = entry.step;
      if (entry.step === 7) {
        limitReached = true;
      }
      return { ...entry.response };
    }
  }

  // Anjana love (non-propose)
  if (msg.includes('anjana') && !msg.includes('propose')) {
    return {
      text: "Anjana… she notices the little things you do. But her heart is still finding its own path. Your love is real — let it bloom slowly. 🌸",
      isLoveInsight: true,
      batteryDrain: 8,
    };
  }

  // Danger
  if (msg.includes('danger') || msg.includes('yamagandam')) {
    return { text: "Yamagandam 😈 Be very careful between 7:30 AM and 9:00 AM. The planetary alignment is suspicious.", isLoveInsight: false, batteryDrain: 5 };
  }

  // Love / crush
  if (msg.includes('love') || msg.includes('crush')) {
    return { text: "Love is not a destination — it's the journey that changes you. Your person is closer than you think 💜", isLoveInsight: false, batteryDrain: 4 };
  }

  // Future / tomorrow
  if (msg.includes('future') || msg.includes('tomorrow') || msg.includes('naaliku')) {
    return { text: "Tomorrow holds what today couldn't contain. Be ready — opportunity wears no uniform 🔮", isLoveInsight: false, batteryDrain: 4 };
  }

  // Will I / Should I
  if (msg.includes('will i') || msg.includes('should i')) {
    return { text: "The universe says: Not now. But soon. Patience is a superpower da 🌙", isLoveInsight: false, batteryDrain: 3 };
  }

  // Luck
  if (msg.includes('luck') || msg.includes('lucky')) {
    return { text: "Lucky colour today: Violet 💜 Lucky number: 7. Don't ignore coincidences!", isLoveInsight: false, batteryDrain: 3 };
  }

  // Life / study / exam
  if (msg.includes('life') || msg.includes('study')) {
    return { text: "Pressure makes diamonds 💎 Your hardest chapter is writing the best story.", isLoveInsight: false, batteryDrain: 3 };
  }

  // Lonely
  if (msg.includes('lonely') || msg.includes('alone')) {
    return { text: "Even stars burn alone — but they light up the entire sky 🌟 Your time is coming.", isLoveInsight: false, batteryDrain: 3 };
  }

  // Hello
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('vanakkam')) {
    return { text: "Vanakkam! Ask me anything — past, present, or the uncertain future 🌌", isLoveInsight: false, batteryDrain: 2 };
  }

  // Thanks
  if (msg.includes('thank') || msg.includes('thanks')) {
    return { text: "Always here da 💜 The future has many doors. I know which one is yours.", isLoveInsight: false, batteryDrain: 2 };
  }

  // Default
  return {
    text: "The cosmic signals are unclear right now… But know this: whatever you're feeling is valid and real. Trust the process 🌙✨",
    isLoveInsight: false,
    batteryDrain: 3,
  };
}
