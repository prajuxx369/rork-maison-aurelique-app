import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';

const STORAGE_KEY = 'maison_aurelique_wishlist';

async function loadWishlist(): Promise<number[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    console.log('Failed to load wishlist from storage');
    return [];
  }
}

async function saveWishlist(ids: number[]): Promise<number[]> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    console.log('Failed to save wishlist to storage');
  }
  return ids;
}

export const [WishlistProvider, useWishlist] = createContextHook(() => { // eslint-disable-line rork/general-context-optimization
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    queryFn: loadWishlist,
  });

  const syncMutation = useMutation({
    mutationFn: saveWishlist,
  });

  useEffect(() => {
    if (wishlistQuery.data) {
      setWishlistIds(wishlistQuery.data);
    }
  }, [wishlistQuery.data]);

  const toggleWishlist = useCallback((productId: number) => {
    setWishlistIds(prev => {
      const updated = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      syncMutation.mutate(updated);
      return updated;
    });
  }, [syncMutation]);

  const isInWishlist = useCallback((productId: number) =>
    wishlistIds.includes(productId),
    [wishlistIds]
  );

  const count = useMemo(() => wishlistIds.length, [wishlistIds]);

  return {
    wishlistIds,
    toggleWishlist,
    isInWishlist,
    count,
    isLoading: wishlistQuery.isLoading,
  };
});
