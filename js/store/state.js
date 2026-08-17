import { loadFromStorage, saveToStorage } from '../utils/storage.js';

export const state = {
  currentTab: 'activities', // 'activities' | 'gourmet' | 'stays' | 'shopping'
  
  // Activities Filter State
  actCategory: 'all',
  actTag: 'all',
  
  // Gourmet Filter State
  gourmetCategory: 'all',
  gourmetTag: 'all',

  // Stays Filter State
  stayCategory: 'all',
  stayTag: 'all',

  // Shopping Filter State
  shoppingCategory: 'all',
  shoppingTag: 'all',
  
  // Global Toolbar State
  searchQuery: '',
  sortBy: 'recommended',
  currentView: 'grid', // 'grid' | 'timeline'
  wishlistOnly: false,
  
  // LocalStorage State
  wishlist: loadFromStorage('nha_trang_wishlist', []),
  gourmetWishlist: loadFromStorage('nha_trang_gourmet_wishlist', []),
  stayWishlist: loadFromStorage('nha_trang_stay_wishlist', []),
  shoppingWishlist: loadFromStorage('nha_trang_shopping_wishlist', []),
  notes: loadFromStorage('nha_trang_notes', {}),
  gourmetNotes: loadFromStorage('nha_trang_gourmet_notes', {}),
  stayNotes: loadFromStorage('nha_trang_stay_notes', {}),
  shoppingNotes: loadFromStorage('nha_trang_shopping_notes', {}),
  
  // Active Modals
  activeModalActivity: null,
  activeModalGourmet: null,
  activeModalStay: null,
  activeModalShopping: null
};

export function updateWishlistBadge() {
  const total = state.wishlist.length + state.gourmetWishlist.length + (state.stayWishlist ? state.stayWishlist.length : 0) + (state.shoppingWishlist ? state.shoppingWishlist.length : 0);
  const wishlistCount = document.getElementById('wishlistCount');
  const wishlistBtn = document.getElementById('wishlistToggleBtn');
  
  if (wishlistCount) wishlistCount.textContent = total;
  if (wishlistBtn) wishlistBtn.classList.toggle('active', state.wishlistOnly);
}

export function resetStateFilters() {
  state.actCategory = 'all';
  state.actTag = 'all';
  state.gourmetCategory = 'all';
  state.gourmetTag = 'all';
  state.stayCategory = 'all';
  state.stayTag = 'all';
  state.shoppingCategory = 'all';
  state.shoppingTag = 'all';
  state.searchQuery = '';
  state.sortBy = 'recommended';
  state.wishlistOnly = false;
}
