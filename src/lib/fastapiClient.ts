/**
 * FastAPI investor portal client.
 *
 * Set INVESTOR_API_URL in your environment to enable.
 * When not set every function returns null and the site falls back
 * to the hardcoded investors in src/lib/investors.ts.
 *
 * Expected FastAPI base URL (no trailing slash):
 *   e.g. https://ellice-investor-api.up.railway.app
 */

const API = (process.env.INVESTOR_API_URL ?? "").replace(/\/$/, "");

export interface FastAPILoginResult {
  access_token: string;
  token_type: string;
  investor_id: string;
  name: string;
  email: string;
  account_number: string;
  is_admin?: boolean;
}

export interface FastAPIStatement {
  id: string | number;
  period: string;
  date: string;
  opening_balance: number;
  closing_balance: number;
  contributions: number;
  withdrawals: number;
  gain_loss: number;
  return_percent: number;
}

export interface FastAPIInvestor {
  id: string;
  name: string;
  email: string;
  account_number: string;
  join_date: string;
  invested_capital: number;
  current_value: number;
  allocation_percent: number;
  statements: FastAPIStatement[];
}

/**
 * Authenticate against the FastAPI backend.
 * Returns login payload including the JWT access_token, or null on failure.
 */
export async function fastapiLogin(
  email: string,
  password: string
): Promise<FastAPILoginResult | null> {
  if (!API) return null;
  try {
    // Try JSON body first (custom endpoint)
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.access_token) return data as FastAPILoginResult;
    }

    // Fall back to OAuth2 form-encoded (FastAPI default /token)
    const form = new URLSearchParams({ username: email, password });
    const res2 = await fetch(`${API}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      cache: "no-store",
    });
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2?.access_token) return data2 as FastAPILoginResult;
    }
  } catch {
    // Network error — fall through to hardcoded data
  }
  return null;
}

/**
 * Fetch the authenticated investor's profile + statement history from FastAPI.
 * Pass the JWT returned by fastapiLogin.
 */
export async function fastapiGetInvestor(
  apiToken: string
): Promise<FastAPIInvestor | null> {
  if (!API || !apiToken) return null;
  try {
    const res = await fetch(`${API}/investor/me`, {
      headers: { Authorization: `Bearer ${apiToken}` },
      next: { revalidate: 300 },
    });
    if (res.ok) return (await res.json()) as FastAPIInvestor;
  } catch {
    // Network error
  }
  return null;
}

/**
 * Map a FastAPIInvestor response to the shape the existing dashboard expects.
 * Normalises snake_case keys to camelCase.
 */
export function mapFastapiInvestor(inv: FastAPIInvestor) {
  return {
    id: inv.id,
    name: inv.name,
    email: inv.email,
    accountNumber: inv.account_number,
    joinDate: inv.join_date,
    investedCapital: inv.invested_capital,
    currentValue: inv.current_value,
    allocationPercent: inv.allocation_percent,
    statements: inv.statements.map((s) => ({
      id: String(s.id),
      period: s.period,
      date: s.date,
      openingBalance: s.opening_balance,
      closingBalance: s.closing_balance,
      contributions: s.contributions,
      withdrawals: s.withdrawals,
      gainLoss: s.gain_loss,
      returnPercent: s.return_percent,
    })),
  };
}
