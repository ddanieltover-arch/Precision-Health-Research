export type UkShippingMethodId =
  | 'royal_mail_24'
  | 'royal_mail_special'
  | 'dpd_uk'
  | 'dpd_saturday';

export const FREE_SHIPPING_THRESHOLD_GBP = 500;

export const UK_SHIPPING_OPTIONS = [
  {
    id: 'royal_mail_24' as const,
    label: 'Royal Mail 24',
    eta: '1-2 WORKING DAYS',
    price: 4.5,
    qualifiesForFreeShipping: true,
  },
  {
    id: 'royal_mail_special' as const,
    label: 'Royal Mail Special',
    eta: '1 WORKING DAY',
    price: 7.5,
    qualifiesForFreeShipping: false,
  },
  {
    id: 'dpd_uk' as const,
    label: 'DPD UK',
    eta: '1-2 WORKING DAYS',
    price: 6.9,
    qualifiesForFreeShipping: false,
  },
  {
    id: 'dpd_saturday' as const,
    label: 'DPD UK (*Saturday Delivery)',
    eta: 'WEEKEND DELIVERY',
    price: 9.5,
    qualifiesForFreeShipping: false,
  },
];

export function getUkShippingOption(id: UkShippingMethodId) {
  return UK_SHIPPING_OPTIONS.find((o) => o.id === id) ?? UK_SHIPPING_OPTIONS[0];
}

export function getUkShippingCost(methodId: UkShippingMethodId, cartTotalGbp: number): number {
  const option = getUkShippingOption(methodId);
  if (option.qualifiesForFreeShipping && cartTotalGbp >= FREE_SHIPPING_THRESHOLD_GBP) {
    return 0;
  }
  return option.price;
}
