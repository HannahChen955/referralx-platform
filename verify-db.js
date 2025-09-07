require('dotenv').config({path:'.env.local'});
const { Client } = require('pg');

async function verifyDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ 数据库连接成功!');
    
    // 创建测试表
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ 创建表成功!');

    // 插入测试数据
    const result = await client.query(`
      INSERT INTO test_table (name) VALUES ($1) RETURNING id, name, created_at
    `, ['测试数据']);
    
    console.log('✅ 插入数据成功:', result.rows[0]);

    // 查询数据
    const queryResult = await client.query('SELECT * FROM test_table');
    console.log('✅ 查询数据:', queryResult.rows);
    
    // 清理测试表
    await client.query('DROP TABLE test_table');
    console.log('✅ 清理测试表成功!');

  } catch (error) {
    console.error('❌ 数据库操作失败:', error.message);
  } finally {
    await client.end();
  }
}

verifyDatabase();