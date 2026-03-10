import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { FestivalSettings } from '../../config/festival'
import { fetchPublicFestivalSettings } from '../../lib/siteSettings'
import { applyRuntimeHomeTranslations } from '../../lib/i18n'
import { resources } from '../../lib/i18nResources'
import { marsaiColors, marsaiGradients, withAlpha } from '../../theme/marsai'
import { Button } from '../../components/ui/button'
import { useTranslation } from 'react-i18next'
import { computePhases, toMs } from './homeHelpers'
import { AnimCounter, Countdown } from './homeCounters'

// Composant principal de la vue d'accueil
export function HomeView({
  preview,
}: {
  preview?: { enabled?: boolean; embedded?: boolean; lang?: 'fr' | 'en'; data?: Partial<FestivalSettings> }
} = {}) {
  const { t, i18n } = useTranslation()
  const [tick, setTick] = useState(0)
  const [settings, setSettings] = useState<FestivalSettings | null>(null)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const previewParams = useMemo(() => new URLSearchParams(window.location.search), [])
  const previewMode = preview?.enabled ?? previewParams.get('previewHome') === '1'
  const previewLang = preview?.lang ?? previewParams.get('lang')
  const previewEmbedded = preview?.embedded ?? false
  const previewData = preview?.data
  const lastEmbeddedTranslations = useRef<string | null>(null)
  const lastEmbeddedLang = useRef<string | null>(null)
  const lastPreviewDraft = useRef<string | null>(null)
  const embeddedSettings: FestivalSettings | null = useMemo(() => {
    if (!previewMode || !previewEmbedded) return null
    return { phase1CloseIso: null, phase2CatalogueIso: null, phase3PalmaresIso: null, ...(previewData ?? {}) } as FestivalSettings
  }, [previewMode, previewEmbedded, previewData])
  const shownSettings = embeddedSettings ?? settings

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 2000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const ac = new AbortController()
    if (previewMode && previewEmbedded) {
      if ((previewLang === 'fr' || previewLang === 'en') && i18n.language !== previewLang && lastEmbeddedLang.current !== previewLang) {
        lastEmbeddedLang.current = previewLang
        void i18n.changeLanguage(previewLang)
      }
      const nextTranslations = embeddedSettings?.homeTranslations ? JSON.stringify(embeddedSettings.homeTranslations) : null
      if (lastEmbeddedTranslations.current !== nextTranslations) {
        lastEmbeddedTranslations.current = nextTranslations
        applyRuntimeHomeTranslations(embeddedSettings?.homeTranslations)
      }
      return () => ac.abort()
    }

    fetchPublicFestivalSettings(ac.signal)
      .then((s) => {
        let next = s
        if (previewMode) {
          try {
            const raw = localStorage.getItem('marsai_preview_home_draft')
            if (raw) {
              const draft = JSON.parse(raw) as Partial<FestivalSettings>
              next = { ...(s ?? {}), ...draft } as FestivalSettings
            }
          } catch {
            void 0
          }
          if (previewLang === 'fr' || previewLang === 'en') void i18n.changeLanguage(previewLang)
        }
        setSettings(next)
        applyRuntimeHomeTranslations(next?.homeTranslations)
      })
      .catch(() => {})
    return () => ac.abort()
  }, [i18n, previewMode, previewLang, previewEmbedded, embeddedSettings])

  useEffect(() => {
    if (!previewMode || previewEmbedded) return
    const applyDraft = () => {
      try {
        const raw = localStorage.getItem('marsai_preview_home_draft')
        if (!raw || raw === lastPreviewDraft.current) return
        lastPreviewDraft.current = raw
        const draft = JSON.parse(raw) as Partial<FestivalSettings>
        setSettings((prev) => ({
          phase1CloseIso: null,
          phase2CatalogueIso: null,
          phase3PalmaresIso: null,
          ...(prev ?? {}),
          ...draft,
        }))
        applyRuntimeHomeTranslations(draft.homeTranslations)
      } catch {
        void 0
      }
      if ((previewLang === 'fr' || previewLang === 'en') && i18n.language !== previewLang) {
        void i18n.changeLanguage(previewLang)
      }
    }
    const startId = window.setTimeout(applyDraft, 50)
    const intervalId = window.setInterval(applyDraft, 250)
    return () => {
      window.clearTimeout(startId)
      window.clearInterval(intervalId)
    }
  }, [previewMode, previewEmbedded, previewLang, i18n])

  useEffect(() => {
    if (!previewMode || previewEmbedded) return
    const send = () => {
      const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
      window.parent.postMessage({ type: 'marsai-preview-height', height }, window.location.origin)
    }
    send()
    const raf = window.requestAnimationFrame(send)
    const id = window.setTimeout(send, 300)
    window.addEventListener('resize', send)
    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(id)
      window.removeEventListener('resize', send)
    }
  }, [previewMode, previewEmbedded, settings, i18n.language])

  const isFrLanguage = i18n.language?.startsWith('fr')
  const statusLabels = useMemo(() => {
    const live = t('home.live')
    const finished = t('home.finished')
    if (!isFrLanguage) return { live, finished }
    const normalize = (v: string) => v.toLowerCase().trim().replace(/\s+/g, ' ')
    const enDefaults = resources.en.translation.home as { live?: unknown; finished?: unknown }
    const frDefaults = resources.fr.translation.home as { live?: unknown; finished?: unknown }
    return {
      live: normalize(live) === normalize(String(enDefaults.live || '')) ? String(frDefaults.live || live) : live,
      finished:
        normalize(finished) === normalize(String(enDefaults.finished || ''))
          ? String(frDefaults.finished || finished)
          : finished,
    }
  }, [isFrLanguage, t])

  const phaseLabels = useMemo(
    () => {
      const normalize = (v: string) => v.toLowerCase().trim().replace(/\s+/g, ' ')
      const normalizePhaseText = (key: 'p1Title' | 'p1Desc' | 'p2Title' | 'p2Desc' | 'p3Title' | 'p3Desc') => {
        const value = t(`home.phases.${key}`)
        if (!isFrLanguage) return value
        const enDefault = (resources.en.translation.home.phases as Record<string, string>)[key]
        const frDefault = (resources.fr.translation.home.phases as Record<string, string>)[key]
        const normalizedValue = normalize(value)
        const isEnglishFallback =
          normalizedValue === normalize(enDefault) ||
          (key === 'p1Title' && normalizedValue.includes('call for films')) ||
          (key === 'p2Title' && normalizedValue.includes('official selection')) ||
          (key === 'p3Title' && normalizedValue.includes('winners')) ||
          (key === 'p2Desc' && normalizedValue.includes('selected by the jury')) ||
          (key === 'p3Desc' && (normalizedValue.includes('jury prize') || normalizedValue.includes('public prize')))
        return isEnglishFallback ? frDefault : value
      }
      return [
        { title: normalizePhaseText('p1Title'), desc: normalizePhaseText('p1Desc') },
        { title: normalizePhaseText('p2Title'), desc: normalizePhaseText('p2Desc') },
        { title: normalizePhaseText('p3Title'), desc: normalizePhaseText('p3Desc') },
      ]
    },
    [isFrLanguage, t],
  )

  const { phases, currentIndex } = useMemo(() => computePhases(shownSettings, nowMs, phaseLabels), [shownSettings, nowMs, phaseLabels])

  const phaseLabel = currentIndex === 0 ? 'PHASE_01' : currentIndex === 1 ? 'PHASE_02' : 'PHASE_03'
  const phaseTitle = phaseLabels[currentIndex]?.title ?? ''
  const targetIso =
    currentIndex === 0 ? shownSettings?.phase1CloseIso : currentIndex === 1 ? shownSettings?.phase2CatalogueIso : shownSettings?.phase3PalmaresIso

  const phase1Ms = toMs(shownSettings?.phase1CloseIso)
  const phase2Ms = toMs(shownSettings?.phase2CatalogueIso)
  const phase3Ms = toMs(shownSettings?.phase3PalmaresIso)
  const submissionsOpen = phase1Ms === null ? true : nowMs < phase1Ms
  const phase2Started = phase2Ms !== null && nowMs >= phase2Ms
  const phase3Finished = phase3Ms !== null && nowMs >= phase3Ms
  const statTo = (key: 'countries' | 'filmsExpected' | 'visitors', fallback: number) => {
    const raw = String(t(`home.statsNumbers.${key}`, { defaultValue: String(fallback) }) ?? fallback)
    const digits = raw.replace(/[^\d]/g, '')
    const value = Number.parseInt(digits, 10)
    return Number.isFinite(value) && value > 0 ? value : fallback
  }
  const stats = [
    { to: statTo('countries', 120), suffix: '+', label: t('home.stats.countries'), col: marsaiColors.primary },
    { to: statTo('filmsExpected', 600), suffix: '+', label: t('home.stats.filmsExpected'), col: marsaiColors.accent },
    { to: statTo('visitors', 3000), suffix: '', label: t('home.stats.visitors'), col: marsaiColors.primary2 },
  ]

  return (
    <div className="relative text-white" style={{ minHeight: '100vh' }}>
      <section
        className="relative flex min-h-screen flex-col overflow-hidden"
        style={
          shownSettings?.heroImageUrl
            ? {
                backgroundImage: `linear-gradient(rgba(5,3,13,0.82), rgba(5,3,13,0.9)), url("${shownSettings.heroImageUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        {shownSettings?.siteLogo ? (
          <div className="absolute left-5 top-5 z-20 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 backdrop-blur-sm">
            <span className="f-orb text-xs font-black tracking-wider text-white/90">{shownSettings.siteLogo}</span>
          </div>
        ) : null}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px]" style={{ animation: 'rotateSlow 40s linear infinite' }}>
          <div className="absolute inset-0 rounded-full border" style={{ borderColor: withAlpha(marsaiColors.primary, 0.06) }} />
          <div className="absolute inset-[60px] rounded-full border" style={{ borderColor: withAlpha(marsaiColors.accent, 0.04) }} />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-24 text-center">
          <div
            className="mb-8 flex items-center gap-2.5 rounded-full border border-[#7d71fb]/30 bg-[#7d71fb]/8 px-5 py-2 backdrop-blur-sm"
            style={{ animation: 'fadeUp 0.5s ease-out 0.1s both', boxShadow: '0 0 30px rgba(125,113,251,0.15)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7d71fb] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7d71fb]" />
            </span>
            <span className="f-mono text-[11px] uppercase tracking-[0.2em] text-[#7d71fb]">
              {submissionsOpen ? t('home.eyebrow') : t('home.eyebrowClosed')} {t('home.eyebrowSuffix')}
            </span>
          </div>

          <div className="f-mono mb-4 text-xs tracking-[0.4em] text-white/25 uppercase" style={{ animation: 'fadeUp 0.5s ease-out 0.2s both' }}>
            {t('home.terminal', { cursor: tick % 2 === 0 ? '▮' : '  ' })}
          </div>

          <h1
            className="f-orb font-black leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(2.8rem, 9vw, 7.5rem)', animation: 'fadeUp 0.7s ease-out 0.3s both' }}
          >
            <div className="text-white">{t('home.title1')}</div>
            <div className="text-white/30">{t('home.title2')}</div>
            <div
              style={{
                backgroundImage: 'linear-gradient(90deg, #7d71fb, #a970fc, #ff5c35, #7d71fb)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimText 3s linear infinite',
              }}
            >
              {t('home.title3')}
            </div>
          </h1>

          <p className="f-mono mt-6 max-w-xl text-sm leading-relaxed text-white/40" style={{ animation: 'fadeUp 0.7s ease-out 0.5s both' }}>
            {t('home.heroText', { duration: t('home.duration'), ai: t('home.ai') })}
          </p>
          {shownSettings?.festivalDescription ? (
            <p className="f-mono mt-3 max-w-xl text-xs leading-relaxed text-white/35" style={{ animation: 'fadeUp 0.7s ease-out 0.58s both' }}>
              {shownSettings.festivalDescription}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col items-center justify-center gap-4" style={{ animation: 'fadeUp 0.7s ease-out 0.65s both' }}>
            {submissionsOpen ? (
              <Button
                asChild
                className="f-orb group relative overflow-hidden rounded-full px-8 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300"
                style={{ background: marsaiGradients.primaryToAccent, animation: 'pulseGlow 2.5s ease-in-out infinite' }}
              >
                <Link to="/submit" className="flex items-center gap-3">
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <svg className="relative h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="relative">{t('home.ctaSubmit')}</span>
                </Link>
              </Button>
            ) : null}
            {!submissionsOpen && !phase2Started ? <p className="f-orb text-sm font-bold text-white/75">{t('home.phaseNoticePhase2')}</p> : null}
            {!submissionsOpen && phase2Started && !phase3Finished ? (
              <>
                <p className="f-orb text-sm font-bold text-white/75">{t('home.phaseNoticePhase3')}</p>
                <Button
                  asChild
                  className="f-orb group relative overflow-hidden rounded-full px-8 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300"
                  style={{ background: marsaiGradients.primaryToAccent, animation: 'pulseGlow 2.5s ease-in-out infinite' }}
                >
                  <Link to="/catalogue" className="flex items-center gap-3">
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <svg className="relative h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V6.75Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 9.75 3.75 2.25-3.75 2.25v-4.5Z" />
                    </svg>
                    <span className="relative">{t('home.ctaCatalogue')}</span>
                  </Link>
                </Button>
              </>
            ) : null}
            {!submissionsOpen && phase3Finished ? (
              <>
                <p className="f-orb text-sm font-bold text-white/75">{t('home.phaseNoticePalmares')}</p>
                <Button
                  asChild
                  className="f-orb group relative overflow-hidden rounded-full px-8 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300"
                  style={{ background: marsaiGradients.primaryToAccent, animation: 'pulseGlow 2.5s ease-in-out infinite' }}
                >
                  <Link to="/palmares" className="flex items-center gap-3">
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <svg className="relative h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5v1.5a3.75 3.75 0 0 1-3 3.674V14.25h2.25a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5h2.25v-2.326a3.75 3.75 0 0 1-3-3.674v-1.5Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 8.25H6a2.25 2.25 0 0 0 2.25 2.25M15.75 8.25H18a2.25 2.25 0 0 1-2.25 2.25" />
                    </svg>
                    <span className="relative">{t('home.palmaresCta')}</span>
                  </Link>
                </Button>
              </>
            ) : null}
          </div>

          <div className="mt-14 w-full max-w-4xl" style={{ animation: 'fadeUp 0.7s ease-out 0.8s both' }}>
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#7d71fb]/30 to-transparent" />
              <span className="f-mono text-[9px] uppercase tracking-[0.3em] text-white/20">{t('home.timeline')}</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ff5c35]/30 to-transparent" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div
                className="relative overflow-hidden rounded-2xl p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(125,113,251,0.1) 0%, rgba(5,3,13,0.7) 100%)',
                  border: '1px solid rgba(125,113,251,0.25)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7d71fb]/80 to-transparent" />
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="f-mono text-[9px] uppercase tracking-[0.2em] text-[#7d71fb]">
                    {t('home.phaseLabel', { phase: phaseLabel })}
                  </span>
                </div>
                <div className="f-orb mb-4 text-sm font-bold text-white/80">{phaseTitle}</div>
                {targetIso ? (
                  <Countdown
                    targetIso={targetIso}
                    labels={{
                      closed: t('home.countdown.closed'),
                      days: t('home.countdown.days'),
                      hours: t('home.countdown.hours'),
                      minutes: t('home.countdown.minutes'),
                      seconds: t('home.countdown.seconds'),
                    }}
                  />
                ) : (
                  <p className="f-mono text-sm uppercase tracking-widest text-white/30">{t('home.dateTbd')}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {phases.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
                    style={{
                      background: p.active ? 'rgba(125,113,251,0.1)' : 'rgba(255,255,255,0.02)',
                      border: p.active ? '1px solid rgba(125,113,251,0.3)' : '1px solid rgba(255,255,255,0.05)',
                      opacity: p.active ? 1 : 0.45,
                    }}
                  >
                    <div
                      className="f-orb flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black"
                      style={{
                        background: p.active ? 'linear-gradient(135deg, #7d71fb, #ff5c35)' : 'rgba(255,255,255,0.05)',
                        color: p.active ? '#fff' : 'rgba(255,255,255,0.25)',
                        boxShadow: p.active ? '0 0 14px rgba(125,113,251,0.5)' : 'none',
                      }}
                    >
                      {p.num}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="f-orb text-[11px] font-bold text-white/80 leading-tight">{p.title}</div>
                      <div className="f-mono text-[9px] text-white/30 mt-0.5">{p.desc}</div>
                    </div>
                    {p.active ? (
                      <span className="f-mono shrink-0 rounded-full bg-[#7d71fb]/15 px-2 py-0.5 text-[8px] uppercase tracking-widest text-[#7d71fb]">
                        {phase3Finished && p.num === '03' ? statusLabels.finished : statusLabels.live}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-10 md:gap-16" style={{ animation: 'fadeUp 0.7s ease-out 1s both' }}>
            {stats.map((s, idx) => (
              <div key={s.label} className="flex flex-col items-center gap-1" style={{ animation: 'float 5s ease-in-out infinite', animationDelay: `${idx * 0.35}s` }}>
                <span className="f-orb text-4xl font-black" style={{ color: s.col }}>
                  <AnimCounter to={s.to} suffix={s.suffix} locale={i18n.language === 'fr' ? 'fr-FR' : 'en-US'} />
                </span>
                <span className="f-mono text-[9px] uppercase tracking-[0.25em] text-white/30">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mb-8 flex flex-col items-center gap-2 opacity-30" style={{ animation: 'fadeIn 1s ease-out 2s both' }}>
          <span className="f-mono text-[8px] uppercase tracking-[0.4em] text-white/50">{t('home.scroll')}</span>
          <div className="h-8 w-4 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-white/60" style={{ animation: 'float 1.2s ease-in-out infinite' }} />
          </div>
        </div>
        {shownSettings?.footerText ? (
          <div className="relative z-10 pb-6 text-center">
            <span className="f-mono text-[10px] uppercase tracking-[0.2em] text-white/30">{shownSettings.footerText}</span>
          </div>
        ) : null}
      </section>

      <section className="relative mx-auto max-w-6xl px-5 py-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#ff5c35]/6 blur-[100px]" />
        </div>

        <div className="relative grid gap-5 lg:grid-cols-12">
          <div
            className="relative overflow-hidden rounded-3xl p-8 lg:col-span-8 md:p-10"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(5,3,13,0.7))', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="absolute bottom-0 right-0 h-64 w-64 bg-gradient-to-tl from-[#ff5c35]/8 to-transparent" />

            <div className="mb-5 inline-flex items-center gap-2 rounded border border-white/10 bg-white/4 px-3 py-1">
              <svg className="h-3 w-3 text-[#ff5c35]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="f-mono text-[10px] tracking-widest text-white/40">{t('home.place')}</span>
            </div>

            <h2 className="f-orb text-2xl font-black text-white md:text-3xl">
              {t('home.featureTitle1')}
              <br />
              <span style={{ backgroundImage: 'linear-gradient(90deg, #7d71fb, #ff5c35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {t('home.featureTitle2')}
              </span>
            </h2>

            <p className="f-mono mt-4 max-w-lg text-sm leading-relaxed text-white/40">
              {t('home.featureText')}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {(t('home.featureTags', { returnObjects: true }) as string[]).map((tag) => (
                <span
                  key={tag}
                  className="f-mono rounded border border-white/8 bg-white/3 px-3 py-1 text-[10px] uppercase tracking-wider text-white/35 transition-all hover:border-[#7d71fb]/30 hover:text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>

          </div>

          <div className="flex flex-col gap-3 lg:col-span-4">
            {stats.map((s) => (
              <div key={s.label} className="relative overflow-hidden rounded-2xl p-5 text-center" style={{ border: `1px solid ${s.col}22`, background: `${s.col}08` }}>
                <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${s.col}70, transparent)` }} />
                <div className="f-orb text-4xl font-black" style={{ color: s.col }}>
                  <AnimCounter to={s.to} suffix={s.suffix} locale={i18n.language === 'fr' ? 'fr-FR' : 'en-US'} />
                </div>
                <div className="f-mono mt-1 text-[9px] uppercase tracking-[0.2em] text-white/30">{s.label}</div>
              </div>
            ))}

            <div className="relative overflow-hidden rounded-2xl p-4" style={{ border: '1px solid rgba(255,92,53,0.15)', background: 'rgba(255,92,53,0.05)' }}>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff5c35]/50 to-transparent" />
              <div className="f-mono text-[8px] uppercase tracking-[0.25em] text-[#ff5c35]/50 mb-1">{t('home.themeTitle')}</div>
              <div className="f-orb text-sm font-bold text-white/60">{t('home.themeQuote')}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
