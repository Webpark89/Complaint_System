import { forwardRef, useEffect, useRef, useState } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'
// import { router } from '@inertiajs/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { PageContainer } from '~/components/page_container'
import MainLayout from '~/components/main_layout'
import { Checkbox } from '~/components/ui/checkbox'
import { Button } from '~/components/ui/button'
import { DateTime } from 'luxon'

interface ComplaintIndexProps {
  term: string
  pdpa: string
  pdpa_file_name: string
  updated_at: string | null
}

export default function ComplaintIndex(data: ComplaintIndexProps) {
  const [scrolledToBottom, setScrolledToBottom] = useState<boolean>(false)
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)
  // const clickAcceptedTerms = () => {
  //   setHasAcceptedTerms(true)
  //   return router.visit('/complaint/category')
  // }

  useEffect(() => {
    if (!hasAcceptedTerms) {
      const el = contentRef.current
      if (!el) return
      const check = () => {
        const { scrollTop, clientHeight, scrollHeight } = el
        setScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 8)
      }
      check()
      el.addEventListener('scroll', check, { passive: true })
      return () => el.removeEventListener('scroll', check)
    }
  }, [hasAcceptedTerms])

  return (
    <PageContainer>
      <section className="py-12 md:py-8">
        <MainLayout>
          <Form route="complaint.complaint.index_consent">
            {({ errors }) => (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-[#002856] hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> กลับสู่หน้าแรก
                  </Link>
                </div>

                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8 animate-[fadeIn_0.3s_ease-out_both]">
                  <TermsAndPrivacyContent
                    term={data.term}
                    pdpa={data.pdpa}
                    pdpa_file_name={data.pdpa_file_name}
                    updated_at={data.updated_at}
                    ref={contentRef}
                  />

                  <div className=" flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        name="consent"
                        disabled={!scrolledToBottom}
                        checked={isTermsAccepted}
                        onCheckedChange={(v) => setIsTermsAccepted(v === true)}
                      />
                      <span className="text-sm font-medium">เข้าใจและยอมรับเงื่อนไขการใช้งาน</span>
                    </label>
                    {!scrolledToBottom && (
                      <span className="text-xs text-[#FF4D00] font-medium">
                        กรุณาเลื่อนอ่านเนื้อหาให้จบเพื่อยอมรับเงื่อนไข
                      </span>
                    )}
                    {errors.consent && <div>{errors.consent}</div>}
                  </div>

                  <div className="mt-8 flex justify-end gap-3 pt-6">
                    <Button
                      type="submit"
                      className="bg-[#D29E0E] hover:bg-[#002856] disabled:bg-[#B8BBBF] text-white px-8 h-11"
                      disabled={!isTermsAccepted}
                      // onClick={() => clickAcceptedTerms()}
                    >
                      ถัดไป <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Form>
        </MainLayout>
      </section>
    </PageContainer>
  )
}

interface TermsAndPrivacyContentProps {
  term: string
  pdpa: string
  pdpa_file_name: string
  updated_at: string | null
}
export const TermsAndPrivacyContent = forwardRef<HTMLDivElement, TermsAndPrivacyContentProps>(
  function TermsAndPrivacyContentInner(props, ref) {
    const updatedAt = props.updated_at ? DateTime.fromISO(props.updated_at).setLocale('th') : null

    return (
      <div>
        <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-start md:gap-4 md:text-left">
          <div className="min-w-0">
            <div className="flex justify-center md:justify-start">
              <h1 className="font-display text-lg font-bold text-primary">
                เงื่อนไขการใช้งานและการคุ้มครองข้อมูลส่วนบุคคล (Terms of Use & Personal Data
                Protection)
              </h1>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {updatedAt?.isValid && (
                <>
                  อัปเดตล่าสุด: {updatedAt.toFormat('dd MMM')} {updatedAt.year + 543}
                </>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-foreground/80 md:text-left">
          กรุณากด &quot;เข้าใจและยอมรับเงื่อนไขการใช้งาน&quot;{' '}
          <span className="whitespace-nowrap md:whitespace-normal">ก่อนไปหน้าถัดไป</span>
        </p>

        <div
          ref={ref}
          className="mt-4 max-h-112.5 overflow-y-auto rounded-md border border-border bg-(--surface-muted) p-5"
        >
          <h2 className="text-base font-semibold text-primary">เงื่อนไขการใช้งาน</h2>
          {props.term.split('\n').map(function (item, idx) {
            return (
              <p key={idx} className="mt-3 text-sm text-foreground/80">
                {item}
              </p>
            )
          })}

          <h2 className="mt-6 text-base font-semibold text-primary">
            การรักษาความปลอดภัยของข้อมูลส่วนบุคคล
          </h2>
          {props.pdpa.split('\n').map(function (item, idx) {
            return (
              <p key={idx} className="mt-3 text-sm text-foreground/80">
                {item}
              </p>
            )
          })}
          {props.pdpa_file_name && props.pdpa_file_name.length > 0 ? (
            <p className="mt-3 text-sm text-foreground/80">
              <a
                className="text-primary underline"
                target="_blank"
                href={props.pdpa_file_name}
                rel="noreferrer"
              >
                แบบแจ้งเกี่ยวกับข้อมูลส่วนบุคคล (Privacy Notice)
              </a>
            </p>
          ) : (
            <></>
          )}
        </div>
      </div>
    )
  }
)

TermsAndPrivacyContent.displayName = 'TermsAndPrivacyContent'
