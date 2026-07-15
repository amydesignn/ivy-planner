import { useState } from 'react'
import { getStars, redeemStars } from '../lib/store'
import { StarIcon, MinusIcon, PlusIcon, CheckIcon, NavGiftIcon } from '../components/Icons'

// Lifted from Oscar's V1.1 Redeem screen (markup + tokens), wired to the store.
export default function Redeem() {
  const [balance, setBalance] = useState(getStars)
  const [item, setItem] = useState('')
  const [amt, setAmt] = useState(1)
  const [success, setSuccess] = useState(null) // { item, spent, remaining }

  const name = item.trim()
  const over = amt > balance
  const canRedeem = !!name && amt >= 1 && !over && balance > 0

  const dec = () => setAmt(a => Math.max(1, a - 1))
  const inc = () => setAmt(a => Math.min(Math.max(1, balance), a + 1))

  let hint, hintColor
  if (balance <= 0) { hint = 'Earn some stars first!'; hintColor = 'var(--red-500)' }
  else if (over) { hint = 'Not enough stars.'; hintColor = 'var(--red-500)' }
  else if (name) { hint = `You'll have ${balance - amt} ⭐ left.`; hintColor = 'var(--green-600)' }
  else { hint = "Type what you're redeeming for."; hintColor = 'var(--mauve-400)' }

  const doRedeem = () => {
    if (!canRedeem) return
    if (redeemStars(amt, name)) {
      setSuccess({ item: name, spent: amt, remaining: balance - amt })
      setBalance(getStars())
      setItem(''); setAmt(1)
    }
  }
  const redeemAgain = () => { setSuccess(null); setItem(''); setAmt(1); setBalance(getStars()) }

  return (
    <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '4px 22px 118px', background: 'var(--brand-lilac-50)' }}>
      <div style={{ animation: 'ivyfade 240ms ease both' }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--brand-iris-950)', margin: '6px 2px 14px' }}>
          Redeem stars
        </div>

        {success ? (
          /* ── Success ── */
          <div style={{
            padding: '30px 24px', borderRadius: 24, textAlign: 'center',
            background: 'linear-gradient(160deg, var(--green-50), var(--brand-lilac-50))',
            border: '2px solid var(--green-200)', animation: 'ivyfade 300ms ease both',
          }}>
            <div style={{
              width: 74, height: 74, margin: '0 auto', borderRadius: '50%',
              background: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(0, 166, 62, 0.35)',
            }}>
              <CheckIcon size={34} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--brand-iris-950)', marginTop: 16 }}>Enjoy! 🎉</div>
            <div style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--brand-lilac-900)', marginTop: 6 }}>
              You redeemed <b style={{ color: 'var(--brand-iris-950)' }}>{success.spent} ⭐</b> for<br />
              <b style={{ color: 'var(--brand-iris-950)' }}>"{success.item}"</b>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 16,
              padding: '8px 15px', background: 'var(--star-gold-subtle)', borderRadius: 18,
            }}>
              <StarIcon size={18} />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--star-gold-text)' }}>{success.remaining} stars left</span>
            </div>
            <button onClick={redeemAgain} style={{
              display: 'block', width: '100%', marginTop: 22, padding: 14, borderRadius: 16,
              background: '#fff', border: '2px solid var(--brand-lilac-200)', cursor: 'pointer',
              fontSize: 15, fontWeight: 700, color: 'var(--brand-iris-600)',
            }}>
              Redeem something else
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <>
            <div style={{
              padding: 22, borderRadius: 22, textAlign: 'center',
              background: 'linear-gradient(160deg, var(--brand-lilac-50), var(--brand-lilac-100))',
              border: '2px solid var(--brand-lilac-200)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-lilac-600)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>You have</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 6 }}>
                <StarIcon size={30} />
                <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--brand-iris-950)' }}>{balance}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--brand-lilac-600)', marginTop: 2 }}>stars to spend</div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-lilac-900)', margin: '0 2px 7px' }}>What are you redeeming?</div>
              <input
                value={item}
                onChange={e => setItem(e.target.value)}
                placeholder="e.g. Movie night, a new book…"
                style={{
                  width: '100%', padding: '15px 16px', fontSize: 15, fontWeight: 500,
                  color: 'var(--brand-iris-950)', background: '#fff',
                  border: `2px solid ${over ? 'var(--red-500)' : 'var(--mauve-200)'}`,
                  borderRadius: 16, outline: 'none',
                }}
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-lilac-900)', margin: '0 2px 7px' }}>How many stars?</div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', background: '#fff', border: '2px solid var(--mauve-200)', borderRadius: 16,
              }}>
                <button onClick={dec} aria-label="fewer stars" style={stepBtn}><MinusIcon size={18} /></button>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                  <span style={{ fontSize: 34, fontWeight: 700, color: 'var(--brand-iris-950)' }}>{amt}</span>
                  <StarIcon size={22} />
                </div>
                <button onClick={inc} aria-label="more stars" style={stepBtn}><PlusIcon size={18} /></button>
              </div>
              <div style={{ minHeight: 20, margin: '8px 4px 0', fontSize: 13, fontWeight: 600, color: hintColor }}>{hint}</div>
            </div>

            <button
              onClick={doRedeem}
              disabled={!canRedeem}
              style={{
                width: '100%', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                padding: 17, borderRadius: 18, border: 'none',
                background: canRedeem ? 'linear-gradient(180deg, var(--brand-iris-500), var(--brand-iris-600))' : 'var(--brand-iris-200)',
                boxShadow: canRedeem ? '0 5px 0 var(--brand-iris-700)' : 'none',
                cursor: canRedeem ? 'pointer' : 'not-allowed',
                color: '#fff', transition: 'transform 120ms',
              }}
            >
              <NavGiftIcon size={18} />
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Redeem now</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const stepBtn = {
  width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 12, background: 'var(--brand-iris-50)', color: 'var(--brand-iris-600)',
  border: 'none', cursor: 'pointer',
}
