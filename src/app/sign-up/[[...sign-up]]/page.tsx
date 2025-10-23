import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="h-screen w-screen flex flex-1 items-center justify-center">
      <SignUp />
    </div>
  )
}