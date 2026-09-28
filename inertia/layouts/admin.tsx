import { type Data } from '@generated/data'
import { type ReactElement } from 'react'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  return children
}
