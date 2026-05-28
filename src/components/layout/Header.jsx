import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Moon, Sun, LogOut, User } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { setTheme } from '../../store/slices/uiSlice'
import { useAuth } from '../../hooks/useAuth'

export default function Header({ onToggleSidebar }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const theme = useSelector((state) => state.ui.theme)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    dispatch(setTheme(newTheme))
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Left */}
      <button
        onClick={onToggleSidebar}
        className="p-2 hover:bg-secondary rounded-lg transition-colors"
        title="Toggle Sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* User Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">{user.name || user.email}</div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-border">
                  <div className="text-sm font-medium">{user.name || user.email}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    navigate('/settings')
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-secondary text-sm transition-colors"
                >
                  <User size={16} />
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-secondary text-destructive text-sm transition-colors border-t border-border rounded-b-lg"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
