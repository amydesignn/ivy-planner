import { NavLink } from 'react-router-dom'
import { NavHomeIcon, NavGiftIcon, NavClockIcon, NavBarsIcon } from './Icons'

// V1.1 bottom nav — 4 destinations. Manage is reached via the Edit button on Home,
// so it is intentionally not a tab here.
const tabs = [
  { to: '/',        Icon: NavHomeIcon,  label: 'Home'     },
  { to: '/redeem',  Icon: NavGiftIcon,  label: 'Redeem'   },
  { to: '/history', Icon: NavClockIcon, label: 'History'  },
  { to: '/stats',   Icon: NavBarsIcon,  label: 'Progress' },
]

export default function Nav() {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', background: '#fff',
      borderTop: '1px solid var(--brand-lilac-100)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map(({ to, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 5, padding: '14px 0 16px',
            textDecoration: 'none',
            color: isActive ? 'var(--brand-iris-600)' : 'var(--mauve-400)',
          })}
        >
          <Icon size={24} />
          <span style={{ fontSize: 12, fontWeight: 700 }}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
