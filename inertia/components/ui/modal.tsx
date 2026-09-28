import { type FC } from 'react'

type Props = {
  onClose: () => void
  children: React.ReactNode
}

const Modal: FC<Props> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl">{children}</div>
    </div>
  )
}

export default Modal
