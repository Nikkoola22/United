import { useState } from 'react';
import { X, Settings, Users, FileText, Database, Plus, Edit3, Trash2, Save } from 'lucide-react';
import { infoItems as initialInfoItems } from '../data/info-data';

interface InfoItem {
  id: number;
  title: string;
  content: string;
}

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('settings');
  const [infoItems, setInfoItems] = useState<InfoItem[]>(initialInfoItems);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Omit<InfoItem, 'id'>>({ title: '', content: '' });

  const tabs = [
    { id: 'settings', label: 'Paramètres', icon: Settings },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'info-data', label: 'Info-Data', icon: FileText },
    { id: 'database', label: 'Base de données', icon: Database }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-md border-b border-purple-500/20 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors p-2 hover:bg-purple-500/20 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-purple-400" />
            <div>
              <h3 className="text-2xl font-light text-white">Panneau d'Administration</h3>
              <p className="text-sm text-purple-200">Gestion du système Atlas CFDT</p>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-56 bg-slate-800/50 border-r border-purple-500/20 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-purple-600/70 text-white border border-purple-400/50'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-light">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-8">
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-light text-white mb-6">Paramètres Généraux</h2>
                <div className="space-y-6">
                  <div className="bg-slate-700/30 rounded-lg p-4 border border-purple-500/20">
                    <label className="block text-base font-light text-slate-300 mb-2">Nom de l'application</label>
                    <input
                      type="text"
                      defaultValue="Atlas CFDT"
                      className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white font-light focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition-all"
                    />
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4 border border-purple-500/20">
                    <label className="block text-base font-light text-slate-300 mb-2">Description</label>
                    <textarea
                      defaultValue="Assistant syndical CFDT pour la Mairie de Gennevilliers"
                      className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white font-light focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition-all resize-none"
                      rows={3}
                    />
                  </div>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all duration-200 font-light">
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-light text-white mb-6">Gestion des Utilisateurs</h2>
                <div className="space-y-4">
                  <div className="bg-slate-700/30 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-light text-white">Administrateur Principal</p>
                        <p className="text-sm text-slate-400">admin@cfdt.fr</p>
                      </div>
                      <span className="px-3 py-1 bg-green-500/30 border border-green-500/50 rounded-full text-xs text-green-300">Actif</span>
                    </div>
                  </div>
                  <button className="w-full px-6 py-3 bg-purple-600/50 border border-purple-500/50 text-white rounded-lg hover:bg-purple-600/70 transition-all duration-200 font-light">
                    Ajouter un utilisateur
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'info-data-old' && (
              <div>
                <h2 className="text-2xl font-light text-white mb-6">Gestion du Contenu</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-6 border border-purple-500/20 text-center">
                    <p className="text-3xl font-light text-blue-400 mb-2">12</p>
                    <p className="text-sm text-slate-400">Articles publiés</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-6 border border-purple-500/20 text-center">
                    <p className="text-3xl font-light text-purple-400 mb-2">3</p>
                    <p className="text-sm text-slate-400">Brouillons</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-6 border border-purple-500/20 text-center">
                    <p className="text-3xl font-light text-green-400 mb-2">95%</p>
                    <p className="text-sm text-slate-400">Taux de mise à jour</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'info-data' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-light text-white">Gestion Info-Data</h2>
                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600/70 border border-purple-400/50 text-white rounded-lg hover:bg-purple-600/90 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Nouvel article
                  </button>
                </div>

                {/* Formulaire d'ajout */}
                {isAddingNew && (
                  <div className="bg-slate-700/30 rounded-lg p-6 border border-purple-500/20 mb-6">
                    <h3 className="text-lg font-light text-white mb-4">Nouvel article</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Titre de l'article"
                        value={newItem.title}
                        onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white font-light placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition-all"
                      />
                      <textarea
                        placeholder="Contenu de l'article"
                        value={newItem.content}
                        onChange={(e) => setNewItem({...newItem, content: e.target.value})}
                        rows={6}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white font-light placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition-all resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (newItem.title && newItem.content) {
                              const newId = Math.max(...infoItems.map(i => i.id), 0) + 1;
                              setInfoItems([...infoItems, { id: newId, ...newItem }]);
                              setNewItem({ title: '', content: '' });
                              setIsAddingNew(false);
                            }
                          }}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-light"
                        >
                          <Save className="w-4 h-4 inline mr-2" />
                          Publier
                        </button>
                        <button
                          onClick={() => {
                            setIsAddingNew(false);
                            setNewItem({ title: '', content: '' });
                          }}
                          className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-500/50 text-slate-300 rounded-lg hover:bg-slate-700/70 transition-all font-light"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Liste des articles */}
                <div className="space-y-4">
                  {infoItems.map((item) => (
                    <div key={item.id} className="bg-slate-700/30 rounded-lg p-6 border border-purple-500/20">
                      {editingId === item.id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              setInfoItems(infoItems.map(i => 
                                i.id === item.id ? {...i, title: e.target.value} : i
                              ));
                            }}
                            className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white font-light focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition-all"
                          />
                          <textarea
                            value={item.content}
                            onChange={(e) => {
                              setInfoItems(infoItems.map(i => 
                                i.id === item.id ? {...i, content: e.target.value} : i
                              ));
                            }}
                            rows={6}
                            className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white font-light focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition-all resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingId(null)}
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-light"
                            >
                              <Save className="w-4 h-4 inline mr-2" />
                              Enregistrer
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setInfoItems(initialInfoItems);
                              }}
                              className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-500/50 text-slate-300 rounded-lg hover:bg-slate-700/70 transition-all font-light"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <h3 className="text-lg font-light text-white flex-1">{item.title}</h3>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingId(item.id)}
                                className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all"
                              >
                                <Edit3 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setInfoItems(infoItems.filter(i => i.id !== item.id))}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed mb-3">{item.content}</p>
                          <p className="text-xs text-slate-500">ID: {item.id}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div>
                <h2 className="text-2xl font-light text-white mb-6">Base de Données</h2>
                <div className="space-y-4">
                  <div className="bg-slate-700/30 rounded-lg p-4 border border-purple-500/20">
                    <p className="text-sm text-slate-400 mb-2">État de la connexion</p>
                    <p className="text-base font-light text-green-400">✓ Connecté</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="px-6 py-3 bg-blue-600/50 border border-blue-500/50 text-white rounded-lg hover:bg-blue-600/70 transition-all duration-200 font-light">
                      Sauvegarder les données
                    </button>
                    <button className="px-6 py-3 bg-yellow-600/50 border border-yellow-500/50 text-white rounded-lg hover:bg-yellow-600/70 transition-all duration-200 font-light">
                      Optimiser la BD
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}