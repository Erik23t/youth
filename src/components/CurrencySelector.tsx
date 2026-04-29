import { useState, useEffect, useRef } from 'react'
import { CURRENCY_MAP, getCurrencyInfo, getSavedCountry, saveCountry } from '../lib/currency'
import { ChevronDown, Globe } from 'lucide-react'

interface CurrencySelectorProps {
  onChange?: (countryCode: string) => void
}

const COUNTRY_LIST = [
  'US','BR','GB','CA','AU',
  'DE','FR','ES','IT','PT','NL','BE','AT','GR','FI',
  'IE','LU','SK','SI','EE','LV','LT','CY','MT','HR',
  'CH','NO','SE','DK','PL','CZ','HU','RO','BG',
  'MX','AR','JP','SG','NZ',
]

export default function CurrencySelector({ onChange }: CurrencySelectorProps) {
  const [selected, setSelected] = useState(getSavedCountry())
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: CustomEvent) => setSelected(e.detail.country)
    window.addEventListener('zylumia_country_changed', handler as EventListener)
    return () => window.removeEventListener('zylumia_country_changed', handler as EventListener)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch('') }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => { if (open) setTimeout(() => searchRef.current?.focus(), 50) }, [open])

  const handleSelect = (code: string) => { setSelected(code); saveCountry(code); onChange?.(code); setOpen(false); setSearch('') }

  const filtered = COUNTRY_LIST.filter(code => {
    if (!search) return true
    const info = CURRENCY_MAP[code]
    const q = search.toLowerCase()
    return info.name.toLowerCase().includes(q) || info.code.toLowerCase().includes(q) || code.toLowerCase().includes(q)
  })

  const current = getCurrencyInfo(selected)

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 10px', border: '1px solid #e5e7eb',
          borderRadius: '6px', background: open ? '#f9fafb' : '#fff',
          cursor: 'pointer', fontSize: '12px', fontWeight: 600,
          color: '#374151', whiteSpace: 'nowrap', transition: 'all .15s', outline: 'none',
        }}
        title="Selecionar moeda"
      >
        <Globe style={{ width: 13, height: 13, color: '#9ca3af' }} />
        <span>{CURRENCY_MAP[selected]?.flag || '🌐'}</span>
        <span style={{ maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {CURRENCY_MAP[selected]?.name?.split(' ')[0] || selected}
        </span>
        <span style={{ color: '#9ca3af', fontWeight: 400 }}>|</span>
        <span style={{ color: '#6d28d9', fontWeight: 700 }}>{current.code} {current.symbol}</span>
        <ChevronDown style={{ width: 12, height: 12, color: '#9ca3af', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 9999,
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)', width: 260, overflow: 'hidden',
        }}>
          <div style={{ padding: '10px 10px 6px', borderBottom: '1px solid #f3f4f6' }}>
            <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar país ou moeda…"
              style={{ width: '100%', padding: '6px 10px', fontSize: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            {filtered.length === 0 && <div style={{ padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: '12px' }}>Nenhum resultado</div>}
            {filtered.map(code => {
              const info = CURRENCY_MAP[code]
              const isActive = code === selected
              return (
                <button key={code} onClick={() => handleSelect(code)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                    padding: '9px 14px', border: 'none', background: isActive ? '#faf5ff' : 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'background .1s', fontSize: '13px',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb' }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{info.flag}</span>
                  <span style={{ flex: 1, color: '#374151', fontWeight: isActive ? 600 : 400 }}>{info.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? '#6d28d9' : '#9ca3af', background: isActive ? '#ede9fe' : '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>
                    {info.code}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
