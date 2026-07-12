import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/',        icon: '✅', label: 'Tasks'   },
  { to: '/redeem',  icon: '🎁', label: 'Redeem'  },
  { to: '/history', icon: '📋', label: 'History' },
  { to: '/stats',   icon: '📊', label: 'Stats'   },
  { to: '/manage',  icon: '✏️',  label: 'Manage'  },
]

export default function Nav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--surface-card)] border-t border-[var(--border-default)] flex safe-bottom z-50">
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors
             ${isActive
               ? 'text-[var(--brand-primary)]'
               : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
             }`
          }
        >
          <span className="text-xl leading-none">{tab.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide leading-none">
            {tab.label}
          </span>
        </NavLink>
      ))}
    </nav>
  )
}
