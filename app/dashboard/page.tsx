import { getRedirects } from '@/app/actions'
import { CreateRedirectForm } from '@/components/create-redirect-form'
import { RedirectList } from '@/components/redirect-list'
import { title } from '@/components/primitives'

export default async function DashboardPage() {
 const redirects = await getRedirects()

 return (
  <div className="max-w-4xl mx-auto">
   <h1 className={title({ class: "mb-8" })}>Dashboard</h1>
   <CreateRedirectForm />
   <RedirectList redirects={redirects} />
  </div>
 )
}
