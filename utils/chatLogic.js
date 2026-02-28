// Delulu – Chat Logic (Frontend Only)
// Returns { text, isLoveInsight }

export function getAIResponse(message) {
  const msg = message.toLowerCase().trim();

  // Love Insight triggers
  if (msg.includes('anjana')) {
    return {
      text: "Anjana… she notices the little things you do. But her heart is still finding its own path. Your love is real — let it bloom slowly. 🌸",
      isLoveInsight: true,
    };
  }

  // Karthik predictions
  if (msg.includes('karthik') && msg.includes('wear')) {
    return { text: "Funky dress da machan 🔮 Yellow oversized hoodie, white sneakers. Trust the vision!", isLoveInsight: false };
  }
  if (msg.includes('karthik')) {
    return { text: "Karthik will make a bold move today. The stars are aligned in his favour ✨", isLoveInsight: false };
  }

  // Proposals
  if (msg.includes('propose')) {
    return { text: "She sees you as a friend da… 💔 But friendship is the strongest foundation. Don't give up on what's real.", isLoveInsight: false };
  }

  // Danger
  if (msg.includes('danger') || msg.includes('yamagandam')) {
    return { text: "Yamagandam 😈 Be very careful between 7:30 AM and 9:00 AM. The planetary alignment is suspicious.", isLoveInsight: false };
  }

  // Love questions
  if (msg.includes('love') || msg.includes('crush')) {
    return { text: "Love is not a destination — it's the journey that changes you. Your person is closer than you think 💜", isLoveInsight: false };
  }

  // Future questions
  if (msg.includes('future') || msg.includes('tomorrow')) {
    return { text: "Tomorrow holds what today couldn't contain. Be ready — opportunity wears no uniform 🔮", isLoveInsight: false };
  }

  // Will I / Should I
  if (msg.includes('will i') || msg.includes('should i')) {
    return { text: "The universe says: Not now. But soon. Patience is a superpower da 🌙", isLoveInsight: false };
  }

  // Luck / lucky
  if (msg.includes('luck') || msg.includes('lucky')) {
    return { text: "Lucky colour today: Violet 💜 Lucky number: 7. Don't ignore coincidences!", isLoveInsight: false };
  }

  // Life
  if (msg.includes('life') || msg.includes('study') || msg.includes('exam')) {
    return { text: "Pressure makes diamonds 💎 Your hardest chapter is writing the best story.", isLoveInsight: false };
  }

  // Loneliness
  if (msg.includes('lonely') || msg.includes('alone')) {
    return { text: "Even stars burn alone — but they light up the entire sky 🌟 Your time is coming.", isLoveInsight: false };
  }

  // Hello / hi
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return { text: "Vanakkam! I am DELULU AI 🔮 Ask me anything — past, present, or the uncertain future 🌌", isLoveInsight: false };
  }

  // Thanks
  if (msg.includes('thank')) {
    return { text: "Always here da 💜 The future has many doors. I know which one is yours.", isLoveInsight: false };
  }

  // Default catchall
  return {
    text: "The cosmic signals are unclear right now… But know this: whatever you're feeling is valid and real. Trust the process 🌙✨",
    isLoveInsight: false,
  };
}
