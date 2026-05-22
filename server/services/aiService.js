import { OpenAI } from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const generateProductDescription = async (productData) => {
  try {
    const { name, category, currentDescription } = productData

    const prompt = `Generate a compelling and professional product description for an e-commerce store.
    
Product Name: ${name}
Category: ${category}
${currentDescription ? `Current Description: ${currentDescription}` : ''}

Please write a description that is:
- Engaging and persuasive
- 2-3 sentences long
- Highlights key benefits and features
- SEO-friendly
- Professional tone`

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('Error generating description:', error)
    throw new Error('Failed to generate product description')
  }
}

export const generateSEOTags = async (productName, description) => {
  try {
    const prompt = `Generate 5-7 SEO-optimized keywords/tags for this product.

Product Name: ${productName}
Description: ${description}

Return only the keywords separated by commas, no explanations.
Focus on searchable terms that customers would use to find this product.`

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 100,
    })

    const tagsString = response.choices[0].message.content
    return tagsString.split(',').map((tag) => tag.trim())
  } catch (error) {
    console.error('Error generating tags:', error)
    throw new Error('Failed to generate SEO tags')
  }
}

export const generateMarketingCaption = async (productName, description) => {
  try {
    const prompt = `Create an engaging marketing caption for social media (Instagram, Facebook, TikTok).

Product Name: ${productName}
Description: ${description}

Requirements:
- Maximum 280 characters (Twitter limit for reference)
- Include relevant emojis
- Call-to-action friendly
- Engaging and trendy tone
- Must be attention-grabbing`

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 150,
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('Error generating caption:', error)
    throw new Error('Failed to generate marketing caption')
  }
}

export const generatePricingRecommendation = async (productData) => {
  try {
    const { name, price, category, salesCount } = productData

    const prompt = `Provide pricing recommendations for an e-commerce product.

Product: ${name}
Category: ${category}
Current Price: $${price}
Sales Count: ${salesCount}

Analyze and provide:
1. Recommended price (with percentage adjustment)
2. Suggested bulk discount strategy
3. Seasonal pricing considerations

Format as JSON with keys: recommendedPrice, bulkDiscount, seasonalNotes`

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 300,
    })

    const responseText = response.choices[0].message.content
    // Try to parse JSON, fallback to string
    try {
      return JSON.parse(responseText)
    } catch {
      return {
        recommendedPrice: price * 1.1,
        bulkDiscount: responseText,
        seasonalNotes: 'Refer to market trends',
      }
    }
  } catch (error) {
    console.error('Error generating pricing recommendation:', error)
    throw new Error('Failed to generate pricing recommendation')
  }
}

export const generateSalesInsights = async (topProducts) => {
  try {
    const productsInfo = topProducts
      .slice(0, 5)
      .map((p) => `${p.name}: $${p.revenue} revenue, ${p.salesCount} sales`)
      .join('\n')

    const prompt = `Analyze sales data and provide business insights.

Top Products:
${productsInfo}

Provide:
1. Key market insights (2-3 sentences)
2. Trending observations
3. 3-4 actionable recommendations

Format the response clearly with sections.`

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
    })

    const responseText = response.choices[0].message.content
    
    // Parse the response into structured data
    const parts = responseText.split('\n\n')
    
    return {
      insights: parts[0] || responseText,
      trending: parts[1] || 'Strong market demand detected',
      suggestions: parts.slice(2) || [],
      fullResponse: responseText,
    }
  } catch (error) {
    console.error('Error generating sales insights:', error)
    throw new Error('Failed to generate sales insights')
  }
}

export default openai
