import { observable, action, makeObservable } from "mobx";
import json from "~/assets/translations";

let locale = "kr";
const loadStoredLocale = () => {
  const supportedLocales = ["kr", "en"];
  let storedLocale = window.localStorage.getItem("locale");
  if (supportedLocales.indexOf(storedLocale) !== -1) {
    locale = storedLocale;
  } else {
    window.localStorage.setItem("locale", locale);
  }
};

class Translation {
  locale;
  texts;

  constructor() {
    loadStoredLocale();
    this.locale = locale;
    this.texts = json;

    makeObservable(this, {
      locale: observable,
      texts: observable,
      toggleLocale: action,
    });
  }

  toggleLocale = () => {
    let next = this.locale === "kr" ? "en" : "kr";
    this.locale = next;
    window.localStorage.setItem("locale", next);
  };
}

export default new Translation();
