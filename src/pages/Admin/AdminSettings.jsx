import { useState } from 'react'
import { Search, Ban, CheckCircle, Trash2, Users, ChevronLeft, ChevronRight } from 'lucide-react'    // ✅ NOUVEAU

const USERS = []    // ✅ NOUVEAU : vide → brancher getUsersAdmin()

const STATUS_STYLE = {
  'actif':    'bg-green-100 text-green-700',
  'vérifié':  'bg-blue-100  text-blue-700',
  'suspendu': 'bg-red-100   text-red-700',
}
const ROLE_STYLE = {
  'vendeur':     'bg-amber-100  text-amber-700',
  'acheteur':    'bg-green-100  text-green-700',
  'cooperative': 'bg-purple-100 text-purple-700',
  'admin':       'bg-red-100    text-red-700',
}

function AdminUsers() {
  const [search, setSearch] = useState('')

  const filtered = USERS.filter(u =>
    !search ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-5 sm:mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E25]">Utilisateurs</h1>
          <p className="text-sm text-[#8AADA0]">
            {USERS.length} utilisateur{USERS.length > 1 ? 's' : ''} enregistré{USERS.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 bg-white border border-[#DDE8E2] rounded-xl px-3 sm:px-4 py-2.5 mb-4 sm:mb-5 max-w-md">
        <Search size={16} className="text-[#8AADA0]" />
        <input type="text" placeholder="Rechercher un utilisateur..."
               value={search} onChange={e => setSearch(e.target.value)}
               className="outline-none text-sm flex-1 bg-transparent min-w-0" />
      </div>

      {/* TABLE ou EMPTY STATE */}
      <div className="bg-white rounded-2xl border border-[#DDE8E2] overflow-hidden">
        {filtered.length === 0 ? (
          // ✅ NOUVEAU : état vide
          <div className="p-10 sm:p-16 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm sm:text-base font-semibold text-[#1A2E25] mb-1">Aucun utilisateur</p>
            <p className="text-xs sm:text-sm text-[#8AADA0]">Les nouveaux utilisateurs apparaîtront ici.</p>
          </div>
        ) : (
          // ✅ MODIFIÉ : table responsive overflow-x
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[#F5F7F5] border-b border-[#DDE8E2]">
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">UTILISATEUR</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">TÉLÉPHONE</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">RÔLE</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">PAYS</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">STATUT</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">INSCRIT</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE8E2]">
                {filtered.map((u, i) => (
                  <tr key={i} className="hover:bg-[#F5F7F5] transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0C6B4E] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1A2E25]">{u.name}</p>
                          <p className="text-xs text-[#8AADA0]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4A6355]">{u.phone}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${ROLE_STYLE[u.role]}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm">{u.country}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${STATUS_STYLE[u.status]}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#8AADA0]">{u.joined}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button className="text-[#8AADA0] hover:text-green-600 transition p-1.5" title="Vérifier" aria-label="Vérifier">
                          <CheckCircle size={16} />
                        </button>
                        <button className="text-[#8AADA0] hover:text-amber-500 transition p-1.5" title="Suspendre" aria-label="Suspendre">
                          <Ban size={16} />
                        </button>
                        <button className="text-[#8AADA0] hover:text-red-500 transition p-1.5" title="Supprimer" aria-label="Supprimer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
