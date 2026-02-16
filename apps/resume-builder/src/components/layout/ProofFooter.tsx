interface ProofFooterProps {
  children?: React.ReactNode
}

export function ProofFooter({ children }: ProofFooterProps) {
  return (
    <footer className="border-t border-slate-700/60 bg-slate-900/80 px-4 py-3 shrink-0">
      {children ?? (
        <div className="text-xs text-slate-500">Proof footer — complete all steps to unlock proof</div>
      )}
    </footer>
  )
}
