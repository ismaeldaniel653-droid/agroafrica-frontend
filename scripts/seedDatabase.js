/**
 * 🌱 Script de Seed pour AgroAfrica
 * 
 * Ce script peuple la base de données avec :
 * - 15 produits de démonstration (agricole, artisanat, coopérative)
 * - 3 comptes de test (utilisateur, vendeur, admin)
 * 
 * Usage : node scripts/seedDatabase.js
 * 
 * Prérequis : Le backend doit être en cours d'exécution
 * et accessible via API_BASE_URL.
 */

const API_BASE_URL = process.env.API_BASE_URL || 'https://agroafrica-backend.onrender.com/api'

// ============================================
// DONNÉES DE TEST
// ============================================

const USERS = [
  {
    name: 'Jean Test',
    email: 'test@agroafrica.com',
    password: 'Test123!',
    role: 'acheteur',
    phone: '691000001',
    adresse: 'Douala, Cameroun',
  },
  {
    name: 'Marie Vendeur',
    email: 'vendeur@agroafrica.com',
    password: 'Vendeur123!',
    role: 'vendeur',
    phone: '691000002',
    adresse: 'Yaoundé, Cameroun',
  },
  {
    name: 'Admin AgroAfrica',
    email: 'admin@agroafrica.com',
    password: 'Admin123!',
    role: 'admin',
    phone: '691000003',
    adresse: 'Douala, Cameroun',
  },
]

const PRODUCTS = [
  // ===== CATÉGORIE AGRICOLE =====
  {
    name: 'Cacao bio Bassa\'a',
    category: 'agricole',
    price: 3500,
    stock: 150,
    origin: 'Littoral, Cameroun',
    badge: 'bio',
    emoji: '🍫',
    seller: 'Coopérative Bassa\'a',
    description: 'Cacao biologique de haute qualité issu de l\'agriculture durable. Parfait pour la production de chocolat artisanale. Certifié commerce équitable.',
    unit: 'kg',
    status: 'actif',
  },
  {
    name: 'Café Arabica Mbouda',
    category: 'agricole',
    price: 4500,
    stock: 80,
    origin: 'Ouest, Cameroun',
    badge: 'nouveau',
    emoji: '☕',
    seller: 'Ferme des Hauts Plateaux',
    description: 'Café Arabica pur de la région de Mbouda. Arôme riche avec des notes de chocolat et d\'agrumes. Torréfaction artisanale.',
    unit: 'kg',
    status: 'actif',
  },
  {
    name: 'Miel Blanc de l\'Adamaoua',
    category: 'agricole',
    price: 6000,
    stock: 40,
    origin: 'Adamaoua, Cameroun',
    badge: 'populaire',
    emoji: '🍯',
    seller: 'Ruchers du Sahel',
    description: 'Miel blanc pur récolté dans les savanes de l\'Adamaoua. Reconnu pour ses vertus médicinales et son goût unique.',
    unit: '500ml',
    status: 'actif',
  },
  {
    name: 'Huile de Palme Rouge',
    category: 'agricole',
    price: 2500,
    stock: 200,
    origin: 'Sud, Cameroun',
    badge: null,
    emoji: '🥥',
    seller: 'Producteurs du Sud',
    description: 'Huile de palme rouge traditionnelle, riche en vitamines A et E. Idéale pour la cuisine africaine authentique.',
    unit: 'litre',
    status: 'actif',
  },
  {
    name: 'Banane Plantain Mûre',
    category: 'agricole',
    price: 1500,
    stock: 300,
    origin: 'Centre, Cameroun',
    badge: 'promo',
    emoji: '🍌',
    seller: 'Ferme Agropastorale du Centre',
    description: 'Banane plantain bien mûre, idéale pour les braisés ou les frites. Produit local de saison.',
    unit: 'régime',
    status: 'actif',
  },
  {
    name: 'Macabo Blanc',
    category: 'agricole',
    price: 2000,
    stock: 180,
    origin: 'Ouest, Cameroun',
    badge: null,
    emoji: '🥔',
    seller: 'Coopérative des Femmes de l\'Ouest',
    description: 'Macabo blanc fraîchement récolté. Ingrédient de base pour le couscous et les purées traditionnelles.',
    unit: 'kg',
    status: 'actif',
  },

  // ===== CATÉGORIE ARTISANAT =====
  {
    name: 'Statue en Bois Bamiléké',
    category: 'artisanat',
    price: 15000,
    stock: 10,
    origin: 'Ouest, Cameroun',
    badge: 'artisan',
    emoji: '🗿',
    seller: 'Atelier Mbog Lia',
    description: 'Statue sculptée à la main en bois d\'Iroko par les artisans Bamiléké. Chaque pièce est unique et raconte une histoire ancestrale.',
    unit: 'pièce',
    status: 'actif',
  },
  {
    name: 'Panier Tressé Ndebele',
    category: 'artisanat',
    price: 8500,
    stock: 25,
    origin: 'Nord, Cameroun',
    badge: 'artisan',
    emoji: '🧺',
    seller: 'Artisanes du Nord',
    description: 'Panier traditionnel tressé à la main avec des fibres végétales naturelles. Motifs géométriques inspirés des traditions Ndebele.',
    unit: 'pièce',
    status: 'actif',
  },
  {
    name: 'Masque Rituel Beti',
    category: 'artisanat',
    price: 25000,
    stock: 5,
    origin: 'Centre, Cameroun',
    badge: 'collection',
    emoji: '🎭',
    seller: 'Galerie d\'Art Africain',
    description: 'Masque rituel traditionnel Beti en bois sculpté et peint à la main. Pièce de collection authentique avec certificat d\'origine.',
    unit: 'pièce',
    status: 'actif',
  },
  {
    name: 'Boucles d\'Oreilles en Perles',
    category: 'artisanat',
    price: 3500,
    stock: 50,
    origin: 'Littoral, Cameroun',
    badge: 'nouveau',
    emoji: '📿',
    seller: 'Créations Féminines de Douala',
    description: 'Boucles d\'oreilles artisanales en perles de verre colorées. Légères et élégantes, parfaites pour toutes les occasions.',
    unit: 'paire',
    status: 'actif',
  },
  {
    name: 'Sac en Raphia Naturel',
    category: 'artisanat',
    price: 12000,
    stock: 15,
    origin: 'Littoral, Cameroun',
    badge: 'populaire',
    emoji: '👜',
    seller: 'Tisserands de la Sanaga',
    description: 'Sac à main en raphia naturel tressé à la main. Doublure en tissu traditionnel bazin. Idéal pour un look africain chic.',
    unit: 'pièce',
    status: 'actif',
  },

  // ===== CATÉGORIE COOPÉRATIVE =====
  {
    name: 'Beurre de Karité Bio',
    category: 'cooperative',
    price: 4000,
    stock: 60,
    origin: 'Nord, Cameroun',
    badge: 'bio',
    emoji: '🧴',
    seller: 'Coopérative des Femmes du Nord',
    description: 'Beurre de karité pur biologique produit par les femmes du Nord Cameroun. Riche en vitamines pour les soins de la peau et des cheveux.',
    unit: '250g',
    status: 'actif',
  },
  {
    name: 'Gingembre Frais Bio',
    category: 'cooperative',
    price: 1800,
    stock: 100,
    origin: 'Sud-Ouest, Cameroun',
    badge: 'bio',
    emoji: '🫚',
    seller: 'Coopérative Agricole du Sud-Ouest',
    description: 'Gingembre frais biologique cultivé sans pesticides. Idéal pour le thé, les jus et la cuisine. Riche en antioxydants.',
    unit: 'kg',
    status: 'actif',
  },
  {
    name: 'Manioc Fermenté',
    category: 'cooperative',
    price: 1200,
    stock: 250,
    origin: 'Centre, Cameroun',
    badge: null,
    emoji: '🫓',
    seller: 'Union des Producteurs du Centre',
    description: 'Manioc fermenté prêt à être transformé en couscous ou en bâton de manioc. Produit traditionnel de haute qualité.',
    unit: 'kg',
    status: 'actif',
  },
  {
    name: 'Piment Rouge Séché',
    category: 'cooperative',
    price: 800,
    stock: 500,
    origin: 'Extrême-Nord, Cameroun',
    badge: 'promo',
    emoji: '🌶️',
    seller: 'Ferme Agro-Sahélienne',
    description: 'Piment rouge séché au soleil. Très relevé, parfait pour les sauces et épices africaines. Conditionné sous vide.',
    unit: '100g',
    status: 'actif',
  },
]

// ============================================
// FONCTIONS API
// ============================================

async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (body) options.body = JSON.stringify(body)

  const response = await fetch(url, options)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(`❌ ${method} ${endpoint} → ${response.status}: ${data.message || JSON.stringify(data)}`)
  }

  return data
}

// ============================================
// FONCTIONS PRINCIPALES
// ============================================

async function seedUsers() {
  console.log('\n👤 Création des utilisateurs de test...')
  const createdUsers = []

  for (const user of USERS) {
    try {
      // Tentative de connexion d'abord (au cas où l'utilisateur existe déjà)
      try {
        const loginRes = await apiRequest('/auth/login', 'POST', {
          email: user.email,
          password: user.password,
        })
        console.log(`  ✅ ${user.email} — déjà existant (connexion réussie)`)
        createdUsers.push({ ...user, token: loginRes.token, id: loginRes.user?._id })
        continue
      } catch (loginErr) {
        // Si 401, l'utilisateur n'existe pas, on crée
        if (!loginErr.message.includes('401')) {
          // Autre erreur (rate limiting, etc.) — on skip
          console.log(`  ⚠️  ${user.email} — ${loginErr.message}`)
          continue
        }
      }

      // Inscription
      const registerRes = await apiRequest('/auth/register', 'POST', {
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone || `69${String(Date.now()).slice(-8)}`,
        role: user.role || 'acheteur',
      })
      console.log(`  ✅ ${user.email} — inscrit avec succès`)

      // Si le rôle n'est pas "acheteur", on connecte puis on met à jour le rôle
      if (user.role !== 'acheteur') {
        const loginRes = await apiRequest('/auth/login', 'POST', {
          email: user.email,
          password: user.password,
        })
        createdUsers.push({ ...user, token: loginRes.token, id: loginRes.user?._id })
      } else {
        createdUsers.push({ ...user, token: registerRes.token, id: registerRes.user?._id })
      }
    } catch (err) {
      console.log(`  ❌ ${user.email} — ${err.message}`)
    }
  }

  return createdUsers
}

async function seedProducts(users) {
  console.log('\n📦 Création des produits de démonstration...')
  const sellerUser = users.find(u => u.role === 'vendeur')

  if (!sellerUser) {
    console.log('  ⚠️  Aucun vendeur disponible pour associer les produits')
    return []
  }

  const createdProducts = []

  for (const product of PRODUCTS) {
    try {
      // Vérifier si le produit existe déjà (recherche par nom)
      try {
        const searchRes = await apiRequest(`/products?search=${encodeURIComponent(product.name)}`, 'GET', null, sellerUser.token)
        if (searchRes.products?.length > 0) {
          console.log(`  ✅ ${product.name} — déjà existant`)
          createdProducts.push(searchRes.products[0])
          continue
        }
      } catch (e) {
        // Si la recherche échoue, on continue pour créer
      }

      // Création du produit
      const productData = {
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        origin: product.origin,
        badge: product.badge || null,
        emoji: product.emoji || null,
        seller: product.seller || sellerUser.name,
        description: product.description || '',
        unit: product.unit || 'pièce',
        status: product.status || 'actif',
        sellerId: sellerUser.id || null,
      }

      const created = await apiRequest('/products', 'POST', productData, sellerUser.token)
      console.log(`  ✅ ${product.name} — créé (${product.price} FCFA)`)
      createdProducts.push(created.product || created)
    } catch (err) {
      console.log(`  ❌ ${product.name} — ${err.message}`)
    }
  }

  return createdProducts
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('═══════════════════════════════════════')
  console.log('   🌱 SEED AGROAFRICA DATABASE')
  console.log('═══════════════════════════════════════')
  console.log(`   API : ${API_BASE_URL}`)
  console.log('═══════════════════════════════════════\n')

  const startTime = Date.now()

  try {
    // Étape 1 : Création des utilisateurs
    const users = await seedUsers()

    // Étape 2 : Création des produits
    const products = await seedProducts(users)

    // Résumé
    const duration = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log('\n═══════════════════════════════════════')
    console.log('   📊 RÉSUMÉ')
    console.log('═══════════════════════════════════════')
    console.log(`   ✅ ${users.length} utilisateurs créés`)
    console.log(`      - ${users.map(u => u.email).join(', ')}`)
    console.log(`   ✅ ${products.length} produits créés`)
    console.log(`   ⏱️  Durée : ${duration}s`)
    console.log('═══════════════════════════════════════\n')

    if (users.length === 0 && products.length === 0) {
      console.log('⚠️  Aucune donnée créée. Vérifiez que le backend est accessible.')
      console.log(`   API URL : ${API_BASE_URL}`)
      process.exit(1)
    }

    console.log('🎉 Seed terminé avec succès !')
  } catch (err) {
    console.error('\n🔥 Erreur fatale :', err.message)
    process.exit(1)
  }
}

main()