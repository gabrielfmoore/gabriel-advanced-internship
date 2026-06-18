"use client";

import { useState } from "react";
import { AiFillFileText } from "react-icons/ai";
import { RiPlantFill } from "react-icons/ri";
import { FaHandshake } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { IoChevronBack } from "react-icons/io5";
import { Collapse } from "react-collapse";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FAQ_ITEMS = [
  {
    question: "How does the free 7-day trial work?",
    answer:
      "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
  },
  {
    question:
      "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
    answer:
      "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
  },
  {
    question: "What's included in the Premium plan?",
    answer:
      "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
  },
  {
    question: "Can I cancel during my trial or subscription?",
    answer:
      "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
  },
] as const;

type PlanType = "yearly" | "monthly";

export default function ChoosePlanPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("yearly");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const router = useRouter();
  const handleBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/for-you");
  };

  return (
    <div>
      <div className="plan">
        <div className="plan__header--wrapper">
          <div onClick={handleBack} className="plan__back-btn">
            <IoChevronBack className="plan__back-btn--icon" />
          </div>
          <div className="plan__header">
            <div className="plan__title">
              Get unlimited access to many amazing books to read
            </div>
            <div className="plan__sub--title">
              Turn ordinary moments into amazing learning opportunities
            </div>
            <figure className="plan__img--mask">
              <img src="/pricing-top.png" alt="pricing" />
            </figure>
          </div>
        </div>
        <div className="row">
          <div className="container">
            <div className="plan__features--wrapper">
              <div className="plan__features">
                <figure className="plan__features--icon">
                  <AiFillFileText />
                </figure>
                <div className="plan__features--text">
                  <b>Key ideas in few min</b> with many books to read
                </div>
              </div>
              <div className="plan__features">
                <figure className="plan__features--icon">
                  <RiPlantFill />
                </figure>
                <div className="plan__features--text">
                  <b>3 million</b> people growing with Summarist everyday
                </div>
              </div>
              <div className="plan__features">
                <figure className="plan__features--icon">
                  <FaHandshake />
                </figure>
                <div className="plan__features--text">
                  <b>Precise recommendations</b> collections curated by experts
                </div>
              </div>
            </div>

            <div className="section__title">Choose the plan that fits you</div>

            <button
              type="button"
              className={`plan__card ${selectedPlan === "yearly" ? "plan__card--active" : ""}`}
              onClick={() => setSelectedPlan("yearly")}
            >
              <div className="plan__card--circle">
                {selectedPlan === "yearly" && (
                  <div className="plan__card--dot" />
                )}
              </div>
              <div className="plan__card--content">
                <div className="plan__card--title">Premium Plus Yearly</div>
                <div className="plan__card--price">$99.99/year</div>
                <div className="plan__card--text">
                  7-day free trial included
                </div>
              </div>
            </button>

            <div className="plan__card--separator">
              <div className="plan__separator">or</div>
            </div>

            <button
              type="button"
              className={`plan__card ${selectedPlan === "monthly" ? "plan__card--active" : ""}`}
              onClick={() => setSelectedPlan("monthly")}
            >
              <div className="plan__card--circle">
                {selectedPlan === "monthly" && (
                  <div className="plan__card--dot" />
                )}
              </div>
              <div className="plan__card--content">
                <div className="plan__card--title">Premium Monthly</div>
                <div className="plan__card--price">$9.99/month</div>
                <div className="plan__card--text">No trial included</div>
              </div>
            </button>

            <div className="plan__card--cta">
              <span className="btn--wrapper">
                <button type="button" className="btn" style={{ width: 300 }}>
                  <span>
                    {selectedPlan === "yearly"
                      ? "Start your free 7-day trial"
                      : "Start your first month"}
                  </span>
                </button>
              </span>
              <div className="plan__disclaimer">
                {selectedPlan === "yearly"
                  ? "Cancel your trial at any time before it ends, and you won't be charged."
                  : "30-day money back guarantee, no questions asked."}
              </div>
            </div>

            <div className="faq__wrapper">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <div key={item.question} className="accordion__card">
                    <div
                      className="accordion__header"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    >
                      <div className="accordion__title">{item.question}</div>
                      <BsChevronDown
                        className={`accordion__icon ${isOpen ? "accordion__icon--rotate" : ""}`}
                      />
                    </div>
                    <Collapse isOpened={isOpen}>
                      <div className="accordion__body">{item.answer}</div>
                    </Collapse>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <section id="footer">
        <div className="container">
          <div className="row">
            <div className="footer__top--wrapper">
              <div className="footer__block">
                <div className="footer__link--title">Actions</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Summarist Magazine</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Cancel Subscription</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Help</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Contact us</a>
                  </div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Useful Links</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Pricing</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Summarist Business</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Gift Cards</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Authors &amp; Publishers</a>
                  </div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Company</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">About</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Careers</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Partners</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Code of Conduct</a>
                  </div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Other</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Sitemap</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Legal Notice</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Terms of Service</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Privacy Policies</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer__copyright--wrapper">
              <div className="footer__copyright">
                Copyright &copy; 2023 Summarist.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
