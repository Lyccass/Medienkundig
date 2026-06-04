import React from "react";
import {
  ShieldAlert, Newspaper, Smartphone, Lock, HelpCircle,
  ImageIcon, Volume2, Shuffle, PenLine,
  Mail, MessageSquare, Globe, Share2,
  Route, ShoppingCart, UserPlus, Plane,
} from "lucide-react";
import type { ScenarioType } from "../data/courses";
import type { FallAdventure, FallTopic } from "../data/faelle";

// ── Category icons ───────────────────────────────────────────────────────────
// size=22 for headers (CategoryPage hero, ProfilePage)
export const CATEGORY_ICONS_LG: Record<string, React.ReactNode> = {
  grundlagen:  <Lock        size={22} strokeWidth={2} />,
  scamming:    <ShieldAlert size={22} strokeWidth={2} />,
  news:        <Newspaper   size={22} strokeWidth={2} />,
  socialmedia: <Smartphone  size={22} strokeWidth={2} />,
  general:     <Lock        size={22} strokeWidth={2} />,
};

// size=20 for list items (ProfilePage category list)
export const CATEGORY_ICONS_MD: Record<string, React.ReactNode> = {
  grundlagen:  <Lock        size={20} strokeWidth={2} />,
  scamming:    <ShieldAlert size={20} strokeWidth={2} />,
  news:        <Newspaper   size={20} strokeWidth={2} />,
  socialmedia: <Smartphone  size={20} strokeWidth={2} />,
  general:     <Lock        size={20} strokeWidth={2} />,
};

// size=14 for topic badges (FaellePage)
export const CATEGORY_ICONS_SM: Record<string, React.ReactNode> = {
  grundlagen:  <Lock        size={14} strokeWidth={2} />,
  scamming:    <ShieldAlert size={14} strokeWidth={2} />,
  news:        <Newspaper   size={14} strokeWidth={2} />,
  socialmedia: <Smartphone  size={14} strokeWidth={2} />,
  general:     <Lock        size={14} strokeWidth={2} />,
};

// ── Exercise type icons (CategoryPage path nodes) ────────────────────────────
export const TYPE_ICONS: Record<string, React.ReactNode> = {
  multipleChoice:    <HelpCircle  size={16} strokeWidth={2} />,
  bildAuswahl:       <ImageIcon   size={16} strokeWidth={2} />,
  audioAuswahl:      <Volume2     size={16} strokeWidth={2} />,
  memory:            <Shuffle     size={16} strokeWidth={2} />,
  vervollstaendigen: <PenLine     size={16} strokeWidth={2} />,
  fall:              <ShieldAlert size={16} strokeWidth={2} />,
};

// ── Exercise type labels (RepeatPage) ────────────────────────────────────────
export const TYPE_LABELS: Record<string, string> = {
  multipleChoice:    "Multiple Choice",
  bildAuswahl:       "Bild-Auswahl",
  audioAuswahl:      "Audio",
  memory:            "Memory",
  vervollstaendigen: "Lückentext",
  fall:              "Fall",
};

// ── Fall scenario icons + labels (FallExercise) ──────────────────────────────
export const SCENARIO_ICONS: Record<ScenarioType, React.ReactNode> = {
  email:  <Mail          size={13} strokeWidth={2} />,
  sms:    <MessageSquare size={13} strokeWidth={2} />,
  chat:   <MessageSquare size={13} strokeWidth={2} />,
  web:    <Globe         size={13} strokeWidth={2} />,
  social: <Share2        size={13} strokeWidth={2} />,
};

export const SCENARIO_LABELS: Record<ScenarioType, string> = {
  email:  "E-Mail",
  sms:    "SMS",
  chat:   "Chat",
  web:    "Website",
  social: "Social Media",
};

// ── Fall topic icons (FaellePage) ─────────────────────────────────────────────
export const TOPIC_ICONS: Record<FallTopic, React.ReactNode> = {
  scamming:    <ShieldAlert size={14} strokeWidth={2} />,
  news:        <Newspaper   size={14} strokeWidth={2} />,
  socialmedia: <Smartphone  size={14} strokeWidth={2} />,
  general:     <Lock        size={14} strokeWidth={2} />,
};

// ── Fall theme icons (FaellePage) ─────────────────────────────────────────────
export const THEME_ICONS: Record<FallAdventure["theme"], React.ReactNode> = {
  "Alltag":          <Route        size={18} strokeWidth={2} />,
  "Online-Shopping": <ShoppingCart size={18} strokeWidth={2} />,
  "Konto":           <UserPlus     size={18} strokeWidth={2} />,
  "Reise":           <Plane        size={18} strokeWidth={2} />,
};
