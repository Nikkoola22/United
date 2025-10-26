import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Phone, Mail, MapPin, ArrowRight, Send, ArrowLeft, Search, Rss, Calculator } from "lucide-react"

// --- IMPORTATIONS DES DONNÉES ---
import { sommaire } from "./data/sommaire.ts"
import { chapitres } from "./data/temps.ts"
import { formation } from "./data/formation.ts"
import { teletravailData } from "./data/teletravail.ts"
import { infoItems } from "./data/info-data.ts"
import { ifse1Data, getAllDirections, getIFSE2ByDirection, getDirectionFullName } from "./data/rifseep-data.ts"
import { franceInfoRss } from "./data/rss-data.ts"
import AdminPanel from "./components/AdminPanel.tsx"
import CalculateurCIA from "./components/CalculateurCIA.tsx"


// --- CONFIGURATION API PERPLEXITY ---
const BACKEND_API_URL = "http://localhost:3001/api/completions"

// --- RSS ITEM TYPE ---
interface RssItem {
  title: string
  link: string
  pubDate: string
}

// --- TYPES ---
interface ChatMessage {
  type: "user" | "assistant"
  content: string
  timestamp: Date
}
interface InfoItem {
  id: number
  title: string
  content: string
}
interface ChatbotState {
  currentView: "menu" | "chat" | "calculators"
  selectedDomain: number | null
  messages: ChatMessage[]
  isProcessing: boolean
}

// --- PARSING DES DONNÉES ---
const sommaireData = typeof sommaire === 'string' ? JSON.parse(sommaire) : sommaire

// --- FONCTION DE NETTOYAGE ---
const nettoyerChaine = (chaine: string): string => {
  if (typeof chaine !== "string") return ""
  return chaine
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .trim()
}

// --- DICTIONNAIRE DE SYNONYMES ---
const synonymes: Record<string, string[]> = {
  "forfait": ["forfait annuel", "jours forfait", "15 jours", "quota annuel"],
  "teletravail": ["télétravail", "travail distance", "domicile", "remote"],
  "conge": ["congés", "vacances", "absence", "cp", "autorisation absence"],
  "formation": ["stage", "cours", "cpf", "qualification"],
  "horaire": ["horaires", "temps travail", "planning", "heures"],
  "mariage": ["mariage", "pacs", "wedding", "union", "époux", "épouse"],
  "naissance": ["naissance", "accouchement", "enfant", "bébé", "nouveau né"],
  "deuil": ["deuil", "décès", "enterrement", "obsèques", "funérailles"],
  "rtt": ["RTT", "artt", "temps repo", "jours repos"],
  "astreinte": ["astreinte", "permanence", "garde", "nuit"],
  "maladie": ["maladie", "arrêt maladie", "CLM", "CLD"],
  "cet": ["cet", "compte épargne temps", "épargne", "compte repos"],
  "journee_solidarite": ["journée solidarité", "jour solidarité", "jour supplémentaire"],
  "temps partiel": ["temps partiel", "quotité", "pourcentage"]
}

// --- FONCTION D'EXPANSION DES SYNONYMES ---
const expandirAvecSynonymes = (terme: string): string[] => {
  const termeNettoye = nettoyerChaine(terme)
  const resultats = [termeNettoye]
  
  for (const [motCle, syns] of Object.entries(synonymes)) {
    if (termeNettoye.includes(motCle) || syns.some(syn => termeNettoye.includes(nettoyerChaine(syn)))) {
      resultats.push(motCle, ...syns.map(nettoyerChaine))
    }
  }
  
  return [...new Set(resultats)]
}

// --- FONCTION DE RECHERCHE ---
const trouverContextePertinent = (question: string): string => {
  const questionNettoyee = nettoyerChaine(question)
  const motsQuestionNettoyes = questionNettoyee.split(/\s+/).filter((mot) => mot.length > 0)
  
  // Expansion avec synonymes
  const motsFinalAvecSynonymes = new Set<string>()
  motsQuestionNettoyes.forEach(mot => {
    const syns = expandirAvecSynonymes(mot)
    syns.forEach(syn => motsFinalAvecSynonymes.add(syn))
  })
  
  
  const chapitresTrouves = new Map<number, { score: number }>()

  sommaireData.chapitres.forEach((chapitreItem: any, index: number) => {
    let score = 0
    
    // Utiliser idContenu au lieu de l'index pour la correspondance
    const chapitreId = chapitreItem.idContenu || (index + 1)

    const motsClesChapitre = chapitreItem.mots_cles || []
    const motsClesArticles = (chapitreItem.articles || []).flatMap((article: any) => article.mots_cles || [])
    const tousLesMotsCles = [...motsClesChapitre, ...motsClesArticles]

    tousLesMotsCles.forEach((motCle: string) => {
      const motCleNettoye = nettoyerChaine(motCle)
      if (!motCleNettoye) return

      // Recherche exacte (priorité absolue)
      if (motsFinalAvecSynonymes.has(motCleNettoye)) {
        score += 10
      } 
      // Recherche si mot clé contient un mot de la question
      else if (questionNettoyee.includes(motCleNettoye)) {
        score += 5
      } 
      // Recherche partielle seulement si pas de match exact
      else {
        for (const motQuestion of motsFinalAvecSynonymes) {
          if (motCleNettoye.includes(motQuestion) || motQuestion.includes(motCleNettoye)) {
            score += 2  // Score plus faible pour les matches partiels
            break  // Compter une seule fois par motCle
          }
        }
      }
    })

    if (score > 0) {
      const chapitreExistant = chapitresTrouves.get(chapitreId) || { score: 0 }
      chapitreExistant.score += score
      chapitresTrouves.set(chapitreId, chapitreExistant)
    }
  })

  if (chapitresTrouves.size === 0) {
    return (
      "Aucun chapitre spécifique trouvé pour cette question. Voici un aperçu général des thèmes: " +
      sommaireData.chapitres.map((s: any) => s.titre).join(", ")
    )
  }

  const resultatsTries = Array.from(chapitresTrouves.entries())
    .sort(([idA, a], [idB, b]) => {
      // Trier d'abord par score (décroissant)
      if (b.score !== a.score) {
        return b.score - a.score
      }
      // Si scores égaux, favoriser les chapitres qui contiennent "mariage" ou "forfait" exactement
      const chapitreA = sommaireData.chapitres.find((ch: any) => (ch.idContenu || 0) === idA)
      const chapitreB = sommaireData.chapitres.find((ch: any) => (ch.idContenu || 0) === idB)
      const motsDesArticlesA = (chapitreA?.articles || []).map((a: any) => a.titre).join(" ").toLowerCase()
      const motsDesArticlesB = (chapitreB?.articles || []).map((a: any) => a.titre).join(" ").toLowerCase()
      const questionLow = questionNettoyee.toLowerCase()
      
      const scoreArticlesA = motsDesArticlesA.includes(questionLow) ? 1 : 0
      const scoreArticlesB = motsDesArticlesB.includes(questionLow) ? 1 : 0
      
      return scoreArticlesB - scoreArticlesA
    })
    .slice(0, 1)  // Limiter à 1 seul chapitre au lieu de 3 pour éviter le mélange
    .map(([id]) => {
      // Trouver le chapitre correspondant dans le sommaire
      const chapitreData = sommaireData.chapitres.find((ch: any) => (ch.idContenu || 0) === id)
      if (!chapitreData) return null
      
      let contenuTexte = null

      // Gérer les différentes sources selon le sommaire
      if (chapitreData.source === "teletravail") {
        contenuTexte = typeof teletravailData === 'string' ? teletravailData : JSON.stringify(teletravailData)
      } else if (chapitreData.source === "formation") {
        contenuTexte = formation || null
      } else {
        // Par défaut, utiliser les données de temps (chapitres)
        contenuTexte = (chapitres as Record<number, string>)[id] || null
      }

      if (!contenuTexte) {
        return null
      }
      return `Source: ${chapitreData.titre}\nContenu: ${contenuTexte}`
    })
    .filter(Boolean)

  if (resultatsTries.length === 0) {
    return "Aucun contenu textuel trouvé pour les chapitres pertinents."
  }

  return resultatsTries.join("\n\n---\n\n")
}

function App() {
  // --- ÉTATS & REFS ---
  const [chatState, setChatState] = useState<ChatbotState>({
    currentView: "menu",
    selectedDomain: null,
    messages: [],
    isProcessing: false,
  })
  const [inputValue, setInputValue] = useState("")
  const [selectedInfo, setSelectedInfo] = useState<InfoItem | null>(null)
  const [rssItems, setRssItems] = useState<RssItem[]>([])
  const [rssLoading, setRssLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedFunction, setSelectedFunction] = useState<string>("")
  const [selectedDirection, setSelectedDirection] = useState<string>("")
  const [calculatedPrime, setCalculatedPrime] = useState<{ annual: number; monthly: number }>({ annual: 0, monthly: 0 })
  const [selectedIFSE2, setSelectedIFSE2] = useState<Set<number>>(new Set())
  const [activeCalculator, setActiveCalculator] = useState<'primes' | 'cia'>('primes')
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // --- EFFETS ---
  useEffect(() => {
    if (chatState.currentView === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatState.messages, chatState.currentView])

  // --- CHARGER LES ARTICLES RSS ---
  useEffect(() => {
    const fetchRssFeeds = async () => {
      try {
        setRssLoading(true)
        
        // Utiliser le proxy Vite qui redirige vers le serveur Express
        const response = await fetch('/api/rss')
        
        if (!response.ok) {
          console.warn(`Erreur backend: ${response.status}`)
          throw new Error(`Erreur serveur: ${response.status}`)
        }
        
        const data = await response.json()
        const items = data.items || []
        
        if (items.length > 0) {
          // Formater les articles avec le bullet point
          const formattedItems = items.slice(0, 5).map((item: any) => ({
            title: item.title.startsWith('•') ? item.title : `• ${item.title}`,
            link: item.link || '#',
            pubDate: item.pubDate || new Date().toISOString()
          }))
          setRssItems(formattedItems)
        } else {
          throw new Error('Aucun article trouvé')
        }
      } catch (error) {
        console.warn('Impossible de récupérer les flux RSS via le backend, utilisation des données par défaut', error)
        setRssItems(franceInfoRss)
      } finally {
        setRssLoading(false)
      }
    }
    
    fetchRssFeeds()
    
    // Rafraîchir tous les 30 minutes
    const interval = setInterval(fetchRssFeeds, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // --- FONCTIONS DE GESTION ---
  const handleInfoClick = (info: InfoItem) => setSelectedInfo(info)

  const handleDomainSelection = (domainId: number) => {
    setChatState({
      currentView: "chat",
      selectedDomain: domainId,
      messages: [
        {
          type: "assistant",
          content: "Bonjour ! Je suis votre assistant CFDT unifié. Je peux vous aider avec toutes vos questions sur le temps de travail, la formation, le télétravail et bien plus encore. Que souhaitez-vous savoir ?",
          timestamp: new Date(),
        },
      ],
      isProcessing: false,
    })

    setTimeout(() => {
      if (chatContainerRef.current) {
        const headerHeight = 200 // Approximate header height
        const chatPosition = chatContainerRef.current.offsetTop
        const scrollPosition = Math.max(0, chatPosition - headerHeight)

        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        })
      }
      inputRef.current?.focus()
    }, 100)
  }

  const returnToMenu = () => {
    setChatState({ currentView: "menu", selectedDomain: null, messages: [], isProcessing: false })
    setInputValue("")
    setSelectedInfo(null)
  }

  // --- LOGIQUE DU CALCULATEUR DE PRIMES ---
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSelectedFunction("")
    setSelectedDirection("")
    setCalculatedPrime({ annual: 0, monthly: 0 })
  }

  const handleFunctionChange = (functionName: string) => {
    setSelectedFunction(functionName)
    
    // Trouver le montant de la prime basé sur la fonction sélectionnée
    const selectedItem = ifse1Data.find(item => 
      item.category === selectedCategory && item.function === functionName
    )
    
    if (selectedItem) {
      setCalculatedPrime({
        annual: selectedItem.annualAmount,
        monthly: Math.round(selectedItem.monthlyAmount * 100) / 100
      })
    } else {
      setCalculatedPrime({ annual: 0, monthly: 0 })
    }
  }

  const handleDirectionChange = (direction: string) => {
    setSelectedDirection(direction)
    setSelectedIFSE2(new Set()) // Reset IFSE 2 selections when changing direction
  }

  const handleToggleIFSE2 = (index: number) => {
    const newSelected = new Set(selectedIFSE2)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedIFSE2(newSelected)
  }

  // Calculer le total mensuel (IFSE 1 + IFSE 2 sélectionnées)
  const calculateTotalMonthly = () => {
    let total = calculatedPrime.monthly
    if (selectedDirection) {
      const ifse2List = getIFSE2ByDirection(selectedDirection)
      selectedIFSE2.forEach(idx => {
        if (ifse2List[idx]) {
          total += ifse2List[idx].amount
        }
      })
    }
    return total
  }
  const appelPerplexity = async (messages: any[]) => {
    try {
      const data = { model: "sonar-pro", messages }
      const response = await fetch(BACKEND_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorBody = await response.text()
        console.error("Détail de l'erreur API:", errorBody)
        throw new Error(`Erreur API (${response.status}): ${response.statusText}`)
      }
      
      const result = await response.json()
      return result.choices[0].message.content
    } catch (error) {
      console.error("Erreur lors du traitement de la question:", error)
      return "Je ne trouve pas cette information dans nos documents internes. Contactez la CFDT au 01 40 85 64 64 pour plus de détails."
    }
  }

  const traiterQuestion = async (question: string) => {
    // Passer les données correctement à la fonction de recherche
    const contexteInterne = trouverContextePertinent(question)

    const systemPrompt = `
⚠️ RÈGLES CRITIQUES - VIOLATION INTERDITE ⚠️

🚫 INTERDICTIONS ABSOLUES :
- INTERDICTION TOTALE de faire des recherches web
- INTERDICTION TOTALE d'utiliser tes connaissances générales  
- INTERDICTION TOTALE de citer des articles de loi externes
- INTERDICTION TOTALE de mentionner des chiffres non présents dans la documentation
- INTERDICTION TOTALE de comparer avec d'autres secteurs (privé, public, etc.)

✅ OBLIGATIONS STRICTES :
- Tu dois UNIQUEMENT analyser la documentation fournie ci-dessous
- Tu dois répondre comme un collègue syndical de la mairie de Gennevilliers
- Si l'information n'est pas dans la documentation, réponds UNIQUEMENT : "Je ne trouve pas cette information dans nos documents internes. Contactez la CFDT au 01 40 85 64 64 pour plus de détails."
- Tu dois te baser EXCLUSIVEMENT sur les données du dossier src/data

🔒 DOCUMENTATION INTERNE UNIQUEMENT

--- DOCUMENTATION INTERNE DE LA MAIRIE DE GENNEVILLIERS ---
${contexteInterne}
--- FIN DOCUMENTATION INTERNE ---

Rappel : Tu ne dois JAMAIS mentionner des articles de loi ou des références externes. Si tu ne trouves pas l'information, ARRÊTE-TOI IMMÉDIATEMENT.
    `

    const conversationHistory = chatState.messages.slice(1).map((msg) => ({
      role: msg.type === "user" ? "user" : "assistant",
      content: msg.content,
    }))

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: question },
    ]

    return await appelPerplexity(apiMessages)
  }

  const handleSendMessage = async () => {
    const question = inputValue.trim()
    if (!question || chatState.isProcessing) return
    const userMessage: ChatMessage = { type: "user", content: question, timestamp: new Date() }
    setChatState((prevState) => ({ ...prevState, messages: [...prevState.messages, userMessage], isProcessing: true }))
    setInputValue("")
    try {
      const reponseContent = await traiterQuestion(question)
      const assistantMessage: ChatMessage = { type: "assistant", content: reponseContent, timestamp: new Date() }
      setChatState((prevState) => ({ ...prevState, messages: [...prevState.messages, assistantMessage] }))
    } catch (error) {
      console.error("Erreur lors du traitement de la question:", error)
      const errorMessage: ChatMessage = {
        type: "assistant",
        content:
          "Désolé, une erreur est survenue. Veuillez réessayer ou contacter un représentant si le problème persiste.",
        timestamp: new Date(),
      }
      setChatState((prevState) => ({ ...prevState, messages: [...prevState.messages, errorMessage] }))
    } finally {
      setChatState((prevState) => ({ ...prevState, isProcessing: false }))
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // --- RENDU DU COMPOSANT ---
  return (
    <div className="min-h-screen relative">
      {/* Background image with transparency */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url('/unnamed.jpg')`, opacity: 0.3 }}
      ></div>

      {/* Subtle overlay for better text readability */}
      <div className="fixed inset-0 bg-black/20 z-0"></div>

      {/* HEADER PROFESSIONNEL */}
      <header className="relative bg-gradient-to-r from-slate-900/70 via-purple-900/70 to-slate-900/70 backdrop-blur-md shadow-lg border-b border-purple-500/20 z-10 bg-cover bg-center" style={{ backgroundImage: `url('/mairie.jpeg')`, backgroundBlendMode: 'overlay' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-purple-900/80 to-slate-900/80 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 relative z-10">
          <div className="flex items-center justify-between gap-8">
            {/* Logo et texte à gauche */}
            <div className="flex items-center gap-5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src="/logo-cfdt.jpg"
                  alt="Logo CFDT"
                  className="w-32 h-32 object-contain relative transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="space-y-1">
                <h1 className="text-5xl font-light tracking-tight text-white">Atlas</h1>
                <p className="text-base text-slate-300 font-light">Assistant syndical CFDT</p>
              </div>
            </div>
            
            {/* Texte centre */}
            <div className="text-center flex-grow">
              <h2 className="text-2xl font-light text-slate-100 tracking-tight">Mairie de Gennevilliers</h2>
              <p className="text-base text-slate-400 mt-2 font-light">Chatbot d'assistance pour les agents municipaux</p>
            </div>
            
            {/* Contact à droite */}
            <div className="flex items-center gap-4 text-right">
            </div>
          </div>
        </div>
      </header>

      {/* Bandeau NEWS FPT - Pleine largeur sous le header */}
      <section className="relative bg-gradient-to-r from-orange-500/60 via-red-500/60 to-pink-500/60 backdrop-blur-md text-white overflow-hidden w-full shadow-lg border-b border-orange-400/30 z-10">
        <div className="relative h-16 flex items-center overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-40 flex items-center justify-center bg-gradient-to-r from-orange-600/80 to-red-600/80 backdrop-blur z-20 shadow-lg">
            <span className="text-lg font-light tracking-wide text-white">NEWS FPT:</span>
          </div>
          <div className="animate-marquee whitespace-nowrap flex items-center pl-44">
            {[...infoItems, ...infoItems].map((info, index) => (
              <button
                key={`${info.id}-${index}`}
                onClick={() => handleInfoClick(info)}
                className="text-lg font-light mx-6 hover:text-amber-200 transition-all duration-200 cursor-pointer hover:scale-105 text-white"
              >
                #{info.id}: {info.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10">
        {chatState.currentView === "menu" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              {/* Colonne principale - pleine largeur */}
              <div className="lg:col-span-1">
                {selectedInfo && (
                  <section className="info-detail bg-gradient-to-br from-slate-800/80 via-purple-900/80 to-slate-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-purple-500/30 mb-8 max-w-4xl mx-auto hover:shadow-2xl transition-shadow">
                    <h3 className="text-3xl font-light bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">{selectedInfo.title}</h3>
                    <p className="text-slate-200 leading-relaxed">{selectedInfo.content}</p>
                    <button
                      onClick={() => setSelectedInfo(null)}
                      className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Fermer
                    </button>
                  </section>
                )}

                <div className="flex justify-center mb-1 gap-8">
                  <button
                    onClick={() => handleDomainSelection(0)}
                    className="group relative overflow-hidden bg-gradient-to-br from-slate-800/70 via-purple-900/70 to-slate-800/70 backdrop-blur-md border border-purple-500/30 rounded-2xl p-10 transition-all duration-500 hover:border-pink-500/50 hover:shadow-2xl hover:-translate-y-1 w-80 h-96"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col items-center gap-6 h-full justify-between">
                      <div className="relative">
                        <span className="absolute -inset-3 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-2xl opacity-0 group-hover:opacity-100 transition blur-lg group-hover:scale-110"></span>
                        <div className="relative p-6 bg-gradient-to-br from-purple-500/80 to-pink-500/80 backdrop-blur rounded-2xl shadow-2xl group-hover:rotate-2 group-hover:scale-110 transition-all">
                          <Search className="w-16 h-16 text-white" />
                        </div>
                      </div>
                      <h4 className="text-2xl font-light tracking-tight text-white group-hover:text-pink-200">
                        Recherche Unifiée
                      </h4>
                      <p className="text-center text-slate-300 font-light text-sm">
                        Temps de travail, formation, télétravail - Recherche dans tous les documents
                      </p>
                      <div className="flex items-center gap-2 text-pink-400 opacity-0 group-hover:opacity-100 transition">
                        <span className="font-light text-sm">Accéder à l&apos;assistant</span>
                        <ArrowRight className="w-4 h-4 animate-pulse" />
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setChatState({ ...chatState, currentView: 'calculators' })}
                    className="group relative overflow-hidden bg-gradient-to-br from-slate-800/70 via-blue-900/70 to-slate-800/70 backdrop-blur-md border border-blue-500/30 rounded-2xl p-10 transition-all duration-500 hover:border-cyan-500/50 hover:shadow-2xl hover:-translate-y-1 w-80 h-96"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col items-center gap-6 h-full justify-between">
                      <div className="relative">
                        <span className="absolute -inset-3 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-2xl opacity-0 group-hover:opacity-100 transition blur-lg group-hover:scale-110"></span>
                        <div className="relative p-6 bg-gradient-to-br from-blue-500/80 to-cyan-500/80 backdrop-blur rounded-2xl shadow-2xl group-hover:rotate-2 group-hover:scale-110 transition-all">
                          <Calculator className="w-16 h-16 text-white" />
                        </div>
                      </div>
                      <h4 className="text-2xl font-light tracking-tight text-white group-hover:text-cyan-200">
                        Calculateurs
                      </h4>
                      <p className="text-center text-slate-300 font-light text-sm">
                        Primes IFSE - Calcul CIA - Outils de simulation
                      </p>
                      <div className="flex items-center gap-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition">
                        <span className="font-light text-sm">Accéder aux calculateurs</span>
                        <ArrowRight className="w-4 h-4 animate-pulse" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* --- SECTION CALCULATEURS FULL-WIDTH --- */}
      {chatState.currentView === 'calculators' && (
      <section className="relative max-w-full mx-auto bg-gradient-to-br from-slate-900/80 via-blue-950/80 to-slate-900/80 backdrop-blur-md border-y border-blue-500/30 shadow-2xl z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-12">
          {/* Bouton Retour */}
          <button
            onClick={() => setChatState({ ...chatState, currentView: 'menu' })}
            className="mb-6 flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 font-light"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au menu</span>
          </button>

          <div className="w-full bg-gradient-to-br from-slate-800/95 via-blue-900/95 to-slate-800/95 backdrop-blur-md border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header avec onglets */}
            <div className="bg-gradient-to-r from-slate-800/95 to-blue-900/95 backdrop-blur-md border-b border-blue-500/30 p-0 z-10">
              <div className="flex gap-2 p-4">
                <button
                  onClick={() => setActiveCalculator('primes')}
                  className={`flex-1 px-4 py-3 rounded-lg text-base font-light transition-all ${
                    activeCalculator === 'primes'
                      ? 'bg-blue-600/70 text-white border border-blue-400/50'
                      : 'bg-slate-700/50 text-slate-300 border border-slate-600/30 hover:bg-slate-700/70'
                  }`}
                >
                  📈 Primes IFSE
                </button>
                <button
                  onClick={() => setActiveCalculator('cia')}
                  className={`flex-1 px-4 py-3 rounded-lg text-base font-light transition-all ${
                    activeCalculator === 'cia'
                      ? 'bg-orange-600/70 text-white border border-orange-400/50'
                      : 'bg-slate-700/50 text-slate-300 border border-slate-600/30 hover:bg-slate-700/70'
                  }`}
                >
                  📊 CIA
                </button>
              </div>
            </div>

            {/* Contenu des calculateurs */}
            <div className="p-8 space-y-4">
              {/* Calculateur PRIMES */}
              {activeCalculator === 'primes' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-light text-white tracking-tight">Calcul des Primes</h3>
                  </div>
                        
                  {/* Sélection de la catégorie */}
                  <div>
                    <label className="block text-base font-light text-slate-300 mb-2">Catégorie</label>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-blue-500/30 rounded-lg text-white text-base focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 outline-none transition-all cursor-pointer"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="A">Catégorie A</option>
                      <option value="B">Catégorie B</option>
                      <option value="C">Catégorie C</option>
                    </select>
                  </div>

                  {/* Sélection de la fonction (IFSE 1) */}
                  <div>
                    <label className="block text-base font-light text-slate-300 mb-2">Fonction (IFSE 1)</label>
                    <select 
                      value={selectedFunction}
                      onChange={(e) => handleFunctionChange(e.target.value)}
                      disabled={!selectedCategory}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-blue-500/30 rounded-lg text-white text-base focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 outline-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Sélectionner une fonction</option>
                      {selectedCategory && ifse1Data.filter(item => item.category === selectedCategory).map((item) => (
                        <option key={item.functionCode} value={item.function}>
                          {item.function}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Résultat IFSE 1 */}
                  {calculatedPrime.annual > 0 && (
                    <div className="mt-4 pt-4 border-t border-blue-500/20">
                      <p className="text-sm font-light text-slate-400 mb-1">IFSE 1 - Prime de fonction</p>
                      <p className="text-4xl font-light text-blue-300">{calculatedPrime.annual.toLocaleString('fr-FR')} €/an</p>
                      <p className="text-sm text-slate-400">Soit {calculatedPrime.monthly.toLocaleString('fr-FR')} €/mois</p>
                    </div>
                  )}

                  {/* Sélection de la direction (IFSE 2) */}
                  <div className="mt-4 pt-4 border-t border-blue-500/20">
                    <label className="block text-base font-light text-slate-300 mb-2">Direction (IFSE 2)</label>
                    <select 
                      value={selectedDirection}
                      onChange={(e) => handleDirectionChange(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-blue-500/30 rounded-lg text-white text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 outline-none transition-all cursor-pointer"
                    >
                      <option value="">Sélectionner une direction</option>
                      {getAllDirections().map((dir) => (
                        <option key={dir} value={dir}>
                          {getDirectionFullName(dir)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Affichage des primes IFSE 2 */}
                  {selectedDirection && (
                    <div className="mt-4 pt-4 border-t border-blue-500/20">
                      <p className="text-sm font-light text-slate-400 mb-3">IFSE 2 - Primes complémentaires (cocher pour inclure)</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {getIFSE2ByDirection(selectedDirection).map((prime, idx) => (
                          <div key={idx} className="bg-slate-700/30 rounded-lg p-2 border border-blue-500/20 cursor-pointer hover:bg-slate-700/50 transition" onClick={() => handleToggleIFSE2(idx)}>
                            {/* Checkbox et info principales */}
                            <div className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                checked={selectedIFSE2.has(idx)}
                                onChange={() => handleToggleIFSE2(idx)}
                                className="mt-0.5 cursor-pointer accent-green-400"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-light text-slate-300">{prime.motif}</p>
                                <p className="text-green-400 font-light text-base">{prime.amount.toLocaleString('fr-FR')} €/mois</p>
                                {prime.service && prime.service !== 'Tous services' && (
                                  <p className="text-xs text-slate-400 mt-1">
                                    <span className="font-light">Service:</span> {prime.service}
                                  </p>
                                )}
                                {prime.jobs && prime.jobs.length > 0 && (
                                  <div className="mt-1">
                                    <p className="text-xs text-slate-400 font-light">Métier(s):</p>
                                    <ul className="text-xs text-slate-300 ml-2 mt-0.5 space-y-0.5">
                                      {prime.jobs.map((job, jIdx) => (
                                        <li key={jIdx} className="truncate">
                                          • {job}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TOTAL MENSUEL */}
                  {(calculatedPrime.monthly > 0 || selectedIFSE2.size > 0) && (
                    <div className="mt-4 pt-4 border-t-2 border-green-500/50 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg p-3">
                      <p className="text-sm font-light text-slate-400 mb-2">Montant total mensuel</p>
                      <p className="text-4xl font-light text-green-400">{calculateTotalMonthly().toLocaleString('fr-FR')} €</p>
                      <div className="text-sm text-slate-300 mt-2 space-y-0.5">
                        <p>IFSE 1: {calculatedPrime.monthly.toLocaleString('fr-FR')} €</p>
                        <p>IFSE 2: {Array.from(selectedIFSE2).reduce((sum, idx) => {
                          const ifse2List = getIFSE2ByDirection(selectedDirection)
                          return sum + (ifse2List[idx]?.amount || 0)
                        }, 0).toLocaleString('fr-FR')} €</p>
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-slate-300 font-light">
                      ℹ️ IFSE 1 : Prime de fonction • IFSE 2 : Sélectionnez les primes applicables
                    </p>
                  </div>
                </div>
              )}

              {/* Calculateur CIA */}
              {activeCalculator === 'cia' && (
                <CalculateurCIA onClose={() => setActiveCalculator('primes')} />
              )}
            </div>
          </div>
        </div>
      </section>
      )}

      <main className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 z-10">
        {chatState.currentView === "chat" && (
          <div
            ref={chatContainerRef}
            className="bg-gradient-to-br from-slate-800/80 via-purple-900/80 to-slate-800/80 backdrop-blur-md border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="bg-gradient-to-r from-purple-600/70 via-pink-600/70 to-purple-600/70 backdrop-blur text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Search className="w-7 h-7 text-pink-200" />
                  <div>
                    <h3 className="text-lg font-light tracking-tight">
                      Assistant CFDT Unifié
                    </h3>
                    <p className="text-purple-100 text-xs font-light">CFDT Gennevilliers</p>
                  </div>
                </div>
                <button
                  onClick={returnToMenu}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm font-light"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Retour</span>
                </button>
              </div>
            </div>
            <div className="min-h-[400px] max-h-[700px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-800/40 to-purple-900/40">
              {chatState.messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl backdrop-blur-sm font-light ${message.type === "user" ? "bg-gradient-to-r from-purple-600/70 to-pink-600/70 text-white shadow-lg" : "bg-slate-700/70 text-slate-100 border border-purple-500/30"}`}
                  >
                    <div className="whitespace-pre-wrap break-words text-sm">{message.content}</div>
                    <div className={`text-xs mt-2 ${message.type === "user" ? "text-purple-100" : "text-slate-400"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
              {chatState.isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-slate-700/70 backdrop-blur-sm border border-purple-500/30 px-4 py-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <span className="text-slate-200 ml-2 text-sm font-light">L&apos;assistant réfléchit...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-purple-500/30 bg-gradient-to-r from-slate-800/80 to-purple-900/80 backdrop-blur-md p-4">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ex: Combien de jours de congés ? Comment utiliser mon CPF ? Télétravail possible ?"
                  className="flex-1 px-4 py-3 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition-all duration-200 bg-slate-700/70 backdrop-blur-sm text-sm font-light text-slate-100 placeholder-slate-400"
                  disabled={chatState.isProcessing}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || chatState.isProcessing}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600/70 to-pink-600/70 backdrop-blur-sm text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl font-light"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Envoyer</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- BANDEAU RSS DÉFILANT --- */}
      <section className="relative bg-gradient-to-r from-blue-600/60 via-indigo-600/60 to-blue-600/60 backdrop-blur-md text-white overflow-hidden w-full shadow-lg border-b border-blue-500/30 z-50 -mt-0">
        <div className="relative h-16 flex items-center overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-56 flex items-center justify-center bg-gradient-to-r from-indigo-700/80 to-blue-700/80 backdrop-blur z-20 shadow-lg">
            <div className="flex items-center gap-3">
              <Rss className="w-5 h-5 text-cyan-300 animate-pulse" />
              <span className="text-lg font-light tracking-wide text-white">FRANCE INFO:</span>
            </div>
          </div>
          <div className="animate-marquee-rss whitespace-nowrap flex items-center pl-60">
            {rssItems.length > 0 ? (
              [...rssItems, ...rssItems, ...rssItems].map((item, index) => (
                <a
                  key={`${index}-${item.title}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-light mx-6 hover:text-cyan-300 transition-all duration-200 cursor-pointer hover:drop-shadow-lg text-white"
                >
                  • {item.title}
                </a>
              ))
            ) : (
              <span className="text-base mx-8 font-light text-slate-100">
                {rssLoading ? "Chargement des articles..." : "Aucun article disponible"}
              </span>
            )}
          </div>
        </div>
      </section>

      <footer 
        className="relative text-slate-400 text-center py-4 mt-0 z-10 border-t border-purple-500/20"
        style={{
          backgroundImage: `
            linear-gradient(to right, 
              rgba(15, 23, 42, 0.85), 
              rgba(88, 28, 135, 0.85), 
              rgba(15, 23, 42, 0.85)
            ),
            url('/mairie.jpeg')
          `,
          backgroundPosition: 'center bottom',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center gap-3 mb-8">
            <span className="text-pink-400 font-light text-base tracking-wide">CFDT Gennevilliers</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-6">
            <a
              href="tel:0140856464"
              className="flex items-center gap-2 text-pink-400/90 hover:text-pink-300 transition-all duration-200 hover:scale-110 font-light text-sm"
            >
              <Phone className="w-5 h-5" />
              <span>01 40 85 64 64</span>
            </a>
            <a
              href="mailto:cfdt-interco@ville-gennevilliers.fr"
              className="flex items-center gap-2 text-pink-400/90 hover:text-pink-300 transition-all duration-200 hover:scale-110 font-light text-sm"
            >
              <Mail className="w-5 h-5" />
              <span>cfdt-interco@ville-gennevilliers.fr</span>
            </a>
            <div className="flex items-center gap-2 text-pink-400/90 font-light text-sm">
              <MapPin className="w-5 h-5" />
              <span>177 av. Gabriel-Péri</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-light">
            92237 Gennevilliers Cedex
          </p>
          
          {/* Bouton Admin */}
          <div className="mt-8 pt-8 border-t border-purple-500/20">
            <button
              onClick={() => setShowAdminPanel(true)}
              className="px-4 py-2 bg-purple-600/50 border border-purple-500/50 text-purple-300 rounded-lg hover:bg-purple-600/70 transition-all duration-200 font-light text-xs"
            >
              Accès Administrateur
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Panel Modal */}
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
    </div>
  );
}


export default App;
