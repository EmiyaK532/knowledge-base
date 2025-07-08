import { QdrantClient } from '@qdrant/js-client-rest';

export class DatabaseService {
  private client: QdrantClient;
  private qdrantUrl: string;

  constructor() {
    this.qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';
    this.client = new QdrantClient({
      url: this.qdrantUrl,
      apiKey: process.env.QDRANT_API_KEY
    });
  }

  async checkConnection(): Promise<{
    connected: boolean;
    url: string;
    version?: string;
    error?: string;
    collections?: number;
  }> {
    try {
      console.log(`🔍 正在检查 Qdrant 数据库连接: ${this.qdrantUrl}`);
      
      // 测试连接
      try {
        await this.client.getCollections();
      } catch (error) {
        throw new Error('无法连接到 Qdrant 服务器');
      }

      // 获取集合列表
      const collections = await this.client.getCollections();
      const collectionCount = collections.collections.length;

      console.log(`✅ Qdrant 数据库连接成功!`);
      console.log(`📊 当前集合数量: ${collectionCount}`);
      
      if (collectionCount > 0) {
        console.log(`📂 已有集合:`);
        collections.collections.forEach((collection, index) => {
          console.log(`   ${index + 1}. ${collection.name}`);
        });
      }

      return {
        connected: true,
        url: this.qdrantUrl,
        collections: collectionCount
      };

    } catch (error: any) {
      const errorMessage = error.message || '未知错误';
      console.log(`❌ Qdrant 数据库连接失败!`);
      console.log(`🔗 尝试连接: ${this.qdrantUrl}`);
      console.log(`💥 错误详情: ${errorMessage}`);
      
      // 提供故障排查建议
      this.printTroubleshootingTips();

      return {
        connected: false,
        url: this.qdrantUrl,
        error: errorMessage
      };
    }
  }

  private printTroubleshootingTips() {
    console.log(`\n🛠️  故障排查建议:`);
    console.log(`1. 检查 Docker 容器是否运行:`);
    console.log(`   docker ps | grep qdrant`);
    console.log(`\n2. 如果容器未运行，启动 Qdrant:`);
    console.log(`   docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant`);
    console.log(`\n3. 检查端口是否被占用:`);
    console.log(`   lsof -i :6333`);
    console.log(`\n4. 验证连接 URL 配置:`);
    console.log(`   当前配置: ${this.qdrantUrl}`);
    console.log(`   环境变量: QDRANT_URL=${process.env.QDRANT_URL || '未设置'}`);
    console.log(`\n5. 测试直接访问:`);
    console.log(`   curl ${this.qdrantUrl}/collections`);
    console.log(`\n6. 查看 Qdrant 容器日志:`);
    console.log(`   docker logs [container_id]`);
    console.log(`\n📚 更多信息请查看: https://qdrant.tech/documentation/\n`);
  }

  async initializeCollections(): Promise<void> {
    try {
      console.log(`\n🚀 正在初始化向量集合...`);
      
      const vectorService = await import('./vectorService');
      const service = new vectorService.VectorService();
      
      await service.initCollection();
      
      console.log(`✅ 向量集合初始化完成!`);
      
      // 显示集合状态
      await this.showCollectionStatus();
      
    } catch (error: any) {
      console.log(`❌ 向量集合初始化失败: ${error.message}`);
      throw error;
    }
  }

  async showCollectionStatus(): Promise<void> {
    try {
      const collections = await this.client.getCollections();
      
      console.log(`\n📊 向量数据库状态:`);
      console.log(`┌─────────────────────────────────────────────────────────┐`);
      console.log(`│  集合名称           │  向量数量     │  状态            │`);
      console.log(`├─────────────────────────────────────────────────────────┤`);
      
      if (collections.collections.length === 0) {
        console.log(`│  暂无集合                                               │`);
      } else {
        for (const collection of collections.collections) {
          const name = collection.name.padEnd(18);
          const count = 'N/A'.padEnd(12);
          const status = '✅ 正常';
          console.log(`│  ${name}│  ${count}│  ${status.padEnd(15)}│`);
        }
      }
      
      console.log(`└─────────────────────────────────────────────────────────┘\n`);
      
    } catch (error: any) {
      console.log(`❌ 获取集合状态失败: ${error.message}`);
    }
  }

  async getConnectionInfo(): Promise<{
    database: string;
    status: string;
    url: string;
    collections: number;
    health: 'healthy' | 'unhealthy' | 'unknown';
  }> {
    try {
      const collections = await this.client.getCollections();
      
      return {
        database: 'Qdrant',
        status: 'connected',
        url: this.qdrantUrl,
        collections: collections.collections.length,
        health: 'healthy'
      };
    } catch (error) {
      return {
        database: 'Qdrant',
        status: 'disconnected',
        url: this.qdrantUrl,
        collections: 0,
        health: 'unhealthy'
      };
    }
  }
}