import { useState, useEffect, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';
interface ToastItem { id: number; msg: string; type: ToastType; }

let _addToast: ((msg: string, type: ToastType) => void) | null = null;

export function toast(msg: string, type: ToastType = 'info') {
  if (_addToast) _addToast(msg, type);
}
export const toastSuccess = (msg: string) => toast(msg, 'success');
export const toastError   = (msg: string) => toast(msg, 'error');
export const toastInfo    = (msg: string) => toast(msg, 'info');

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    _addToast = (msg, type) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };
    return () => { _addToast = null; };
  }, []);

  const colors: Record<ToastType, { bg: string; border: string; icon: string }> = {
    success: { bg: '#f0fdf4', border: '#16a34a', icon: '✅' },
    error:   { bg: '#fef2f2', border: '#dc2626', icon: '❌' },
    info:    { bg: '#eff6ff', border: '#2563eb', icon: 'ℹ️' },
  };

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px', width: 'calc(100vw - 40px)' }}>
      {toasts.map(t => {
        const c = colors[t.type];
        return (
          <div key={t.id} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', animation: 'zSlideIn 0.25s ease' }}>
            <span style={{ fontSize: '16px', flexShrink: 0 }}>{c.icon}</span>
            <span style={{ fontSize: '14px', color: '#111827', lineHeight: '1.5', flex: 1 }}>{t.msg}</span>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '18px', lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
          </div>
        );
      })}
      <style>{"@keyframes zSlideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }"}</style>
    </div>
  );
}

interface ConfirmOptions { title: string; message: string; confirmLabel?: string; danger?: boolean; }
type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

let _confirm: ConfirmFn | null = null;

export function confirm(opts: ConfirmOptions): Promise<boolean> {
  if (_confirm) return _confirm(opts);
  return Promise.resolve(false);
}

export function ConfirmModal() {
  const [state, setState] = useState<{ opts: ConfirmOptions; resolve: (v: boolean) => void } | null>(null);

  useEffect(() => {
    _confirm = (opts) => new Promise<boolean>(resolve => setState({ opts, resolve }));
    return () => { _confirm = null; };
  }, []);

  const handleClose = useCallback((result: boolean) => {
    state?.resolve(result);
    setState(null);
  }, [state]);

  if (!state) return null;

  const { title, message, confirmLabel = 'Confirmar', danger = false } = state.opts;
  return (
    <div onClick={() => handleClose(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 99998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '28px 24px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'zFadeIn 0.2s ease' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: '18px', color: '#111827', fontWeight: 700 }}>{title}</h3>
        <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={() => handleClose(false)} style={{ padding: '10px 20px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Cancelar</button>
          <button onClick={() => handleClose(true)} style={{ padding: '10px 20px', background: danger ? '#dc2626' : '#7c3aed', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#fff' }}>{confirmLabel}</button>
        </div>
      </div>
      <style>{"@keyframes zFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }"}</style>
    </div>
  );
}
