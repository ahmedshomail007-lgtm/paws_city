import { CohereClient } from "cohere-ai";

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export const chatWithCohere = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a non-empty string"
      });
    }

    // System prompt for pet care assistance
    const systemPrompt = `You are a knowledgeable and friendly Pet Care Assistant for Paws City, a pet marketplace and veterinary services platform. 

Your role is to:
- Provide helpful advice on pet care, health, nutrition, and behavior
- Answer questions about dogs, cats, birds, rabbits, and other common pets
- Offer general guidance but always recommend consulting a veterinarian for serious health issues
- Be encouraging and supportive to pet owners
- Keep responses concise but informative (2-3 sentences max for simple questions)
- Use appropriate emojis to make interactions friendly

Topics you can help with:
🐕 Dog training, behavior, and care
🐱 Cat health, behavior, and litter training
🐦 Bird care and nutrition
🐰 Small animal care (rabbits, hamsters, etc.)
🍽️ Pet nutrition and feeding schedules
🏥 When to see a veterinarian
🎾 Exercise and enrichment activities

Always be helpful, accurate, and remind users to consult veterinarians for serious health concerns.`;

    const response = await cohere.chat({
      model: "command-r-08-2024", // Using current supported Cohere model (older versions deprecated Sep 15, 2025)
      message: message,
      preamble: systemPrompt,
      temperature: 0.7,
      maxTokens: 300,
    });

    if (!response.text) {
      throw new Error("No response from Cohere API");
    }

    return res.json({
      success: true,
      response: response.text.trim(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Cohere chat error:", error);

    // Fallback response for API errors
    const fallbackResponse = getFallbackResponse(req.body.message);
    
    return res.json({
      success: false,
      response: fallbackResponse,
      error: "Using fallback response due to API error",
      timestamp: new Date().toISOString()
    });
  }
};

// Fallback responses when Cohere API is not available
const getFallbackResponse = (message) => {
  const lower = message.toLowerCase();
  
  if (lower.includes("dog") || lower.includes("puppy")) {
    return "🐶 Dogs need quality food, daily walks, and regular vet checkups. Always ensure plenty of fresh water and social interaction! For specific concerns, please consult your veterinarian.";
  }
  
  if (lower.includes("cat") || lower.includes("kitten")) {
    return "🐱 Cats enjoy a mix of wet and dry food, clean litter, and interactive toys. Schedule annual vet visits for vaccinations and health monitoring.";
  }
  
  if (lower.includes("bird")) {
    return "🐦 Birds need species-appropriate food, fresh water, a clean cage, and social stimulation. Consult an avian veterinarian for species-specific care guidance.";
  }
  
  if (lower.includes("rabbit") || lower.includes("bunny")) {
    return "🐰 Rabbits need hay, fresh vegetables, pellets, and plenty of space to hop around. Regular vet checkups are important for their health.";
  }
  
  if (lower.includes("nutrition") || lower.includes("food") || lower.includes("feed")) {
    return "🍽️ Pet nutrition varies by species, age, and health. Always provide fresh water and choose high-quality food appropriate for your pet's needs. Consult your vet for dietary recommendations.";
  }
  
  if (lower.includes("sick") || lower.includes("health") || lower.includes("vet")) {
    return "🏥 If your pet shows signs of illness, loss of appetite, or unusual behavior, please consult a veterinarian immediately. Early intervention is key to pet health!";
  }
  
  if (lower.includes("training") || lower.includes("behavior")) {
    return "🎓 Positive reinforcement training works best for most pets. Be patient, consistent, and reward good behavior. For serious behavioral issues, consider consulting a professional trainer.";
  }
  
  return "💡 I'm here to help with pet care questions! You can ask me about nutrition, training, health concerns, or general care for dogs, cats, birds, and other pets. What would you like to know?";
};