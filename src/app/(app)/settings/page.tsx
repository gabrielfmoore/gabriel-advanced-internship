"use client";

import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";

function Skeleton({
  width,
  height,
  marginBottom,
}: {
  width: string;
  height: string;
  marginBottom?: string;
}) {
  return (
    <div className="skeleton" style={{ width, height, marginBottom }} />
  );
}

function SettingsSkeleton() {
  return (
    <>
      <Skeleton width="160px" height="24px" marginBottom="12px" />
      <Skeleton width="280px" height="24px" marginBottom="32px" />
      <Skeleton width="160px" height="24px" marginBottom="12px" />
      <Skeleton width="280px" height="24px" />
    </>
  );
}

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const [modalActive, setModalActive] = useState(false);

  return (
    <div className="wrapper main__wrapper">
      <div className="row">
        <div className="container">
          <div className="section__title page__title">Settings</div>
          {authLoading ? (
            <SettingsSkeleton />
          ) : user ? (
            <>
              <div className="setting__content">
                <div className="settings__sub--title">
                  Your Subscription plan
                </div>
                <div className="settings__text">Basic</div>
                <Link
                  href="/choose-plan"
                  className="btn settings__upgrade--btn"
                >
                  Upgrade to Premium
                </Link>
              </div>
              <div className="setting__content">
                <div className="settings__sub--title">Email</div>
                <div className="settings__text">{user?.email}</div>
              </div>
            </>
          ) : (
            <div className="settings__login--wrapper">
              <img src="/login.png" alt="login" />
              <div className="settings__login--text">
                Log in to your account to see your details.
              </div>
              <div
                onClick={() => {
                  setModalActive(true);
                }}
                className="btn settings__login--btn"
              >
                Login
              </div>
            </div>
          )}
        </div>
      </div>
      {modalActive && <AuthModal onClose={() => setModalActive(false)} />}
    </div>
  );
}
