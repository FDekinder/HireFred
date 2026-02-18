'use client'

import { motion } from 'framer-motion'
import { RecruiterContact } from '@/lib/api'

const STATUS_COLORS: Record<string, string> = {
  active: 'text-lime border-lime/30 bg-lime/10',
  responded: 'text-electric-blue border-electric-blue/30 bg-electric-blue/10',
  interview: 'text-hot-pink border-hot-pink/30 bg-hot-pink/10',
  closed: 'text-white/40 border-white/20 bg-white/5',
}

export function ContactsTable({ contacts }: { contacts: RecruiterContact[] }) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-bold mb-6 text-white">Recruiter & Hiring Manager Contacts</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {['Name', 'Company', 'Role', 'Last Contact', 'Status', 'Note'].map(col => (
                <th key={col} className="text-left py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((c, i) => {
              const colorClass = STATUS_COLORS[c.status.toLowerCase()] ?? 'text-white/40 border-white/20 bg-white/5'
              return (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 text-white font-medium">{c.name}</td>
                  <td className="py-3 px-4 text-white/70">{c.company}</td>
                  <td className="py-3 px-4 text-white/70">{c.role}</td>
                  <td className="py-3 px-4 text-white/50">{c.last_contact_date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs border capitalize ${colorClass}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white/50 max-w-xs truncate">{c.note ?? '—'}</td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {contacts.length === 0 && (
          <p className="text-center py-10 text-white/30 text-sm">No contacts recorded yet.</p>
        )}
      </div>
    </div>
  )
}
