import './globals.css'

export const metadata = {
  title: 'Грязные деньги',
  description: 'Подсчет средств для настольной игры',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="max-w-md mx-auto p-4" style={{ background: '#f5f5f5' }}>
        {children}
      </body>
    </html>
  )
}