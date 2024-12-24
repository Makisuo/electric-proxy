import { createFileRoute } from '@tanstack/react-router'
import { type } from 'arktype'
import { toast } from 'sonner'
import { Button } from '~/components/ui'
import { authClient } from '~/lib/auth'

const searchParams = type({
  email: 'string.email',
})

export const Route = createFileRoute('/auth/_layout/success')({
  component: RouteComponent,
  validateSearch: searchParams,
})

function RouteComponent() {
  const searchParams = Route.useSearch()

  return (
    <div>
      <p>
        Successfully signed up. Please check your email for a verification link.
      </p>
      <Button
        onPress={() => {
          toast.promise(
            authClient.sendVerificationEmail({ email: searchParams.email }),
            {
              loading: 'Resending...',
              success: 'Verification email sent',
              error: (error) => error.message,
            },
          )
        }}
      >
        Resend Verification Email
      </Button>
    </div>
  )
}
