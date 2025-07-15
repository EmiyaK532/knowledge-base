const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: process.env.DASHSCOPE_BASE_URL,
});

async function testEmbedding() {
  try {
    console.log('测试阿里云百炼嵌入模型...');
    console.log('API Key:', process.env.DASHSCOPE_API_KEY ? '已设置' : '未设置');
    console.log('Base URL:', process.env.DASHSCOPE_BASE_URL);
    
    const response = await openai.embeddings.create({
      model: "text-embedding-v3",
      input: "测试文本"
    });
    
    console.log('嵌入向量维度:', response.data[0].embedding.length);
    console.log('前5个向量值:', response.data[0].embedding.slice(0, 5));
    
  } catch (error) {
    console.error('嵌入模型测试失败:', error.message);
    console.error('错误详情:', error.response?.data || error);
  }
}

testEmbedding();
