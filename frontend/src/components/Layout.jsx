import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1f36',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </div>
  )
}
