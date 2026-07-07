=====================================================================
import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Search, Ban, CheckCircle, Trash2, Users, 
  ChevronLeft, ChevronRight, Loader, RefreshCw,
  AlertCircle, Mail, Phone, Calendar, Shield, XCircle
} from 'lucide-react'
import { getUsers, verifyUser, suspendUser, deleteUser } from '../../api/adminApi'

// ✅ Configuration des statuts
const STATUS_CONFIG = {
  'actif': { 
    label: 'Actif', 
    style: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    icon: <CheckCircle size={12} />
  },
  'vérifié': { 
    label: 'Vérifié', 
    style: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    icon: <CheckCircle size={12} />
  },
  'suspendu': { 
    label: 'Suspendu', 
    style: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    icon: <XCircle size={12} />
  },
  'en_attente': { 
    label: 'En attente', 
    style: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    icon: <Loader size={12} />
  },
}

// ✅ Configuration des rôles
const ROLE_CONFIG = {
  'vendeur': { 
    label: 'Vendeur', 
    style: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' 
  },
  'acheteur': { 
    label: 'Acheteur', 
    style: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
  },
  'cooperative': { 
    label: 'Coopérative', 
    style: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' 
  },
  'admin': { 
    label: 'Admin', 
    style: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
  },
}

// ✅ Options de filtre
const STATUS_FILTERS = ['all', ...Object.keys(STATUS_CONFIG)]
const ROLE_FILTERS = ['all', ...Object.keys(ROLE_CONFIG)]

function AdminUsers({ 
  onUserSelect,
  refreshInterval = 30000,
  className = '',
}) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRole, setFilterRole] = useState('all')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [selectedUsers, setSelectedUsers] = useState([])

  // ✅ Chargement des utilisateurs
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getUsers()
      const list = res?.users ?? res?.data ?? res ?? []
      setUsers(Array.isArray(list) ? list : [])
      setLastUpdated(new Date())
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors du chargement des utilisateurs')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ Auto-refresh
  useEffect(() => {
    fetchUsers()
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchUsers, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchUsers, refreshInterval])

  // ✅ Filtrage des utilisateurs
  const filtered = useMemo(() => {
    return users.filter(user => {
      const name = user.name?.toLowerCase() || ''
      const email = user.email?.toLowerCase() || ''
      const phone = user.phone || ''
      const status = user.status || 'en_attente'
      const role = user.role || 'acheteur'
      
      const matchesSearch = !search || 
        name.includes(search.toLowerCase()) || 
        email.includes(search.toLowerCase()) ||
        phone.includes(search)
      
      const matchesStatus = filterStatus === 'all' || status === filterStatus
      const matchesRole = filterRole === 'all' || role === filterRole
      
      return matchesSearch && matchesStatus && matchesRole
    })
  }, [users, search, filterStatus, filterRole])

  // ✅ Statistiques
  const stats = useMemo(() => {
    const total = users.length
    const active = users.filter(u => u.status === 'actif' || u.status === 'vérifié').length
    const suspended = users.filter(u => u.status === 'suspendu').length
    const pending = users.filter(u => u.status === 'en_attente').length
    const admins = users.filter(u => u.role === 'admin').length
    
    return { total, active, suspended, pending, admins }
  }, [users])

  // ✅ Actions utilisateur
  const handleVerify = useCallback(async (user) => {
    const id = user._id || user.id
    if (!id) return
    
    if (!window.confirm(`Vérifier l'utilisateur "${user.name}" ?`)) return
    
    setActionLoading(id)
    setError(null)
    try {
      await verifyUser(id)
      await fetchUsers()
    } catch (err) {
      setError(err?.response?.data?.message || '❌ Erreur lors de la vérification')
    } finally {
      setActionLoading(null)
    }
  }, [fetchUsers])

  const handleSuspend = useCallback(async (user) => {
    const id = user._id || user.id
    if (!id) return
    
    const isSuspended = user.status === 'suspendu'
    const action = isSuspended ? 'Réactiver' : 'Suspendre'
    
    if (!window.confirm(`${action} l'utilisateur "${user.name}" ?`)) return
    
    setActionLoading(id)
    setError(null)
    try {
      await suspendUser(id)
      await fetchUsers()
    } catch (err) {
      setError(err?.response?.data?.message || '❌ Erreur lors de la suspension')
    } finally {
      setActionLoading(null)
    }
  }, [fetchUsers])

  const handleDelete = useCallback(async (user) => {
    const id = user._id || user.id
    if (!id) return
    
    if (!window.confirm(`Supprimer définitivement "${user.name}" ? Cette action est irréversible.`)) return
    
    setActionLoading(id)
    setError(null)
    try {
      await deleteUser(id)
      await fetchUsers()
    } catch (err) {
      setError(err?.response?.data?.message || '❌ Erreur lors de la suppression')
    } finally {
      setActionLoading(null)
    }
  }, [fetchUsers])

  // ✅ Sélection multiple
  const toggleSelectUser = useCallback((userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }, [])

  const toggleSelectAll = useCallback(() => {
    if (selectedUsers.length === filtered.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filtered.map(u => u._id || u.id))
    }
  }, [filtered, selectedUsers])

  // ✅ Formatage des dates
  const formatDate = useCallback((date) => {
    if (!date) return '—'
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
  }, [])

  // ✅ Export CSV (simulé)
  const handleExport = useCallback(() => {
    if (filtered.length === 0) {
      alert('Aucun utilisateur à exporter.')
      return
    }
    
    const headers = ['Nom', 'Email', 'Téléphone', 'Rôle', 'Pays', 'Statut', 'Inscrit']
    const rows = filtered.map(u => [
      u.name || 'Inconnu',
      u.email || '',
      u.phone || '',
      u.role || 'acheteur',
      u.country || '',
      u.status || 'en_attente',
      formatDate(u.createdAt || u.joined)
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `utilisateurs_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [filtered, formatDate])

  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader size={32} className="text-[var(--accent-primary)] animate-spin" />
        <p className="text-sm text-[var(--text-secondary)] mt-4">Chargement des utilisateurs...</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
            Utilisateurs
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {stats.total} utilisateur{stats.total > 1 ? 's' : ''} enregistré{stats.total > 1 ? 's' : ''}
            {lastUpdated && (
              <span className="ml-2 text-xs text-[var(--text-secondary)]/60">
                · Mis à jour à {lastUpdated.toLocaleTimeString('fr-FR')}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {filtered.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] rounded-xl transition"
            >
              📥 Exporter CSV
            </button>
          )}
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition disabled:opacity-50"
            aria-label="Rafraîchir"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 flex items-center gap-2 animate-fade-in">
          <AlertCircle size={16} className="text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Stats rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-4">
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-3 text-center">
          <p className="text-2xl font-extrabold text-[var(--text-primary)]">{stats.total}</p>
          <p className="text-xs text-[var(--text-secondary)]">Total</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-3 text-center">
          <p className="text-2xl font-extrabold text-green-600 dark:text-green-400">{stats.active}</p>
          <p className="text-xs text-[var(--text-secondary)]">Actifs</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-3 text-center">
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{stats.pending}</p>
          <p className="text-xs text-[var(--text-secondary)]">En attente</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-3 text-center">
          <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">{stats.suspended}</p>
          <p className="text-xs text-[var(--text-secondary)]">Suspendus</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-3 text-center">
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{stats.admins}</p>
          <p className="text-xs text-[var(--text-secondary)]">Admins</p>
        </div>
      </div>

      {/* FILTRES */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-5">
        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 sm:px-4 py-2 w-full sm:max-w-xs">
          <Search size={16} className="text-[var(--text-secondary)]" />
          <input 
            type="text" 
            placeholder="Rechercher par nom, email ou téléphone..."
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="outline-none text-sm flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 min-w-0"
            aria-label="Rechercher un utilisateur"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Filtre statut */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] outline-none focus:border-[var(--accent-primary)]"
          >
            <option value="all">📊 Tous les statuts</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          {/* Filtre rôle */}
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] outline-none focus:border-[var(--accent-primary)]"
          >
            <option value="all">👤 Tous les rôles</option>
            {Object.entries(ROLE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          {/* Sélection multiple */}
          {selectedUsers.length > 0 && (
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              {selectedUsers.length} sélectionné{selectedUsers.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* TABLE ou EMPTY STATE */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 sm:p-16 text-center">
            <Users size={48} className="mx-auto text-[var(--text-secondary)]/30 mb-3" />
            <p className="text-sm sm:text-base font-semibold text-[var(--text-primary)] mb-1">
              Aucun utilisateur
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {users.length === 0 
                ? 'Les nouveaux utilisateurs apparaîtront ici.' 
                : 'Aucun utilisateur ne correspond à votre recherche.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Pays
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Inscrit
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filtered.map((user, index) => {
                  const userId = user._id || user.id || index
                  const statusConfig = STATUS_CONFIG[user.status] || STATUS_CONFIG['en_attente']
                  const roleConfig = ROLE_CONFIG[user.role] || ROLE_CONFIG['acheteur']
                  const isLoading = actionLoading === userId

                  return (
                    <tr 
                      key={userId} 
                      className="hover:bg-[var(--bg-secondary)] transition cursor-pointer"
                      onClick={() => onUserSelect?.(user)}
                    >
                      <td className="px-4 sm:px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[var(--accent-primary)] rounded-full flex items-center justify-center text-[var(--text-light)] text-xs font-bold shrink-0">
                            {user.name?.[0] || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">
                              {user.name || 'Inconnu'}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)]">{user.email || 'Email non renseigné'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-[var(--text-secondary)]">
                            {user.phone || '—'}
                          </span>
                          {user.country && (
                            <span className="text-xs text-[var(--text-secondary)]/60">
                              {user.country}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${roleConfig.style}`}>
                          {roleConfig.label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm text-[var(--text-secondary)]">
                        {user.country || '—'}
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${statusConfig.style}`}>
                          {statusConfig.icon} {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-xs text-[var(--text-secondary)]">
                        {formatDate(user.createdAt || user.joined)}
                      </td>
                      <td className="px-4 sm:px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          {user.role !== 'admin' ? (
                            <>
                              {user.status !== 'vérifié' && user.status !== 'actif' && (
                                <button 
                                  onClick={() => handleVerify(user)}
                                  disabled={isLoading}
                                  className="text-[var(--text-secondary)] hover:text-green-600 transition p-1.5 disabled:opacity-50"
                                  title="Vérifier" 
                                  aria-label="Vérifier"
                                >
                                  {isLoading ? <Loader size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                </button>
                              )}
                              <button 
                                onClick={() => handleSuspend(user)}
                                disabled={isLoading}
                                className="text-[var(--text-secondary)] hover:text-amber-500 transition p-1.5 disabled:opacity-50"
                                title={user.status === 'suspendu' ? 'Réactiver' : 'Suspendre'} 
                                aria-label={user.status === 'suspendu' ? 'Réactiver' : 'Suspendre'}
                              >
                                {user.status === 'suspendu' ? <CheckCircle size={16} /> : <Ban size={16} />}
                              </button>
                              <button 
                                onClick={() => handleDelete(user)}
                                disabled={isLoading}
                                className="text-[var(--text-secondary)] hover:text-red-500 transition p-1.5 disabled:opacity-50"
                                title="Supprimer" 
                                aria-label="Supprimer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-[var(--text-secondary)]/50 font-medium px-2 flex items-center gap-1">
                              <Shield size={14} /> Protégé
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      {filtered.length > 0 && (
        <div className="mt-4 text-xs text-[var(--text-secondary)] text-center">
          {filtered.length} utilisateur{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
          {filtered.length !== users.length && ` sur ${users.length}`}
        </div>
      )}
    </div>
  )
}

export default AdminUsers