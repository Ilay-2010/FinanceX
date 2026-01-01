
export const setCookie = (name: string, value: any, days: number = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  // We stringify and encode to handle JSON safely in cookies
  const serialized = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${name}=${serialized};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const getCookie = (name: string) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        const decoded = decodeURIComponent(c.substring(nameEQ.length, c.length));
        return JSON.parse(decoded);
      } catch (e) {
        console.error("Cookie decryption failed", e);
        return null;
      }
    }
  }
  return null;
};

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
};
