import { useCallback, useState } from "react"
import { toast } from "sonner"

interface UseCopyResult {
	copyToClipboard: (text: string) => void
	isCopied: boolean
}

export function useCopy(resetInterval = 3000): UseCopyResult {
	const [isCopied, setIsCopied] = useState<boolean>(false)

	const copyToClipboard = useCallback(
		(text: string) => {
			if (typeof navigator !== "undefined" && navigator.clipboard) {
				navigator.clipboard
					.writeText(text)
					.then(() => {
						toast("Copied to clipboard")
						setIsCopied(true)
						setTimeout(() => setIsCopied(false), resetInterval)
					})
					.catch((error) => {
						toast.error("Failed to copy text: ", error)
					})
			} else {
				toast.error("Clipboard API not supported")
			}
		},
		[resetInterval],
	)

	return { copyToClipboard, isCopied }
}
