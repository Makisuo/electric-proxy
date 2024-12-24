import { createContext, useState } from "react"

export type AuthProviderProps = {
	errorMessage: string | null
	setErrorMessage: (errorMessage: string | null) => void
}

export const AuthContext = createContext<AuthProviderProps>({
	errorMessage: null,
	setErrorMessage: () => null,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	return <AuthContext value={{ errorMessage, setErrorMessage }}>{children}</AuthContext>
}
