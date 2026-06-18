"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillHome, AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { RxBookmark, RxBookmarkFilled } from "react-icons/rx";
import { RiBallPenLine } from "react-icons/ri";
import { BsGear, BsFillGearFill } from "react-icons/bs";
import { BsQuestionCircle } from "react-icons/bs";
import { LuLogOut } from "react-icons/lu";
import { RiFontSize } from "react-icons/ri";
import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "./AuthModal";

const FONT_SIZES = [20, 24, 28, 32];

export default function Sidebar({
  isOpen = false,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const isPlayerPage = pathname.startsWith("/player");
  const [isActiveFont, setIsActiveFont] = useState(0);
  const user = useAppSelector((state) => state.auth.user);
  const authLoading = useAppSelector((state) => state.auth.isLoading);
  const router = useRouter();
  const supabase = createClient();
  const [modalActive, setModalActive] = useState(false);

  async function handleLogout() {
    onClose?.();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      <div className={`sidebar ${isOpen ? "sidebar--opened" : ""}`}>
        <Link href="/for-you" onClick={onClose}>
          <figure className="sidebar__logo">
            <img className="sidebar__logo__img" src="/logo.png" alt="logo" />
          </figure>
        </Link>
        <div className="sidebar__wrapper">
          <div className="sidebar__top">
            <Link
              href="/for-you"
              className="sidebar__link--wrapper"
              onClick={onClose}
            >
              <div
                className={`sidebar__link--line ${isActive("/for-you") ? "active--tab" : ""}`}
              />
              <div className="sidebar__icon--wrapper">
                {isActive("/for-you") ? (
                  <AiFillHome style={{ width: "24px", height: "24px" }} />
                ) : (
                  <AiOutlineHome style={{ width: "24px", height: "24px" }} />
                )}
              </div>
              <div className="sidebar__link--text">For you</div>
            </Link>
            <Link
              href="/library"
              className="sidebar__link--wrapper"
              onClick={onClose}
            >
              <div
                className={`sidebar__link--line ${isActive("/library") ? "active--tab" : ""}`}
              />
              <div className="sidebar__icon--wrapper sidebar__icon--wrapper--scaled">
                {isActive("/library") ? (
                  <RxBookmarkFilled style={{ width: "24px", height: "24px" }} />
                ) : (
                  <RxBookmark style={{ width: "24px", height: "24px" }} />
                )}
              </div>
              <div className="sidebar__link--text">My Library</div>
            </Link>
            <div className="sidebar__link--wrapper sidebar__link--not-allowed">
              <div className="sidebar__link--line" />
              <div className="sidebar__icon--wrapper">
                <RiBallPenLine style={{ width: "24px", height: "24px" }} />
              </div>
              <div className="sidebar__link--text">Highlights</div>
            </div>
            <div className="sidebar__link--wrapper sidebar__link--not-allowed">
              <div className="sidebar__link--line" />
              <div className="sidebar__icon--wrapper">
                <AiOutlineSearch style={{ width: "24px", height: "24px" }} />
              </div>
              <div className="sidebar__link--text">Search</div>
            </div>
            {isPlayerPage && (
              <div className="sidebar__link--wrapper sidebar__font--size-wrapper">
                {FONT_SIZES.map((size, index) => {
                  const isActiveFontSize = isActiveFont === index;

                  return (
                    <div
                      key={size}
                      className={`sidebar__font--size-icon ${
                        isActiveFontSize
                          ? "sidebar__font--size-icon--active"
                          : ""
                      }`}
                      onClick={() => setIsActiveFont(index)}
                    >
                      <RiFontSize style={{ width: size, height: size }} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="sidebar__bottom">
            <Link
              href="/settings"
              className="sidebar__link--wrapper"
              onClick={onClose}
            >
              <div
                className={`sidebar__link--line ${isActive("/settings") ? "active--tab" : ""}`}
              />
              <div className="sidebar__icon--wrapper">
                {isActive("/settings") ? (
                  <BsFillGearFill style={{ width: "24px", height: "24px" }} />
                ) : (
                  <BsGear style={{ width: "24px", height: "24px" }} />
                )}
              </div>
              <div className="sidebar__link--text">Settings</div>
            </Link>
            <div className="sidebar__link--wrapper sidebar__link--not-allowed">
              <div className="sidebar__link--line" />
              <div className="sidebar__icon--wrapper">
                <BsQuestionCircle style={{ width: "22px", height: "22px" }} />
              </div>
              <div className="sidebar__link--text">Help & Support</div>
            </div>
            {user ? (
              <div onClick={handleLogout} className="sidebar__link--wrapper">
                <div className="sidebar__link--line" />
                <div className="sidebar__icon--wrapper">
                  <LuLogOut style={{ width: "24px", height: "24px" }} />
                </div>
                <div className="sidebar__link--text">Logout</div>
              </div>
            ) : (
              <div
                onClick={() => {
                  onClose?.();
                  setModalActive(true);
                }}
                className="sidebar__link--wrapper"
              >
                <div className="sidebar__link--line" />
                <div className="sidebar__icon--wrapper">
                  <LuLogOut style={{ width: "24px", height: "24px" }} />
                </div>
                <div className="sidebar__link--text">Login</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {modalActive && <AuthModal onClose={() => setModalActive(false)} />}
    </>
  );
}
