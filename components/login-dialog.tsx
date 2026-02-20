import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff } from "lucide-react"

interface LoginDialogProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode: boolean
}

export function LoginDialog({
  isOpen,
  onClose,
  isDarkMode,
}: LoginDialogProps) {
  const API_BASE_URL = "https://code.haru2end.dedyn.io/api"
  const { t } = useTranslation()
  const { login } = useAuth()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPw, setShowPw] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [apiError, setApiError] = React.useState<string | null>(null)

  const [showForgotDialog, setShowForgotDialog] = React.useState(false)
  const [resetEmail, setResetEmail] = React.useState("")
  const [resetCode, setResetCode] = React.useState("")
  const [resetPassword, setResetPassword] = React.useState("")
  const [resetPasswordConfirm, setResetPasswordConfirm] = React.useState("")
  const [showResetPw, setShowResetPw] = React.useState(false)
  const [showResetPw2, setShowResetPw2] = React.useState(false)
  const [isSendingCode, setIsSendingCode] = React.useState(false)
  const [isResetting, setIsResetting] = React.useState(false)
  const [resetError, setResetError] = React.useState<string | null>(null)
  const [isCodeSent, setIsCodeSent] = React.useState(false)

  const tx = React.useCallback(
    (key: string, defaultValue?: string) => {
      const v = t(key)
      return v === key ? defaultValue || key : v
    },
    [t]
  )

  const resetEmailValid = React.useMemo(() => /\S+@\S+\.\S+/.test(resetEmail), [resetEmail])
  const resetPwValid = React.useMemo(() => /^(?=.*[a-zA-Z])(?=.*\W).{8,16}$/.test(resetPassword), [resetPassword])
  const resetPwMatch = resetPasswordConfirm.length > 0 && resetPassword === resetPasswordConfirm

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSubmitting(true)
    setApiError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        login(data.atk, data.rtk)
        alert("로그인에 성공했습니다!")
        onClose()
      } else {
        const errorData = await response.json()
        setApiError(errorData.message || "이메일 또는 비밀번호를 확인해주세요.")
      }
    } catch (error) {
      setApiError("로그인 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "kakao") => {
    try {
      const nextUrl = window.location.origin + "/auth/callback"
      const response = await fetch(`${API_BASE_URL}/user/${provider}?next=${encodeURIComponent(nextUrl)}`)
      if (response.ok) {
        const redirectUrl = await response.text()
        window.location.href = redirectUrl
      } else {
        setApiError(`소셜 로그인에 실패했습니다. (${provider})`)
      }
    } catch (error) {
      setApiError("소셜 로그인 중 오류가 발생했습니다.")
    }
  }

  const handleSendResetCode = async () => {
    if (!resetEmailValid) {
      setResetError(tx("email_invalid", "올바른 이메일 형식이 아닙니다."))
      return
    }
    setResetError(null)
    setIsSendingCode(true)
    try {
      const response = await fetch(`${API_BASE_URL}/user/password/reset/code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      })
      if (response.status === 201 || response.ok) {
        setIsCodeSent(true)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setResetError(errorData.message || tx("send_code_failed", "인증코드 전송에 실패했습니다."))
      }
    } catch {
      setResetError(tx("network_error", "네트워크 오류가 발생했습니다."))
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleResetPassword = async () => {
    if (!resetEmailValid) {
      setResetError(tx("email_invalid", "올바른 이메일 형식이 아닙니다."))
      return
    }
    if (!resetCode.trim()) {
      setResetError(tx("verify_code_failed", "인증코드를 입력해 주세요."))
      return
    }
    if (!resetPwValid || !resetPwMatch) {
      setResetError(tx("password_invalid", "비밀번호 형식 또는 확인 값을 확인해 주세요."))
      return
    }

    setResetError(null)
    setIsResetting(true)
    try {
      const verifyResponse = await fetch(`${API_BASE_URL}/user/password/reset/code/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, code: resetCode }),
      })

      if (!verifyResponse.ok) {
        const verifyError = await verifyResponse.json().catch(() => ({}))
        setResetError(verifyError.message || tx("verify_code_failed", "인증코드가 일치하지 않습니다."))
        return
      }

      const verifySuccess = await verifyResponse.json()
      if (!verifySuccess) {
        setResetError(tx("verify_code_failed", "인증코드가 일치하지 않습니다."))
        return
      }

      const resetResponse = await fetch(`${API_BASE_URL}/user/password/reset`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          code: resetCode,
          password: resetPassword,
          passwordValid: resetPasswordConfirm,
        }),
      })

      if (!resetResponse.ok) {
        const resetErrorData = await resetResponse.json().catch(() => ({}))
        setResetError(resetErrorData.message || tx("password_reset_failed", "비밀번호 재설정에 실패했습니다."))
        return
      }

      setShowForgotDialog(false)
      setResetEmail("")
      setResetCode("")
      setResetPassword("")
      setResetPasswordConfirm("")
      setShowResetPw(false)
      setShowResetPw2(false)
      setIsCodeSent(false)
      alert(tx("password_change_success", "비밀번호가 변경되었습니다."))
    } catch {
      setResetError(tx("network_error", "네트워크 오류가 발생했습니다."))
    } finally {
      setIsResetting(false)
    }
  }

  const surface = isDarkMode
    ? "bg-slate-900/80 text-gray-100 border border-slate-700 backdrop-blur-xl"
    : "bg-white/80 text-gray-900 border border-gray-200 backdrop-blur-xl"

  const inputStyle = isDarkMode
    ? "bg-slate-800 text-gray-100 border-slate-600 focus:ring-2 focus:ring-blue-500"
    : "bg-gray-50 text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-400"

  const buttonStyle = isDarkMode
    ? "bg-blue-600 hover:bg-blue-500 text-white"
    : "bg-blue-500 hover:bg-blue-600 text-white"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[420px] rounded-2xl shadow-xl p-0 overflow-hidden ${surface} z-[100]`}
      >
        <DialogHeader className="text-center space-y-1 px-6 pt-8 pb-6">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {tx("login", "로그인")}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-70">
            {tx("login_description", "계정에 로그인하여 계속하세요.")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {tx("email", "이메일")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={tx("email_placeholder", "example@gmail.com")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyle}
              required
              autoComplete="username"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                {tx("password", "비밀번호")}
              </Label>
              <button
                type="button"
                className={`text-xs underline underline-offset-2 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                onClick={() => {
                  setResetError(null)
                  setShowForgotDialog(true)
                }}
              >
                {tx("forgot_password", "비밀번호 찾기")}
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputStyle} pr-10`}
                required
                autoComplete="current-password"
              />
              {password.length > 0 && (
                <button
                  type="button"
                  aria-label={showPw ? tx("hide_password", "비밀번호 숨기기") : tx("show_password", "비밀번호 보기")}
                  onClick={() => setShowPw((v) => !v)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md ${isDarkMode ? "hover:bg-slate-700/60" : "hover:bg-slate-200/70"}`}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {apiError && (
            <p className="text-sm text-center text-rose-500 pt-2">{apiError}</p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className={`w-full h-11 rounded-lg font-semibold transition-all ${buttonStyle}`}
          >
            {submitting ? tx("logging_in", "로그인 중...") : tx("login", "로그인")}
          </Button>
        </form>

        <div className="px-6 pb-6 space-y-4">
          <div className="relative text-center">
            <div className={`h-px ${isDarkMode ? "bg-white/10" : "bg-slate-200"}`} />
            <span className={`px-3 text-xs absolute -translate-x-1/2 left-1/2 -top-2 ${isDarkMode ? "bg-slate-900/70 text-slate-300" : "bg-white/70 text-slate-500"}`}>
              {tx("or", "또는")}
            </span>
          </div>

          <div className="grid gap-2">
            <button
              type="button"
              className={`w-full h-11 rounded-xl border flex items-center justify-center gap-2 transition hover:shadow-sm ${isDarkMode ? "bg-white text-gray-900 border-white/60" : "bg-white text-gray-900 border-slate-300"}`}
              onClick={() => handleSocialLogin("google")}
            >
              <img src="/icons/google.png" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-medium">{tx("continue_with_google", "Google로 계속하기")}</span>
            </button>
            <button
              type="button"
              className="w-full h-11 rounded-xl border border-[#E9D502] bg-[#FEE500] text-black flex items-center justify-center gap-2 hover:brightness-95 transition"
              onClick={() => handleSocialLogin("kakao")}
            >
              <img src="/icons/kakao.png" alt="Kakao" className="w-5 h-5" />
              <span className="text-sm font-medium">{tx("continue_with_kakao", "카카오로 계속하기")}</span>
            </button>
          </div>
        </div>
      </DialogContent>

      <Dialog open={showForgotDialog} onOpenChange={setShowForgotDialog}>
        <DialogContent className={`sm:max-w-[420px] rounded-2xl shadow-xl p-0 overflow-hidden ${surface} z-[110]`}>
          <DialogHeader className="text-center space-y-1 px-6 pt-8 pb-6">
            <DialogTitle className="text-xl font-bold tracking-tight">
              {tx("forgot_password", "비밀번호 찾기")}
            </DialogTitle>
            <DialogDescription className="text-sm opacity-70">
              {tx("forgot_password_description", "이메일 인증 후 새 비밀번호를 설정하세요.")}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">{tx("email", "이메일")}</Label>
              <Input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder={tx("email_placeholder", "example@gmail.com")}
                className={inputStyle}
              />
              <Button type="button" variant="outline" onClick={handleSendResetCode} disabled={isSendingCode || !resetEmailValid}>
                {isSendingCode ? tx("sending_code", "코드 전송 중...") : tx("send_code", "인증코드 보내기")}
              </Button>
              {isCodeSent && <p className="text-xs text-emerald-500">{tx("verification_code_sent_message", "인증코드가 전송되었습니다.")}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-code">{tx("verification_code", "인증코드")}</Label>
              <Input
                id="reset-code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder={tx("verification_code_placeholder", "인증코드를 입력하세요")}
                className={inputStyle}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-password">{tx("new_password", "새 비밀번호")}</Label>
              <div className="relative">
                <Input
                  id="reset-password"
                  type={showResetPw ? "text" : "password"}
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  className={`${inputStyle} pr-10`}
                />
                <button type="button" onClick={() => setShowResetPw((v) => !v)} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md ${isDarkMode ? "hover:bg-slate-700/60" : "hover:bg-slate-200/70"}`}>
                  {showResetPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-password-confirm">{tx("confirm_password", "비밀번호 확인")}</Label>
              <div className="relative">
                <Input
                  id="reset-password-confirm"
                  type={showResetPw2 ? "text" : "password"}
                  value={resetPasswordConfirm}
                  onChange={(e) => setResetPasswordConfirm(e.target.value)}
                  className={`${inputStyle} pr-10`}
                />
                <button type="button" onClick={() => setShowResetPw2((v) => !v)} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md ${isDarkMode ? "hover:bg-slate-700/60" : "hover:bg-slate-200/70"}`}>
                  {showResetPw2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className={`text-xs ${resetPwValid && resetPwMatch ? (isDarkMode ? "text-slate-400" : "text-slate-500") : "text-rose-500"}`}>
                {tx("password_hint", "8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.")}
              </p>
            </div>

            {resetError && <p className="text-sm text-center text-rose-500">{resetError}</p>}

            <Button
              type="button"
              className={`w-full h-11 rounded-lg font-semibold transition-all ${buttonStyle}`}
              onClick={handleResetPassword}
              disabled={isResetting}
            >
              {isResetting ? tx("saving", "저장 중...") : tx("reset_password", "비밀번호 재설정")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
