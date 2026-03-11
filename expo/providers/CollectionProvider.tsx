import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';

export interface CollectionItem {
  productId: number;
  quantity: number;
}

const STORAGE_KEY = 'maison_aurelique_collection';

async function loadCollection(): Promise<CollectionItem[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    console.log('Failed to load collection from storage');
    return [];
  }
}

async function saveCollection(items: CollectionItem[]): Promise<CollectionItem[]> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    console.log('Failed to save collection to storage');
  }
  return items;
}

export const [CollectionProvider, useCollection] = createContextHook(() => { // eslint-disable-line rork/general-context-optimization
  const [items, setItems] = useState<CollectionItem[]>([]);

  const collectionQuery = useQuery({
    queryKey: ['collection'],
    queryFn: loadCollection,
  });

  const syncMutation = useMutation({
    mutationFn: saveCollection,
  });

  useEffect(() => {
    if (collectionQuery.data) {
      setItems(collectionQuery.data);
    }
  }, [collectionQuery.data]);

  const addItem = useCallback((productId: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId);
      let updated: CollectionItem[];
      if (existing) {
        updated = prev.map(i =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updated = [...prev, { productId, quantity: 1 }];
      }
      syncMutation.mutate(updated);
      return updated;
    });
  }, [syncMutation]);

  const removeItem = useCallback((productId: number) => {
    setItems(prev => {
      const updated = prev.filter(i => i.productId !== productId);
      syncMutation.mutate(updated);
      return updated;
    });
  }, [syncMutation]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev => {
      const updated = prev.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      );
      syncMutation.mutate(updated);
      return updated;
    });
  }, [removeItem, syncMutation]);

  const clearCollection = useCallback(() => {
    setItems([]);
    syncMutation.mutate([]);
  }, [syncMutation]);

  const totalItems = useMemo(() =>
    items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const isInCollection = useCallback((productId: number) =>
    items.some(i => i.productId === productId),
    [items]
  );

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCollection,
    totalItems,
    isInCollection,
    isLoading: collectionQuery.isLoading,
  };
});
