"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, EyeOff, User as UserIcon } from "lucide-react";
import type { UserResponse } from "@/contexts/auth-context";

const API_BASE_URL = "https://code.haru2end.dedyn.io/api";

type Tab = "profile" | "settings";

interface ProfileSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  user: UserResponse | null;
  initialTab: Tab;
  refreshUser: () => Promise<void>;
  setAlertInfo: (info: { isOpen: boolean; title: string; description: string }) => void;
}

export function ProfileSettingsDialog({
  open,
  onClose,
  isDarkMode,
  user,
  initialTab,
  refreshUser,
  setAlertInfo,
}: ProfileSettingsDialogProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState<Tab>(initialTab);

  const [nickname, setNickname] = React.useState("");
  const [profileFile, setProfileFile] = React.useState<File | null>(null);
  const [profilePreview, setProfilePreview] = React.useState<string | null>(null);
  const [profileSubmitting, setProfileSubmitting] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPw, setShowCurrentPw] = React.useState(false);
  const [showNewPw, setShowNewPw] = React.useState(false);
  const [showConfirmPw, setShowConfirmPw] = React.useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = React.useState(false);

  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const pwValid = /^(?=.*[a-zA-Z])(?=.*\W).{8,16}$/.test(newPassword);
  const nicknameValid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const passwordMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  const tx = React.useCallback((key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  }, [t]);

  React.useEffect(() => {
    if (!open) return;
    setActiveTab(initialTab);
  }, [initialTab, open]);

  React.useEffect(() => {
    if (!user || !open) return;
    setNickname(user.name || "");
    setProfilePreview(user.profileImageUrl || null);
    setProfileFile(null);
  }, [user, open]);

  React.useEffect(() => {
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPw(false);
      setShowNewPw(false);
      setShowConfirmPw(false);
    }
  }, [open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    const reader = new FileReader();
    reader.onload = () => setProfilePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setProfileFile(null);
    setProfilePreview(user?.profileImageUrl || null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    if (!nicknameValid) {
      setAlertInfo({
        isOpen: true,
        title: tx("validation_error", "유효성 검사 오류"),
        description: tx("nickname_invalid", "닉네임 길이를 확인해 주세요."),
      });
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setAlertInfo({
        isOpen: true,
        title: tx("auth_error", "인증 오류"),
        description: tx("login_required", "로그인이 필요합니다."),
      });
      return;
    }

    setProfileSubmitting(true);
    try {
      let imageUrl = user.profileImageUrl || null;
      if (profileFile) {
        const formData = new FormData();
        formData.append("images", profileFile);
        const uploadResponse = await fetch(`${API_BASE_URL}/image/sign/user`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          setAlertInfo({
            isOpen: true,
            title: tx("image_upload_failed", "이미지 업로드 실패"),
            description: errorData.message || tx("image_upload_error", "이미지 업로드 중 오류가 발생했습니다."),
          });
          return;
        }
        const imageData = await uploadResponse.json();
        imageUrl = imageData.url || imageUrl;
      }

      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickName: nickname.trim(),
          imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setAlertInfo({
          isOpen: true,
          title: tx("save_failed", "저장 실패"),
          description: errorData.message || tx("profile_update_failed", "프로필 저장에 실패했습니다."),
        });
        return;
      }

      await refreshUser();
      setAlertInfo({
        isOpen: true,
        title: tx("saved", "저장되었습니다!"),
        description: tx("profile_update_success", "프로필이 업데이트되었습니다."),
      });
      onClose();
    } catch {
      setAlertInfo({
        isOpen: true,
        title: tx("network_error", "네트워크 오류"),
        description: tx("profile_update_network_error", "프로필 저장 중 네트워크 오류가 발생했습니다."),
      });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      setAlertInfo({
        isOpen: true,
        title: tx("validation_error", "유효성 검사 오류"),
        description: tx("current_password_required", "현재 비밀번호를 입력해주세요."),
      });
      return;
    }
    if (!pwValid || !passwordMatch) {
      setAlertInfo({
        isOpen: true,
        title: tx("validation_error", "유효성 검사 오류"),
        description: tx("password_invalid", "비밀번호 형식 또는 확인 값을 확인해 주세요."),
      });
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setAlertInfo({
        isOpen: true,
        title: tx("auth_error", "인증 오류"),
        description: tx("login_required", "로그인이 필요합니다."),
      });
      return;
    }

    setPasswordSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          newPasswordValid: confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setAlertInfo({
          isOpen: true,
          title: tx("save_failed", "저장 실패"),
          description: errorData.message || tx("password_change_failed", "비밀번호 변경에 실패했습니다."),
        });
        return;
      }

      setAlertInfo({
        isOpen: true,
        title: tx("saved", "저장되었습니다!"),
        description: tx("password_change_success", "비밀번호가 변경되었습니다."),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch {
      setAlertInfo({
        isOpen: true,
        title: tx("network_error", "네트워크 오류"),
        description: tx("password_change_network_error", "비밀번호 변경 중 네트워크 오류가 발생했습니다."),
      });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const surface = isDarkMode ? "bg-slate-900/90 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900";
  const inputClass = isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-300";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[520px] border ${surface}`}>
        <DialogHeader>
          <DialogTitle>{activeTab === "profile" ? tx("profile", "프로필") : tx("settings", "설정")}</DialogTitle>
          <DialogDescription className={muted}>
            {activeTab === "profile"
              ? tx("profile_help", "프로필 정보를 관리하세요.")
              : tx("settings_help", "계정 보안 설정을 관리하세요.")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Button type="button" variant={activeTab === "profile" ? "default" : "outline"} onClick={() => setActiveTab("profile")}>
            {tx("profile", "프로필")}
          </Button>
          <Button type="button" variant={activeTab === "settings" ? "default" : "outline"} onClick={() => setActiveTab("settings")}>
            {tx("settings", "설정")}
          </Button>
        </div>

        {activeTab === "profile" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profilePreview || user?.profileImageUrl || "/user.png"} alt={user?.name || "user"} />
                <AvatarFallback><UserIcon className="w-5 h-5" /></AvatarFallback>
              </Avatar>
              <div className="space-x-2">
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()}>
                  {tx("upload_profile", "프로필 사진 업로드")}
                </Button>
                <Button type="button" variant="ghost" onClick={clearImage}>
                  {tx("reset", "초기화")}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{tx("nickname", "닉네임")}</Label>
              <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className={inputClass} />
              <p className={`text-xs ${nicknameValid ? muted : "text-rose-500"}`}>
                {tx("nickname_hint", "2자 이상 10자 이하로 입력해주세요.")}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{tx("email", "이메일")}</Label>
              <Input value={user?.email || ""} readOnly disabled className={`${inputClass} opacity-70 cursor-not-allowed`} />
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={handleUpdateProfile} disabled={profileSubmitting}>
                {profileSubmitting ? tx("saving", "저장 중...") : tx("submit", "저장")}
              </Button>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{tx("current_password", "현재 비밀번호")}</Label>
              <div className="relative">
                <Input
                  type={showCurrentPw ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
                />
                <button type="button" onClick={() => setShowCurrentPw((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2">
                  {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{tx("new_password", "새 비밀번호")}</Label>
              <div className="relative">
                <Input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
                />
                <button type="button" onClick={() => setShowNewPw((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2">
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className={`text-xs ${pwValid ? muted : "text-rose-500"}`}>
                {tx("password_hint", "8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.")}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{tx("confirm_password", "비밀번호 확인")}</Label>
              <div className="relative">
                <Input
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
                />
                <button type="button" onClick={() => setShowConfirmPw((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2">
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className={`text-xs ${passwordMatch ? muted : "text-rose-500"}`}>
                {tx("confirm_password_hint", "비밀번호가 일치해야 합니다.")}
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={handleChangePassword} disabled={passwordSubmitting}>
                {passwordSubmitting ? tx("saving", "저장 중...") : tx("submit", "저장")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
