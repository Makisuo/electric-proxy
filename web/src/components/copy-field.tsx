import { IconCheck, IconDuplicate } from "justd-icons"
import { AnimatePresence, motion } from "motion/react"
import { useCopy } from "~/lib/hooks/use-copy"
import { TextField } from "./ui/text-field"

export const CopyField = ({ value }: { value: string }) => {
	const { copyToClipboard, isCopied } = useCopy()

	return (
		<TextField
			className="cursor-pointer"
			aria-label="copy value"
			value={value.replace(/https?:\/\//, "")}
			isReadOnly
			onSelect={() => copyToClipboard(value)}
			suffix={
				<div className="pr-2">
					<AnimatePresence mode="wait" initial={false}>
						{isCopied ? (
							<motion.div
								key="check"
								initial={{ opacity: 1, scale: 1 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ duration: 0.2 }}
							>
								<IconCheck className="size-4" />
							</motion.div>
						) : (
							<motion.div
								key="copy"
								initial={{ opacity: 1, scale: 1 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ duration: 0.2 }}
							>
								<IconDuplicate className="size-4" onClick={() => copyToClipboard(value)} />
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			}
		/>
	)
}
