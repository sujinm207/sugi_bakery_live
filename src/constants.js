import { createContext, useContext } from 'react';
import { DEFAULT_SETTINGS } from './defaultData';

/* Shop details now come from the admin (server/data/settings.json).
   Components read them with useShop() instead of importing a constant. */

export const ShopContext = createContext(DEFAULT_SETTINGS);

export const useShop = () => useContext(ShopContext);

/** Build a WhatsApp deep link for the shop's number. */
export const waLink = (phoneRaw, text) =>
  `https://wa.me/${phoneRaw}?text=${encodeURIComponent(text)}`;

/** The default "I want to order" message. */
export const orderText = (shopName) =>
  `Hi ${shopName}, I'd like to place an order`;
