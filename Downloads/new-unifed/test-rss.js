// Test simple de l'API RSS
const fetch = require('node-fetch');

async function testRssApi() {
  try {
    console.log('🧪 Test de l\'API RSS...');
    const response = await fetch('http://localhost:3001/api/rss');
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ API RSS fonctionne!');
    console.log(`📰 ${data.items?.length || 0} articles trouvés`);
    
    if (data.items && data.items.length > 0) {
      console.log('Premier article:', data.items[0].title);
    }
    
  } catch (error) {
    console.error('❌ Erreur API RSS:', error.message);
  }
}

testRssApi();