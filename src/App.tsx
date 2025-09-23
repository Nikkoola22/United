import type React from "react";
import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import {
  Clock,
  GraduationCap,
  Users,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Send,
  ArrowLeft,
  Home,
  Play,
  Pause,
  Volume2,
  Scale,
  Bot,
  HelpCircle,
  Mic,
  MicOff,
} from "lucide-react";

import { sommaire } from "./data/sommaire.ts";
import { chapitres } from "./data/temps.ts";
import { formation } from "./data/formation.ts";
import { teletravailData } from "./data/teletravail.ts";
import { infoItems } from "./data/info-data.ts";
import { podcastEpisodes, type PodcastEpisode } from "./data/podcasts/mp3.ts";
import { faqData } from "./data/FAQ.ts";
import mairieImage from "./assets/mairie.jpeg";

interface ChatMessage {
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}
interface InfoItem {
  id: number;
  title: string;
  content: string;
}
interface ChatbotState {
  currentView: "menu" | "chat" | "faq";
  selectedDomain: number | null;
  messages: ChatMessage[];
  isProcessing: boolean;
}
interface FAQItem {
  id: number;
  question: string;
  reponse: string;
}

// ✅ Nouveau
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = "https://api.perplexity.ai/chat/completions";

const fluxOriginal = "https://www.franceinfo.fr/politique.rss";
const proxyUrl = "https://corsproxy.io/?";
const FLUX_ACTUALITES_URL = proxyUrl + encodeURIComponent(fluxOriginal);

const actualitesSecours = [
  { title: "Réforme des retraites : nouvelles négociations prévues", link: "#", pubDate: new Date().toISOString(), guid: "1" },
  { title: "Budget 2024 : les principales mesures votées", link: "#", pubDate: new Date().toISOString(), guid: "2" },
  { title: "Fonction publique : accord sur les salaires", link: "#", pubDate: new Date().toISOString(), guid: "3" },
  { title: "Télétravail : nouvelles directives gouvernementales", link: "#", pubDate: new Date().toISOString(), guid: "4" },
  { title: "Dialogue social : rencontre avec les syndicats", link: "#", pubDate: new Date().toISOString(), guid: "5" },
];

const sommaireData = JSON.parse(sommaire);

const nettoyerChaine = (chaine: unknown): string => {
  if (typeof chaine !== "string") return "";
  return chaine
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .trim();
};

// =======================
//  NewsTicker avec <a>
// =======================
const NewsTicker: React.FC = () => {
  const [actualites, setActualites] = useState(actualitesSecours);
  const [loading, setLoading] = useState(true);

  // Fonction pour générer un lien via le proxy
  const proxyLink = (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`;

  useEffect(() => {
    const chargerFlux = async () => {
      try {
        const res = await fetch(FLUX_ACTUALITES_URL);
        if (!res.ok) throw new Error("Failed to fetch RSS feed");
        const xml = await res.text();
        const doc = new DOMParser().parseFromString(xml, "text/xml");

        const items = Array.from(doc.querySelectorAll("item"))
          .slice(0, 10)
          .map((item, i) => {
            const rawLink = item.querySelector("link")?.textContent || "";
            const link = rawLink.replace(/\s+/g, " ").trim();

            return {
              title: (item.querySelector("title")?.textContent || `Actualité ${i + 1}`).trim(),
              link,
              pubDate: (item.querySelector("pubDate")?.textContent || new Date().toISOString()).trim(),
              guid: (item.querySelector("guid")?.textContent || `${i}`).trim(),
            };
          });

        if (items.length) setActualites(items);
      } catch {
        console.error("Failed to load RSS feed, using fallback data.");
      } finally {
        setLoading(false);
      }
    };
    chargerFlux();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-blue-900/80 rounded-lg">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
        <span className="ml-2 text-white text-base font-medium">Chargement des actualités...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-blue-900/80 rounded-lg overflow-hidden border border-blue-500/30 shadow-inner">
      <div className="flex items-center whitespace-nowrap py-6 ticker-container">
        <div className="flex animate-ticker hover:[animation-play-state:paused]">
          {[...actualites, ...actualites].map((item, idx) => (
            <a
              key={`${item.guid}-${idx}`}
              href={proxyLink(item.link)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center mx-8 text-white hover:text-blue-200 transition-colors no-underline"
            >
              <span className="mr-2 text-yellow-300 text-xl">📰</span>
              <span className="font-semibold text-lg sm:text-xl">{item.title}</span>
              <span className="mx-6 text-blue-300 text-xl">•</span>
            </a>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-container { overflow: hidden; white-space: nowrap; }
          .animate-ticker { display: inline-flex; animation: ticker 40s linear infinite; }
        `
      }} />
    </div>
  );
};

// =======================
// FAQ Component
// =======================
const FAQSection: React.FC<{ onReturn: () => void }> = ({ onReturn }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null);

  const filteredFAQ = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reponse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/95 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-sm">
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onReturn} className="text-white hover:text-orange-200 p-2 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h3 className="text-xl font-bold text-white">FAQ - Questions fréquentes</h3>
            <p className="text-orange-100 text-sm">Télétravail et Formation - Ville de Gennevilliers</p>
          </div>
        </div>
        <HelpCircle className="w-8 h-8 text-white" />
      </div>

      <div className="p-6">
        {/* Barre de recherche */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher une question ou réponse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Détail FAQ sélectionnée */}
        {selectedFAQ && (
          <div className="mb-6 p-6 bg-orange-50 rounded-xl border border-orange-200">
            <button
              onClick={() => setSelectedFAQ(null)}
              className="float-right text-orange-600 hover:text-orange-800 font-bold text-xl"
            >
              ×
            </button>
            <h4 className="text-lg font-bold text-orange-800 mb-3">{selectedFAQ.question}</h4>
            <p className="text-gray-700 leading-relaxed">{selectedFAQ.reponse}</p>
          </div>
        )}

        {/* Liste des FAQ */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {filteredFAQ.map((faq) => (
            <div
              key={faq.id}
              className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer hover:border-orange-300"
              onClick={() => setSelectedFAQ(faq)}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  {faq.id}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-2 group-hover:text-orange-700">
                    {faq.question}
                  </h4>
                  <p className="text-sm text-gray-600 truncate">
                    {faq.reponse.substring(0, 120)}...
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {filteredFAQ.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucune question trouvée pour "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =======================
//  Trouver contexte
// =======================
const trouverContextePertinent = (question: string): string => {
  const qNet = nettoyerChaine(question);
  const mots = qNet.split(/\s+/).filter(Boolean);
  const scores = new Map<number, number>();

  sommaireData.chapitres.forEach((chap: any, i: number) => {
    let score = 0;
    const keys = [...(chap.mots_cles || []), ...(chap.articles?.flatMap((a: any) => a.mots_cles) || [])];
    keys.forEach((mc: string) => {
      const m = nettoyerChaine(mc);
      if (mots.includes(m)) score += 10;
      else if (qNet.includes(m)) score += 5;
    });
    if (score) scores.set(i + 1, (scores.get(i + 1) || 0) + score);
  });

  if (!scores.size) {
    return "Aucun chapitre spécifique trouvé. Thèmes : " + sommaireData.chapitres.map((c: any) => c.titre).join(", ");
  }

  const top = Array.from(scores.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id]) => {
      const titre = sommaireData.chapitres[id - 1].titre;
      const contenu = (chapitres as Record<number, string>)[id] || "";
      return `Source: ${titre}\nContenu: ${contenu}`;
    });

  return top.join("\n\n---\n\n");
};

// =======================
// Podcast Player
// =======================
const PodcastPlayer: React.FC = () => {
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMinimized, setIsMinimized] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);

    const updateTime = () => setCurrentTime(audio.currentTime || 0);
    const updateDuration = () => {
      if (audio.duration && isFinite(audio.duration)) setDuration(audio.duration);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      const currentIndex = podcastEpisodes.findIndex((e) => e.id === currentEpisode?.id);
      if (currentIndex !== -1 && currentIndex < podcastEpisodes.length - 1) {
        setCurrentEpisode(podcastEpisodes[currentIndex + 1]);
      }
    };
    const handleError = () => {
      setIsPlaying(false);
      setError("Impossible de charger ce podcast. Vérifiez votre connexion.");
    };

    const handlers: { [key: string]: EventListener } = {
      timeupdate: updateTime,
      loadedmetadata: updateDuration,
      canplay: () => {},
      ended: handleEnded,
      error: handleError,
      loadstart: () => {},
      waiting: () => {},
      playing: () => {
        setIsPlaying(true);
      },
      pause: () => setIsPlaying(false),
    };

    Object.entries(handlers).forEach(([evt, fn]) => audio.addEventListener(evt, fn));
    audio.volume = volume;
    if (currentEpisode) audio.load();

    return () => {
      Object.entries(handlers).forEach(([evt, fn]) => audio.removeEventListener(evt, fn));
    };
  }, [currentEpisode, volume]);

  const playPause = async () => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode) return;
    try {
      if (isPlaying) {
        audio.pause();
      } else {
        setError(null);
        await audio.play();
      }
    } catch (err) {
      console.error("Error playing audio:", err);
      setError("Impossible de lire ce podcast.");
      setIsPlaying(false);
    }
  };

  const selectEpisode = (episode: PodcastEpisode) => {
    if (currentEpisode?.id !== episode.id) {
      setCurrentEpisode(episode);
      setIsPlaying(false);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className={`fixed right-4 bottom-20 z-50 transition-all duration-300 ${isMinimized ? "w-48 h-14" : "w-80 h-auto"}`}>
      <div className="flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl shadow-lg border border-purple-500/30 overflow-hidden p-2">
        
        {/* --- Barre haute (minimisée ou étendue) --- */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white p-1.5 hover:bg-white/10 rounded-full"
            >
              {isMinimized ? "🔼" : "🔽"}
            </button>
            {/* vignette + titre toujours visibles */}
            <img
              src="./podcast.jpg"
              alt="Podcast"
              className="w-8 h-8 rounded-full shadow border border-white/20"
            />
            <div className="text-white text-xs font-medium truncate max-w-[7.5rem]">
              {currentEpisode?.title ?? "Podcast CFDT"}
            </div>
          </div>

          {/* bouton play/pause */}
          {currentEpisode && (
            <button
              onClick={playPause}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shrink-0"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          )}

          {/* volume uniquement en mode étendu */}
          {!isMinimized && (
            <div className="flex-grow flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-gray-300" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-purple-300 rounded slider appearance-none"
              />
            </div>
          )}
        </div>

        {/* lecteur audio */}
        <audio
          ref={audioRef}
          src={currentEpisode?.url}
          preload="metadata"
          style={{ display: "none" }}
          crossOrigin="anonymous"
        />

        {/* contenu détaillé quand étendu */}
        {!isMinimized && (
          <div className="mt-4">
            <div className="flex flex-col items-center mb-4">
              <img 
                src="./podcast.jpg"
                alt="Illustration Podcast"
                className="w-32 h-32 object-cover rounded-full shadow-md border-2 border-purple-400"
              />
              <h4 className="text-white font-bold text-center mt-2">Épisodes disponibles</h4>
            </div>
            <ul className="max-h-48 overflow-y-auto">
              {podcastEpisodes.map(episode => (
                <li key={episode.id}>
                  <button
                    onClick={() => selectEpisode(episode)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm text-white mb-1 transition-colors ${
                      currentEpisode?.id === episode.id ? "bg-purple-700 font-semibold" : "bg-purple-800/60 hover:bg-purple-700/80"
                    }`}
                  >
                    {episode.title}
                  </button>
                </li>
              ))}
            </ul>
            {currentEpisode && (
              <div className="mt-2 px-2 text-xs text-purple-200">
                <p className="truncate">Lecture : {currentEpisode.title}</p>
                <div>
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                {error && <div className="text-red-300 mt-1">{error}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// =======================
// App principale
// =======================
export default function App() {
  const [chatState, setChatState] = useState<ChatbotState>({
    currentView: "menu",
    selectedDomain: null,
    messages: [],
    isProcessing: false,
  });
  const [inputValue, setInputValue] = useState("");
  const [selectedInfo, setSelectedInfo] = useState<InfoItem | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [interimText, setInterimText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  // Initialisation de la reconnaissance vocale
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      console.log('SpeechRecognition disponible:', !!SpeechRecognition);
      
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true; // Changé pour true pour voir les résultats intermédiaires
        recognition.lang = 'fr-FR';
        
        recognition.onstart = () => {
          console.log('Reconnaissance vocale démarrée');
          setIsListening(true);
        };
        
        recognition.onresult = (event) => {
          console.log('Résultat de reconnaissance:', event);
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (finalTranscript) {
            console.log('Texte final:', finalTranscript);
            setInputValue(finalTranscript);
            setInterimText("");
            // Envoyer automatiquement après un texte final
            setTimeout(() => {
              if (finalTranscript && finalTranscript.trim()) {
                console.log('🎤 ENVOI AUTOMATIQUE TEXTE FINAL:', finalTranscript);
                console.log('🎤 État avant envoi:', { 
                  selectedDomain: chatState.selectedDomain,
                  isProcessing: chatState.isProcessing,
                  messagesCount: chatState.messages.length
                });
                handleSendMessage(String(finalTranscript));
              }
            }, 500); // Petit délai pour laisser le temps à l'utilisateur de voir le texte
            setIsListening(false);
            // Arrêter explicitement la reconnaissance vocale
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
          } else if (interimTranscript) {
            console.log('Texte intermédiaire:', interimTranscript);
            setInterimText(interimTranscript);
            setInputValue(interimTranscript);
            
            // Réinitialiser le timer de silence
            if (silenceTimeoutRef.current) {
              clearTimeout(silenceTimeoutRef.current);
            }
            
            // Programmer l'envoi automatique après 3 secondes de silence
            silenceTimeoutRef.current = setTimeout(() => {
              if (interimTranscript && interimTranscript.trim()) {
                console.log('🎤 ENVOI AUTOMATIQUE APRÈS SILENCE:', interimTranscript);
                console.log('🎤 État avant envoi:', { 
                  selectedDomain: chatState.selectedDomain,
                  isProcessing: chatState.isProcessing,
                  messagesCount: chatState.messages.length
                });
                setInputValue(interimTranscript);
                handleSendMessage(String(interimTranscript));
                setIsListening(false);
                // Arrêter explicitement la reconnaissance vocale
                if (recognitionRef.current) {
                  recognitionRef.current.stop();
                }
              }
            }, 3000);
          }
        };
        
        recognition.onerror = (event) => {
          console.error('Erreur de reconnaissance vocale:', event.error, event.message);
          setIsListening(false);
          alert(`Erreur de reconnaissance vocale: ${event.error}`);
        };
        
        recognition.onend = () => {
          console.log('Reconnaissance vocale terminée');
          setIsListening(false);
          // Nettoyer le timeout de silence
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
        };
        
        recognitionRef.current = recognition;
      } else {
        console.log('Reconnaissance vocale non supportée');
        setSpeechSupported(false);
      }
    }
  }, []);

  // Nettoyage des timeouts lors du démontage
  useEffect(() => {
    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  const scrollToChat = () => {
    setTimeout(() => {
      chatContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDomainSelection = (domainId: number) => {
    // Si c'est le domaine "Recherche juridique" (ID 3), ouvrir le site externe
    if (domainId === 3) {
      window.open('https://opendata.justice-administrative.fr/recherche', '_blank');
      return;
    }

    // Si c'est le domaine FAQ (ID 5), aller à la vue FAQ
    if (domainId === 5) {
      setChatState(prev => ({ ...prev, currentView: "faq" }));
      return;
    }

    const welcomes: Record<number, string> = {
      0: "Bonjour ! Je peux vous aider avec vos questions sur les horaires, congés, ARTT, temps partiel, heures supplémentaires, absences, etc.",
      1: "Bonjour ! Je peux vous renseigner sur le CPF, les congés de formation, la VAE, les concours, les bilans de compétences, etc. Quelle est votre question ?",
      2: "Bonjour ! Je suis l'assistant spécialiste du télétravail. Posez-moi vos questions sur la charte, les jours autorisés, les indemnités, etc.",
      4: "Bonjour ! Je suis votre juriste IA spécialisé dans la fonction publique. Je réponds exclusivement en me référant au site de Légifrance avec citations précises des textes légaux.",
      6: "Bonjour ! Voici les actualités — vous pouvez poser une question ou consulter le fil d'actualité.",
      7: "Bonjour ! Je peux vous aider à retrouver un chapitre du sommaire, ou une documentation interne (CET, congés, télétravail...).",
      8: "Bonjour ! Espace dialogue social : je peux prendre note d'une demande ou vous orienter vers les contacts syndicaux.",
    };
    
    setChatState({
      currentView: "chat",
      selectedDomain: domainId,
      messages: [{ type: "assistant", content: welcomes[domainId] ?? "Bonjour, comment puis-je vous aider ?", timestamp: new Date() }],
      isProcessing: false,
    });
    scrollToChat();
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const returnToMenu = () => {
    setChatState({ currentView: "menu", selectedDomain: null, messages: [], isProcessing: false });
    setInputValue("");
    setSelectedInfo(null);
  };

  const appelPerplexity = async (messages: any[]): Promise<string> => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "sonar-pro", messages }),
    });
    if (!response.ok) {
      const err = await response.text();
      console.error("Erreur API:", err);
      throw new Error(`Erreur API (${response.status})`);
    }
    const json = await response.json();
    return json.choices[0].message.content;
  };

  const traiterQuestion = async (question: string): Promise<string> => {
    console.log('🔍 traiterQuestion appelé avec:', { 
      question, 
      selectedDomain: chatState.selectedDomain,
      questionLength: question.length,
      questionWords: question.split(' ').length,
      isListening: isListening,
      interimText: interimText,
      inputValue: inputValue
    });
    
    let contexte = "";
    let systemPrompt = "";

    if (chatState.selectedDomain === 0) {
      contexte = trouverContextePertinent(question);
      console.log('📚 Contexte trouvé pour domaine 0 (temps de travail):', { 
        contexteLength: contexte.length,
        contextePreview: contexte.substring(0, 200) + '...'
      });
    } else if (chatState.selectedDomain === 1) {
      contexte = JSON.stringify(formation, null, 2);
      console.log('📚 Contexte trouvé pour domaine 1 (formation):', { 
        contexteLength: contexte.length,
        contextePreview: contexte.substring(0, 200) + '...'
      });
    } else if (chatState.selectedDomain === 2) {
      contexte = teletravailData;
      console.log('📚 Contexte trouvé pour domaine 2 (télétravail):', { 
        contexteLength: contexte.length,
        contextePreview: contexte.substring(0, 200) + '...'
      });
    }

    // Pour le domaine 0, utiliser le processus normal avec trouverContextePertinent
    if (chatState.selectedDomain === 0) {
      console.log('⏰ UTILISATION DU PROCESSUS NORMAL (sommaire.ts + temps.ts) pour le domaine 0');
      systemPrompt = `
Tu es un collègue syndical spécialiste pour la mairie de Gennevilliers.
Réponds uniquement en utilisant la documentation ci-dessous.
Si la réponse n'est pas présente, dis : "Je ne trouve pas l'information. Contactez le 64 64."
Réponds comme si tu parlais a un collegue que tu connais, et propose lui a la fin de contacter la CFDT au 01 40 85 64 64.
--- DOCUMENTATION ---
${contexte}
--- FIN DOCUMENTATION ---
      `;
    }

    // Pour les domaines 1 et 2, utiliser l'API Perplexity MAIS uniquement sur les données internes
    if (chatState.selectedDomain === 1 || chatState.selectedDomain === 2) {
      console.log('🔒 UTILISATION DE L\'API PERPLEXITY UNIQUEMENT SUR LES DONNÉES LOCALES pour le domaine:', chatState.selectedDomain);
      
      // Prompt système unifié pour forcer l'analyse uniquement des données internes
      systemPrompt = `
Tu es un collègue syndical spécialiste pour la mairie de Gennevilliers.

IMPORTANT : Tu dois répondre UNIQUEMENT en analysant la documentation interne fournie ci-dessous. 
NE RECHERCHE PAS d'informations externes, ne fais pas de recherches web, ne te base pas sur tes connaissances générales.
Analyse SEULEMENT le contenu du document fourni.

Si la réponse n'est pas présente dans la documentation fournie, dis : "Je ne trouve pas l'information. Contactez le 64 64."

Réponds comme si tu parlais à un collègue que tu connais, et propose-lui à la fin de contacter la CFDT au 01 40 85 64 64.

--- DOCUMENTATION INTERNE ---
${contexte}
--- FIN DOCUMENTATION INTERNE ---
      `;
    } else if (chatState.selectedDomain === 4) {
      // Domaine IA fonction publique avec prompt spécialisé Légifrance
      systemPrompt = `
Tu es un juriste spécialiste de la fonction publique. Tu réponds exclusivement en te référant au site de Légifrance. 
Tu n'inventes pas de réponse, et tu cites toujours soit la référence de la loi, du décret, soit la référence de la jurisprudence administrative.
Format de réponse attendu :
- Réponse précise basée sur les textes légaux
- Citation systématique des références (ex: "Article L. 123-4 du Code général de la fonction publique", "Décret n° 2021-123 du...", "CE, 12 mars 2021, req. n° 123456")
- Si tu ne trouves pas d'information précise sur Légifrance, indique clairement "Aucune référence trouvée sur Légifrance pour cette question spécifique"
      `;
    }


    // Pour les domaines 0, 1, et 2, utiliser l'API Perplexity avec le prompt spécialisé pour les données internes
    if (chatState.selectedDomain === 0 || chatState.selectedDomain === 1 || chatState.selectedDomain === 2) {
      console.log('🔒 UTILISATION DE L\'API PERPLEXITY UNIQUEMENT SUR LES DONNÉES LOCALES pour le domaine:', chatState.selectedDomain);
      const history = chatState.messages.slice(1).map((msg) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
      }));
      const apiMessages = [{ role: "system", content: systemPrompt }, ...history, { role: "user", content: question }];
      return await appelPerplexity(apiMessages);
    }

    // Pour les autres domaines, utiliser l'API Perplexity normale
    console.log('🌐 UTILISATION DE L\'API PERPLEXITY pour le domaine:', chatState.selectedDomain);
    const history = chatState.messages.slice(1).map((msg) => ({
      role: msg.type === "user" ? "user" : "assistant",
      content: msg.content,
    }));
    const apiMessages = [{ role: "system", content: systemPrompt }, ...history, { role: "user", content: question }];
    return await appelPerplexity(apiMessages);
  };

  const handleSendMessage = async (text?: string): Promise<void> => {
    // Vérification et conversion sécurisée du texte
    const textToSend = text || inputValue;
    const q = typeof textToSend === 'string' ? textToSend.trim() : '';
    
    console.log('handleSendMessage appelé avec:', { 
      text, 
      inputValue, 
      textToSend, 
      q, 
      isProcessing: chatState.isProcessing,
      selectedDomain: chatState.selectedDomain,
      source: text ? 'VOICE' : 'MANUAL'
    });
    
    if (!q) {
      console.log('Aucun texte à envoyer');
      return;
    }
    
    if (chatState.isProcessing) {
      console.log('Déjà en cours de traitement, ignore');
      return;
    }
    
    console.log('Envoi du message:', q);
    const userMsg: ChatMessage = { type: "user", content: q, timestamp: new Date() };
    setChatState((p) => ({ ...p, messages: [...p.messages, userMsg], isProcessing: true }));
    setInputValue("");
    setInterimText("");
    
    try {
      console.log('Appel de traiterQuestion...');
      
      // Pour la question orale, forcer le même état que la question écrite
      if (text) {
        console.log('🎤 QUESTION ORALE - Forçage du processus identique à la question écrite');
        // S'assurer que l'état est identique à une question écrite
        setInterimText("");
        setIsListening(false);
      }
      
      const reply = await traiterQuestion(q);
      console.log('Réponse reçue:', reply);
      const assistantMsg: ChatMessage = { type: "assistant", content: reply, timestamp: new Date() };
      setChatState((p) => ({ ...p, messages: [...p.messages, assistantMsg], isProcessing: false }));
    } catch (error) {
      console.error('Erreur dans handleSendMessage:', error);
      const errMsg: ChatMessage = {
        type: "assistant",
        content: "Erreur lors du traitement. Veuillez réessayer.",
        timestamp: new Date(),
      };
      setChatState((p) => ({ ...p, messages: [...p.messages, errMsg], isProcessing: false }));
    } finally {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      console.log('⌨️ ENVOI MANUEL (ENTRÉE):', inputValue);
      console.log('⌨️ État avant envoi:', { 
        selectedDomain: chatState.selectedDomain,
        isProcessing: chatState.isProcessing,
        messagesCount: chatState.messages.length
      });
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    console.log('toggleListening appelé, isListening:', isListening);
    console.log('recognitionRef.current:', !!recognitionRef.current);
    
    if (!recognitionRef.current) {
      console.error('Reconnaissance vocale non initialisée');
      alert('Reconnaissance vocale non disponible');
      return;
    }
    
    try {
      if (isListening) {
        console.log('Arrêt de la reconnaissance vocale');
        recognitionRef.current.stop();
        setIsListening(false);
        // Nettoyer le timeout de silence
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      } else {
        console.log('Démarrage de la reconnaissance vocale');
        // S'assurer qu'aucune reconnaissance n'est en cours
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            // Ignorer l'erreur si déjà arrêté
          }
        }
        // Petit délai avant de redémarrer
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.start();
          }
        }, 100);
      }
    } catch (error) {
      console.error('Erreur lors du toggle:', error);
      setIsListening(false);
      alert('Erreur lors de l\'activation de la reconnaissance vocale');
    }
  };

  return (
    <div className="min-h-screen relative font-sans">
      {/* Background */}
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: "url('./unnamed.jpg')" }} />
      <div className="fixed inset-0 bg-black/10 z-0" />

      {/* Podcast Player */}
      <PodcastPlayer />

{/* Header */}
<header 
  className="relative shadow-lg border-b-4 border-orange-500 z-10 overflow-hidden"
  style={{
    backgroundImage: `url(${mairieImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
  {/* Overlay pour améliorer la lisibilité */}
  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
  
  <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-6">
    <div className="flex flex-col sm:flex-row items-center gap-6 flex-grow">
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 rounded-full blur-lg opacity-70 animate-pulse" />
        <div className="relative p-6 bg-gradient-to-br from-white to-orange-50 rounded-full shadow-2xl">
          <Users className="w-20 h-20 text-orange-500" />
        </div>
      </div>
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent drop-shadow-sm">
          Atlas: Chatbot CFDT
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Mairie de GENNEVILLIERS
        </h2>
        <p className="mt-4 flex justify-center sm:justify-start items-center gap-2 text-lg text-gray-700">
          <Users className="text-orange-500 w-5 h-5 animate-pulse" />
          Assistant syndical CFDT pour les agents municipaux
        </p>
      </div>
    </div>
    <div className="relative shrink-0 w-40 h-40 sm:w-48 sm:h-48">
      {/* Halo orange autour du cercle */}
      <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(255,165,0,0.9)] animate-pulse"></div>
      {/* Cercle blanc de fond */}
      <div className="absolute inset-0 bg-white rounded-full"></div>
      {/* Logo CFDT rempli dans le cercle */}
      <img
        src="./logo-cfdt.jpg"
        alt="Logo CFDT"
        className="relative w-full h-full object-cover rounded-full"
      />
    </div>
  </div>
</header>
      
      {/* Main */}
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
        {chatState.currentView === "menu" ? (
          <>
            {/* Bandeau défilant custom (NEWS FTP:) */}
            <section className="relative bg-orange-300 text-black overflow-hidden mx-auto max-w-5xl rounded-2xl shadow-lg z-10">
              <div className="relative h-20 flex items-center overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-40 flex items-center justify-center bg-orange-400 z-20 shadow-md">
                  <span className="text-2xl font-bold">NEWS FPT:</span>
                </div>
                <div className="animate-marquee whitespace-nowrap flex items-center pl-44" style={{ animation: "marquee 30s linear infinite" }}>
                  {[...infoItems, ...infoItems].map((info, idx) => (
                    <button
                      key={`${info.id}-${idx}`}
                      onClick={() => setSelectedInfo(info)}
                      className="text-2xl font-medium mx-8 hover:text-blue-200 transition-colors underline decoration-dotted cursor-pointer"
                    >
                      #{info.id}: {info.title}
                    </button>
                  ))}
                </div>
              </div>
              <style dangerouslySetInnerHTML={{
                __html: `
                  @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                  }
                `
              }} />
            </section>

            {/* Détail info */}
            {selectedInfo && (
              <section className="info-detail bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-md mt-8 max-w-4xl mx-auto">
                <h3 className="text-xl font-bold mb-4">{selectedInfo.title}</h3>
                <p className="whitespace-pre-wrap">{selectedInfo.content}</p>
                <button onClick={() => setSelectedInfo(null)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                  Fermer
                </button>
              </section>
            )}

            {/* Choix domaine */}
            <section className="text-center my-12">
            <h3 className="text-white text-xl sm:text-2xl font-bold mb-4 text-center">
  Choisissez votre domaine d'assistance
</h3>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Nos assistants IA spécialisés vous aideront.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <button
                onClick={() => handleDomainSelection(0)}
                className="group relative overflow-hidden bg-white/95 border-2 border-orange-200 rounded-3xl p-8 transition-all duration-500 hover:border-orange-400 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="relative p-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-xl group-hover:rotate-3 group-hover:scale-110 transition-transform">
                    <Clock className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 group-hover:text-orange-700">  Temps de Travail      (Doc Interne)</h4>
              
                  <p className="text-center text-gray-600">Horaires, congés, ARTT, temps partiel, absences…</p>
                </div>
              </button>

              <button
                onClick={() => handleDomainSelection(1)}
                className="group relative overflow-hidden bg-white/95 border-2 border-purple-200 rounded-3xl p-8 transition-all duration-500 hover:border-purple-400 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="relative p-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl shadow-xl group-hover:rotate-3 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 group-hover:text-purple-700">Formation (Doc Interne )</h4>
                  <p className="text-center text-gray-600">CPF, VAE, concours, bilans de compétences…</p>
                </div>
              </button>
              
              <button
                onClick={() => handleDomainSelection(2)}
                className="group relative overflow-hidden bg-white/95 border-2 border-green-200 rounded-3xl p-8 transition-all duration-500 hover:border-green-400 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="relative p-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl shadow-xl group-hover:rotate-3 group-hover:scale-110 transition-transform">
                    <Home className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 group-hover:text-green-700">Télétravail (Doc Interne)</h4>
                  <p className="text-center text-gray-600">Charte, jours autorisés, indemnités, modalités…</p>
                </div>
              </button>

              <button
                onClick={() => handleDomainSelection(3)}
                className="group relative overflow-hidden bg-white/95 border-2 border-amber-200 rounded-3xl p-8 transition-all duration-500 hover:border-amber-400 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="relative p-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl shadow-xl group-hover:rotate-3 group-hover:scale-110 transition-transform">
                    <Scale className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 group-hover:text-amber-700">Recherche juridique  (Doc Externe)
                  </h4>
                  <p className="text-center text-gray-600">Accès direct à la base de données juridique administrative…</p>
                </div>
              </button>

              <button
                onClick={() => handleDomainSelection(4)}
                className="group relative overflow-hidden bg-white/95 border-2 border-indigo-200 rounded-3xl p-8 transition-all duration-500 hover:border-indigo-400 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="relative p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-xl group-hover:rotate-3 group-hover:scale-110 transition-transform">
                    <Bot className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-700">IA fonction publique  (Doc Externe)</h4>
                  <p className="text-center text-gray-600">Juriste IA avec références Légifrance précises…</p>
                </div>
              </button>

              <button
                onClick={() => handleDomainSelection(5)}
                className="group relative overflow-hidden bg-white/95 border-2 border-rose-200 rounded-3xl p-8 transition-all duration-500 hover:border-rose-400 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="relative p-6 bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl shadow-xl group-hover:rotate-3 group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 group-hover:text-rose-700">FAQ</h4>
                  <p className="text-center text-gray-600">Questions fréquentes sur télétravail et formation…</p>
                </div>
              </button>

              {/* ======================
                  NOUVEAUX : 3 icônes
                 ====================== */}
          


            </div>
            
            {/* Bloc actus (RSS) - EN BAS */}
            <div 
              className="border-2 border-blue-200 rounded-3xl p-8 mt-8 relative overflow-hidden"
              style={{
                backgroundImage: `url(${mairieImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Overlay pour améliorer la lisibilité */}
              <div className="absolute inset-0 bg-white/60"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="relative p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-800 text-blue-700">Actualités Nationales</h4>
                <div className="w-full">
                  <NewsTicker />
                </div>
              </div>
            </div>
          </>
        ) : chatState.currentView === "faq" ? (
          <FAQSection onReturn={returnToMenu} />
        ) : (
          // Vue Chat
          <div ref={chatContainerRef} className="bg-white/95 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={returnToMenu} className="text-white hover:text-orange-200 p-2 rounded-full hover:bg-white/10">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {chatState.selectedDomain === 0 && "Assistant Temps de Travail"}
                    {chatState.selectedDomain === 1 && "Assistant Formation"}
                    {chatState.selectedDomain === 2 && "Assistant Télétravail"}
                    {chatState.selectedDomain === 3 && "Recherche Juridique"}
                    {chatState.selectedDomain === 4 && "Juriste IA fonction publique"}
                    {chatState.selectedDomain === 5 && "FAQ"}
                    {chatState.selectedDomain === 6 && "Actualités"}
                    {chatState.selectedDomain === 7 && "Documentation"}
                    {chatState.selectedDomain === 8 && "Dialogue social"}
                  </h3>
                  <p className="text-orange-100 text-sm">Posez vos questions, je suis là pour vous aider</p>
                </div>
              </div>
              <Users className="w-8 h-8 text-white" />
            </div>

            <div className="h-[60vh] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {chatState.messages.map((msg, i) => (
                <div key={i} className={`flex items-end gap-2 ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                   {msg.type === 'assistant' && <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">CFDT</div>}
                  <div className={`flex ${msg.type === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-4`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                        msg.type === "user"
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-none"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs mt-2 opacity-70 text-right">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    
                    {/* Afficher le GIF manga seulement pour le premier message de l'assistant */}
                    {i === 0 && msg.type === 'assistant' && (
                      <div className="hidden md:block ml-12 -mt-16">
                        <img 
                          src="./cfdtmanga.gif" 
                          alt="CFDT Manga" 
                          className="w-96 h-96 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {chatState.isProcessing && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">CFDT</div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-md rounded-bl-none">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                      <span className="text-sm text-gray-600">L'assistant réfléchit...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
              
              {/* Indicateur de reconnaissance vocale en cours */}
              {isListening && interimText && (
                <div className="flex items-end gap-2 justify-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 animate-pulse">
                    🎤
                  </div>
                  <div className="bg-blue-100 border border-blue-300 rounded-2xl px-4 py-3 shadow-md rounded-bl-none max-w-xs lg:max-w-md">
                    <p className="text-sm text-blue-800 italic">{interimText}</p>
                    <p className="text-xs mt-1 text-blue-600">En cours d'écoute...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50/80 border-t border-gray-200 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre question ici..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={chatState.isProcessing}
                />
                <button
                  onClick={toggleListening}
                  disabled={chatState.isProcessing || !speechSupported}
                  className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center shadow-lg ${
                    !speechSupported
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : isListening 
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={
                    !speechSupported 
                      ? "Reconnaissance vocale non supportée" 
                      : isListening 
                        ? "Arrêter l'écoute" 
                        : "Parler"
                  }
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => {
                    console.log('🔘 ENVOI MANUEL (BOUTON):', inputValue);
                    console.log('🔘 État avant envoi:', { 
                      selectedDomain: chatState.selectedDomain,
                      isProcessing: chatState.isProcessing,
                      messagesCount: chatState.messages.length
                    });
                    handleSendMessage();
                  }}
                  disabled={!inputValue.trim() || chatState.isProcessing}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

{/* Footer */}
<footer className="relative bg-gray-900 text-white py-12 z-10">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="text-center md:text-left">
        <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          Contact CFDT
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Phone className="w-5 h-5 text-orange-400" />
            <span>01 40 85 64 64</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Mail className="w-5 h-5 text-orange-400" />
            <a
              href="mailto:cfdt-interco@ville-gennevilliers.fr"
              className="text-white hover:underline"
            >
              cfdt-interco@ville-gennevilliers.fr
            </a>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <MapPin className="w-5 h-5 text-orange-400" />
            <span>Mairie de Gennevilliers</span>
          </div>
        </div>
      </div>
      <div className="text-center">
        <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Services
        </h4>
        <ul className="space-y-2 text-gray-300">
          <li>Santé</li>
          <li>Retraite</li>
          <li>Juridique</li>
          <li>Accompagnement syndical</li>
        </ul>
      </div>
      <div className="text-center md:text-right">
        <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
          Horaires
        </h4>
        <div className="space-y-2 text-gray-300">
          <div>Lundi - Vendredi</div>
          <div className="font-semibold text-white">9h00-12h00- 13h30-17h00</div>
          <div className="text-sm">Permanences sur RDV</div>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-10 pt-6 text-center">
      <p className="text-gray-400">
        © 2025 CFDT Gennevilliers - Assistant IA pour les agents municipaux
      </p>
    </div>
  </div>
</footer>
    </div>
  );
}