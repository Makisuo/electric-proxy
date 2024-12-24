import {
  Link,
  Outlet,
  type ReactNode,
  createFileRoute,
  redirect,
} from '@tanstack/react-router'
import { IconFileText } from 'justd-icons'
import { Avatar, Container, Separator } from '~/components/ui'

export const Route = createFileRoute('/auth2/_layout')({
  beforeLoad: ({ context }) => {
    if (context.auth.isSignedIn) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <Container className="flex min-h-screen items-center justify-center">
      <Outlet />
    </Container>
  )
}
