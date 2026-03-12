export type OrderStatus = 'delivered' | 'shipped' | 'processing' | 'confirmed';

export interface OrderItem {
  productId: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  deliveryAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  delivered: { label: 'Delivered', color: '#27AE60' },
  shipped: { label: 'In Transit', color: '#D4AF37' },
  processing: { label: 'Processing', color: '#E67E22' },
  confirmed: { label: 'Confirmed', color: '#3498DB' },
};

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'MA-2025-00847',
    date: '2025-12-18',
    status: 'delivered',
    items: [
      {
        productId: 1,
        name: 'Velours Sacré',
        category: 'Perfumes',
        price: 385,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80',
      },
      {
        productId: 17,
        name: 'Chronographe Impérial',
        category: 'Watches',
        price: 12500,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80',
      },
    ],
    subtotal: 12885,
    shipping: 0,
    total: 12885,
    deliveryAddress: '42 Avenue Montaigne, Paris 75008',
    trackingNumber: 'MA847291035FR',
  },
  {
    id: '2',
    orderNumber: 'MA-2026-00123',
    date: '2026-02-04',
    status: 'shipped',
    items: [
      {
        productId: 25,
        name: 'Sac Duchesse',
        category: 'Bags',
        price: 4200,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80',
      },
    ],
    subtotal: 4200,
    shipping: 0,
    total: 4200,
    deliveryAddress: '42 Avenue Montaigne, Paris 75008',
    trackingNumber: 'MA123884720FR',
    estimatedDelivery: '2026-03-15',
  },
  {
    id: '3',
    orderNumber: 'MA-2026-00291',
    date: '2026-03-10',
    status: 'processing',
    items: [
      {
        productId: 9,
        name: 'Manteau Opéra',
        category: 'Clothing',
        price: 3800,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e4?w=400&q=80',
      },
      {
        productId: 41,
        name: 'Escarpin Étoile',
        category: 'Shoes',
        price: 890,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80',
      },
      {
        productId: 51,
        name: 'Collier Céleste',
        category: 'Jewelry',
        price: 6800,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?w=400&q=80',
      },
    ],
    subtotal: 11490,
    shipping: 0,
    total: 11490,
    deliveryAddress: '15 Rue du Faubourg Saint-Honoré, Paris 75008',
    estimatedDelivery: '2026-03-20',
  },
];
