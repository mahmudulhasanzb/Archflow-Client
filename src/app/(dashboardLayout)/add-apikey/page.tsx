'use client';

import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Trash2,
  RefreshCw,
  AlertCircle,
  Zap,
  Sparkles,
  Eye,
  EyeOff,
  Coins,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getUserApiKeyStatus,
  saveUserApiKey,
  deleteUserApiKey,
  UserApiKeyStatus,
} from '@/lib/api/userApiKey';
import DisconnectKeyModal from '@/components/blueprint/DisconnectKeyModal';

export default function AddApiKeyPage() {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKeyText, setShowKeyText] = useState(false);
  const [status, setStatus] = useState<UserApiKeyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  // Load key status on mount
  useEffect(() => {
    loadKeyStatus();
  }, []);

  const loadKeyStatus = async () => {
    try {
      setLoading(true);
      const data = await getUserApiKeyStatus();
      setStatus(data);
    } catch (err: any) {
      console.error('Failed to load API key status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await getUserApiKeyStatus();
      setStatus(data);
      toast.success('OpenRouter balance updated.');
    } catch {
      toast.error('Failed to refresh balance.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      toast.error('Please enter an OpenRouter API key.');
      return;
    }

    if (!apiKeyInput.trim().startsWith('sk-or-')) {
      toast.error('OpenRouter API keys typically start with "sk-or-". Please double check your key.');
    }

    const toastId = toast.loading('Verifying key with OpenRouter...');
    try {
      setSaving(true);
      const res = await saveUserApiKey(apiKeyInput.trim());
      toast.success(res.message || 'API key connected successfully!', { id: toastId });
      setApiKeyInput('');
      await loadKeyStatus();
    } catch (err: any) {
      toast.error(err?.message || 'Verification failed. Please check your key.', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnectClick = () => {
    setShowDisconnectModal(true);
  };

  const handleConfirmDisconnect = async () => {
    const toastId = toast.loading('Disconnecting API key...');
    try {
      setRemoving(true);
      const res = await deleteUserApiKey();
      toast.success(res.message || 'API key removed.', { id: toastId });
      setShowDisconnectModal(false);
      await loadKeyStatus();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to remove API key.', { id: toastId });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="space-y-3 border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-semibold text-foreground">
            <KeyRound className="h-3.5 w-3.5 text-indigo-500" />
            <span>Bring Your Own Key (BYOK)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground tracking-tight">
            OpenRouter API Settings
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Connect your personal OpenRouter API key to bypass generation quotas. You can generate unlimited blueprints as long as your key has active credits or free-tier quota.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            <p className="text-xs text-muted-foreground">Checking OpenRouter key status...</p>
          </div>
        ) : status?.hasCustomKey ? (
          /* Active Connected Key Card */
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-foreground">
                        {status.label || 'Connected OpenRouter Key'}
                      </h2>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Active
                      </span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground mt-0.5">
                      {status.apiKey}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh Balance</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDisconnectClick}
                    disabled={removing}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {removing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>

              {/* Balance & Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="rounded-xl border border-border/70 bg-card p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span>Remaining Balance</span>
                    <Coins className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="text-xl font-extrabold font-display text-foreground">
                    {status.limit_remaining !== null && status.limit_remaining !== undefined
                      ? `$${Number(status.limit_remaining).toFixed(4)}`
                      : 'Unlimited / BYOK'}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {status.limit !== null && status.limit !== undefined
                      ? `Out of $${Number(status.limit).toFixed(2)} limit`
                      : 'Pay-as-you-go key cap'}
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-card p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span>Total Key Usage</span>
                    <Zap className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div className="text-xl font-extrabold font-display text-foreground">
                    ${Number(status.usage ?? 0).toFixed(4)}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Cumulative all-time usage
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-card p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span>Account Tier</span>
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="text-xl font-extrabold font-display text-foreground">
                    {status.is_free_tier ? 'Free Models' : 'Standard Paid'}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {status.is_free_tier
                      ? '50 requests/day on free models'
                      : 'High-speed priority throughput'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Connect New API Key Form */
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                  <KeyRound className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display text-foreground">
                    Connect an OpenRouter API Key
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Paste your key below. We will immediately test its validity before storing it.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="apiKey"
                    className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                  >
                    OpenRouter API Key
                  </label>
                  <div className="relative">
                    <input
                      id="apiKey"
                      type={showKeyText ? 'text' : 'password'}
                      placeholder="sk-or-v1-..."
                      value={apiKeyInput}
                      onChange={e => setApiKeyInput(e.target.value)}
                      disabled={saving}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pr-10 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKeyText(!showKeyText)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showKeyText ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Your key is securely stored in your private user profile and only utilized to communicate with OpenRouter for blueprint synthesis.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving || !apiKeyInput.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Verifying with OpenRouter...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Verify & Connect Key</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <span>Get an OpenRouter Key</span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Informational Perks & Guide Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Zap className="h-4 w-4 text-amber-500" />
              <h3>Unlimited Blueprint Generations</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When you add an API key, the platform removes all lifetime (3) or daily (10) blueprint quotas. You can generate architectures, PRDs, and schemas continuously without arbitrary interruptions.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <ShieldCheck className="h-4 w-4 text-indigo-500" />
              <h3>How to Get an OpenRouter Key</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              1. Sign in or create a free account at{' '}
              <a
                href="https://openrouter.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-foreground font-semibold"
              >
                openrouter.ai
              </a>
              .<br />
              2. Go to the <strong>Keys</strong> section and click <strong>Create Key</strong>.<br />
              3. Copy your key and paste it above. You can use free models or add credits anytime.
            </p>
          </div>
        </div>

        {/* Custom Industrial Disconnect Confirmation Modal */}
        <DisconnectKeyModal
          isOpen={showDisconnectModal}
          onClose={() => setShowDisconnectModal(false)}
          onConfirm={handleConfirmDisconnect}
          loading={removing}
          keyLabel={status?.label}
        />
      </div>
    </div>
  );
}
