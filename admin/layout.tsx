import AuthWrapper from './AuthWrapper'

export const metadata = {
  title: 'Admin Portal - Skulpt Body Contouring',
  description: 'Manage your assessment widget and view analytics',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthWrapper>{children}</AuthWrapper>
}