export const MENU_CATEGORY_EVENT = 'teenmaar:open-category'

export function openMenuCategory(categoryLabel: string) {
  window.dispatchEvent(new CustomEvent(MENU_CATEGORY_EVENT, { detail: categoryLabel }))
}
