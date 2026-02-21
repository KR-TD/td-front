'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatInTimeZone } from 'date-fns-tz';
import { ko, enUS, ja, zhCN, Locale } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Moon, Star, Heart, Save, Camera } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { authFetch } from "@/lib/auth-fetch";

interface WriteViewProps {
  isDarkMode: boolean;
  setAlertInfo: (info: { isOpen: boolean; title: string; description: string; }) => void;
  fetchDiaries: () => void;
  setZoomedImage: (image: string | null) => void;
}

export function WriteView({ isDarkMode, setAlertInfo, fetchDiaries, setZoomedImage }: WriteViewProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryContent, setDiaryContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const draftStorageKey = useMemo(() => `diaryDraft:${user?.id ?? "guest"}`, [user?.id]);

  const emotionMap: { [key: string]: string } = {
    "😊": t("emotion_joy"), "😢": t("emotion_sadness"), "😡": t("emotion_anger"),
    "😴": t("emotion_tiredness"), "🥰": t("emotion_love"), "🤔": t("emotion_worry"),
    "🫥": t("emotion_etc"),
  };

  const emojiToMoodEnumMap: { [key: string]: string } = {
    "😊": "JOY", "😢": "SAD", "😡": "ANGER", "😴": "TIRED",
    "🥰": "LOVE", "🤔": "WORRY", "🫥": "ETC",
  };

  const getCurrentDate = () => {
    const today = new Date();
    const locales: { [key: string]: Locale } = { ko, en: enUS, ja, zh: zhCN };
    const currentLocale = locales[i18n.language] || ko;
    let formatString = 'yyyy년 M월 d일 EEEE';
    let timeZone = 'Asia/Seoul';
    switch (i18n.language) {
      case 'en': formatString = 'EEEE, MMMM d, yyyy'; timeZone = 'America/New_York'; break;
      case 'ja': formatString = 'yyyy年M月d日 EEEE'; timeZone = 'Asia/Tokyo'; break;
      case 'zh': formatString = 'yyyy年M月d日 EEEE'; timeZone = 'Asia/Shanghai'; break;
      default: formatString = 'yyyy년 M월 d일 EEEE'; timeZone = 'Asia/Seoul';
    }
    return formatInTimeZone(today, timeZone, formatString, { locale: currentLocale });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
      setSelectedImageFile(file);
    } else {
      setSelectedImage(undefined);
      setSelectedImageFile(null);
    }
  };

  const handleSave = async () => {
    if (!selectedMood) {
      setAlertInfo({ isOpen: true, title: t("validation_error"), description: t("select_emotion_alert") });
      return;
    }
    if (diaryTitle.trim() === "") {
      setAlertInfo({ isOpen: true, title: t("validation_error"), description: t("enter_title_alert") });
      return;
    }
    if (diaryContent.trim() === "") {
      setAlertInfo({ isOpen: true, title: t("validation_error"), description: t("enter_content_alert") });
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setAlertInfo({ isOpen: true, title: t("auth_error", "인증 오류"), description: t("login_required", "로그인이 필요합니다.") });
      return;
    }

    try {
      let imageUrl: string | null = null;
      if (selectedImageFile) {
        const formData = new FormData();
        formData.append("images", selectedImageFile);

        const imageResponse = await authFetch('https://code.haru2end.dedyn.io/api/image/diary/upload', {
          method: 'POST',
          body: formData,
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          imageUrl = imageData.url;
        } else {
          const errorData = await imageResponse.json();
          setAlertInfo({ isOpen: true, title: t("image_upload_failed", "이미지 업로드 실패"), description: errorData.message || t("image_upload_error", "이미지 업로드 중 오류가 발생했습니다.") });
          return;
        }
      }

      const diaryRequest = {
        title: diaryTitle,
        content: diaryContent,
        imageUrl: imageUrl,
        mood: selectedMood ? emojiToMoodEnumMap[selectedMood] : undefined,
      };

      const response = await authFetch('https://code.haru2end.dedyn.io/api/diary/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diaryRequest),
      });

      if (response.status === 201) {
        setAlertInfo({ isOpen: true, title: t("save_success", "일기 저장 성공"), description: t("diary_saved_successfully", "일기가 성공적으로 저장되었습니다.") });
        localStorage.removeItem(draftStorageKey);
        fetchDiaries();
        setDiaryTitle("");
        setDiaryContent("");
        setSelectedMood(undefined);
        setSelectedImage(undefined);
        setSelectedImageFile(null);
        if (imageInputRef.current) imageInputRef.current.value = "";
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        const errorData = await response.json();
        setAlertInfo({ isOpen: true, title: t("save_failed", "일기 저장 실패"), description: errorData.message || t("diary_save_error", "일기 저장 중 오류가 발생했습니다.") });
      }
    } catch (error) {
      setAlertInfo({ isOpen: true, title: t("network_error", "네트워크 오류"), description: t("save_network_error", "일기 저장 중 네트워크 오류가 발생했습니다.") });
    }
  };

  useEffect(() => {
    const rawDraft = localStorage.getItem(draftStorageKey);
    if (!rawDraft) return;

    try {
      const draft = JSON.parse(rawDraft) as {
        title?: string;
        content?: string;
        mood?: string;
      };

      const restoredTitle = draft.title ?? "";
      const restoredContent = draft.content ?? "";
      const restoredMood = draft.mood;
      const hasDraft = restoredTitle.trim() || restoredContent.trim() || restoredMood;

      if (!hasDraft) return;

      setDiaryTitle(restoredTitle);
      setDiaryContent(restoredContent);
      setSelectedMood(restoredMood);
      setAlertInfo({
        isOpen: true,
        title: t("draft_restored", "임시저장 불러오기"),
        description: t("draft_restored_description", "작성 중이던 일기를 불러왔어요."),
      });
    } catch {
      localStorage.removeItem(draftStorageKey);
    }
  }, [draftStorageKey, setAlertInfo, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasDraft = diaryTitle.trim() || diaryContent.trim() || selectedMood;
      if (!hasDraft) {
        localStorage.removeItem(draftStorageKey);
        return;
      }

      const draft = {
        title: diaryTitle,
        content: diaryContent,
        mood: selectedMood,
      };
      localStorage.setItem(draftStorageKey, JSON.stringify(draft));
    }, 700);

    return () => clearTimeout(timer);
  }, [diaryTitle, diaryContent, selectedMood, draftStorageKey]);

  return (
    <Card className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${isDarkMode ? "bg-slate-900/80 shadow-purple-500/30 border border-slate-700/50" : "bg-white/90 border border-rose-200/50 shadow-rose-200/30"}`}>
      <CardHeader className="text-center pb-4 sm:pb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Moon className={`w-5 h-5 ${isDarkMode ? "text-yellow-400" : "text-amber-500"}`} />
          <span className={`text-lg sm:text-xl font-semibold ${isDarkMode ? "text-gray-200" : "text-rose-800"}`}>{getCurrentDate()}</span>
          <Star className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-rose-500"}`} />
        </div>
        <p className={`italic text-sm sm:text-base ${isDarkMode ? "text-gray-400" : "text-rose-600"}`}>
          {isDarkMode ? t("footer_message_dark") : t("footer_message_light")}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className={`text-base sm:text-lg font-medium flex items-center gap-2 ${isDarkMode ? "text-gray-200" : "text-rose-800"}`}>
              <Heart className={`w-5 h-5 ${isDarkMode ? "text-pink-400" : "text-rose-500"}`} />
              {t("today_mood")}
              {selectedMood && (<span className={`ml-2 text-sm font-normal ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>({emotionMap[selectedMood]})</span>)}
            </label>
            <div className="flex flex-col items-end">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={imageInputRef} />
              <Button onClick={() => imageInputRef.current?.click()} variant="outline" size="sm"
                className={`px-3 py-1 rounded-full text-xs ${selectedImage ?
                  (isDarkMode ? "border-green-500/30 text-green-300 hover:bg-green-900/20" : "border-green-200 bg-green-100 text-green-700 hover:bg-green-200") :
                  (isDarkMode ? "border-purple-500/30 text-purple-300 hover:bg-purple-900/20" : "border-rose-200 bg-rose-100 text-rose-700 hover:bg-rose-200")}`}>
                <Camera className="w-3 h-3 mr-1" />
                {selectedImage ? t("change_photo") : t("add_photo")}
              </Button>
              {selectedImage && (
                <div className="relative mt-2">
                  <img src={selectedImage} alt="Selected" className="w-16 h-16 object-cover rounded-md border border-gray-400/50 cursor-pointer"
                    onClick={() => setZoomedImage(selectedImage)} />
                  <button onClick={() => { setSelectedImage(undefined); setSelectedImageFile(null); if(imageInputRef.current) imageInputRef.current.value = ""; }}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">✕</button>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["😊", "😢", "😡", "😴", "🥰", "🤔", "🫥"].map((emoji) => (
              <Button key={emoji} onClick={() => setSelectedMood(emoji)}
                className={`text-2xl p-2 rounded-full transition-all duration-200 ${selectedMood === emoji ?
                  (isDarkMode ? "bg-purple-600/50 border border-purple-400" : "bg-rose-300/50 border border-rose-400") :
                  (isDarkMode ? "bg-slate-700/50 hover:bg-slate-600/50" : "bg-gray-100/50 hover:bg-gray-200/50")}`} variant="ghost">
                {emoji}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className={`text-base sm:text-lg font-medium flex items-center gap-2 ${isDarkMode ? "text-gray-200" : "text-rose-800"}`}>
            <Heart className={`w-5 h-5 ${isDarkMode ? "text-pink-400" : "text-rose-500"}`} />
            {t("today_story")}
          </label>
          <Input placeholder={t("diary_title_placeholder")} value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)}
            className={`mb-4 text-base leading-relaxed resize-none border-2 rounded-xl p-3 sm:p-4 backdrop-blur-sm transition-all duration-300 ${isDarkMode ? "border-purple-500/30 focus:border-purple-400 bg-slate-700/50 text-gray-200 placeholder:text-gray-400" : "border-rose-200 focus:border-rose-400 bg-white/70 text-rose-900 placeholder:text-rose-500"}`} />
          <Textarea placeholder={isDarkMode ? t("diary_content_placeholder_dark") : t("diary_content_placeholder_light")}
            value={diaryContent} onChange={(e) => setDiaryContent(e.target.value)}
            className={`min-h-[250px] sm:min-h-[300px] text-base leading-relaxed resize-none border-2 rounded-xl p-3 sm:p-4 backdrop-blur-sm transition-all duration-300 ${isDarkMode ? "border-purple-500/30 focus:border-purple-400 bg-slate-700/50 text-gray-200 placeholder:text-gray-400" : "border-rose-200 focus:border-rose-400 bg-white/70 text-rose-900 placeholder:text-rose-500"}`} />
        </div>

        <div className={`text-right text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-rose-600"}`}>{diaryContent.length}{t("characters")}</div>
        <div className="flex justify-center pt-2 sm:pt-4">
          <Button onClick={handleSave}
            className={`px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-full transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-105 ${isSaved ? "bg-green-500 hover:bg-green-600" : (isDarkMode ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600")}`}>
            <Save className="w-5 h-5 mr-2" />
            {isSaved ? t("saved") : t("save_diary")}
          </Button>
        </div>
        <div className={`text-center pt-4 sm:pt-6 border-t ${isDarkMode ? "border-purple-500/30" : "border-rose-200"}`}>
          <p className={`text-xs sm:text-sm italic ${isDarkMode ? "text-gray-400" : "text-rose-600"}`}>
            {isDarkMode ? t("footer_message_dark") : t("footer_message_light")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
