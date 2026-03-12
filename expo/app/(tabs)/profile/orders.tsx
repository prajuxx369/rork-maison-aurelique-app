import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { MOCK_ORDERS, ORDER_STATUS_CONFIG } from '@/mocks/orders';
import type { Order, OrderStatus } from '@/mocks/orders';

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  delivered: <CheckCircle color="#27AE60" size={16} strokeWidth={1.5} />,
  shipped: <Truck color={Colors.gold} size={16} strokeWidth={1.5} />,
  processing: <Clock color="#E67E22" size={16} strokeWidth={1.5} />,
  confirmed: <Package color="#3498DB" size={16} strokeWidth={1.5} />,
};

function OrderCard({ order, index }: { order: Order; index: number }) {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 120, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay: index * 120, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/profile/order-detail?id=${order.id}`);
  };

  const config = ORDER_STATUS_CONFIG[order.status];
  const formattedDate = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: pressScale }] }}>
      <TouchableOpacity
        style={styles.orderCard}
        activeOpacity={0.7}
        onPressIn={() => Animated.timing(pressScale, { toValue: 0.98, duration: 80, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(pressScale, { toValue: 1, friction: 5, useNativeDriver: true }).start()}
        onPress={handlePress}
        testID={`order-card-${order.id}`}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <Text style={styles.orderDate}>{formattedDate}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: config.color + '18' }]}>
            {STATUS_ICONS[order.status]}
            <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          {order.items.slice(0, 3).map((item, i) => (
            <View key={i} style={styles.orderItemRow}>
              <View style={styles.itemImageContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.itemImage} contentFit="cover" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>
              <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
            </View>
          ))}
          {order.items.length > 3 && (
            <Text style={styles.moreItems}>+{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}</Text>
          )}
        </View>

        <View style={styles.orderFooter}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${order.total.toLocaleString()}</Text>
          </View>
          <ChevronRight color={Colors.whiteAlpha20} size={16} strokeWidth={1.5} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function OrderHistoryScreen() {
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [headerFade]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Order History', headerStyle: { backgroundColor: Colors.black }, headerTintColor: Colors.white, headerTitleStyle: { fontFamily: Typography.serifFamily, fontSize: 18, fontWeight: '400' as const } }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.summaryBanner, { opacity: headerFade }]}>
          <LinearGradient
            colors={[Colors.goldAlpha08, Colors.goldAlpha05, 'transparent']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{MOCK_ORDERS.length}</Text>
              <Text style={styles.summaryLabel}>Orders</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{MOCK_ORDERS.reduce((sum, o) => sum + o.items.length, 0)}</Text>
              <Text style={styles.summaryLabel}>Items</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>${(MOCK_ORDERS.reduce((sum, o) => sum + o.total, 0) / 1000).toFixed(1)}k</Text>
              <Text style={styles.summaryLabel}>Spent</Text>
            </View>
          </View>
        </Animated.View>

        {MOCK_ORDERS.map((order, index) => (
          <OrderCard key={order.id} order={order} index={index} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  scrollContent: { paddingBottom: 40 },
  summaryBanner: { marginHorizontal: 20, marginTop: 16, marginBottom: 24, borderRadius: 14, overflow: 'hidden' as const, borderWidth: 0.5, borderColor: Colors.goldAlpha10 },
  summaryRow: { flexDirection: 'row' as const, paddingVertical: 22 },
  summaryItem: { flex: 1, alignItems: 'center' as const },
  summaryValue: { fontFamily: Typography.serifFamily, color: Colors.gold, fontSize: 22, fontWeight: '400' as const },
  summaryLabel: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 10, fontWeight: '300' as const, letterSpacing: 2, textTransform: 'uppercase' as const, marginTop: 4 },
  summaryDivider: { width: 0.5, backgroundColor: Colors.goldAlpha15 },
  orderCard: { marginHorizontal: 20, marginBottom: 16, borderRadius: 14, backgroundColor: Colors.charcoalMedium, borderWidth: 0.5, borderColor: Colors.whiteAlpha05, overflow: 'hidden' as const },
  orderHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'flex-start' as const, padding: 18, borderBottomWidth: 0.5, borderBottomColor: Colors.whiteAlpha05 },
  orderNumber: { fontFamily: Typography.sansFamily, color: Colors.white, fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.3 },
  orderDate: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 12, fontWeight: '300' as const, marginTop: 3 },
  statusBadge: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusText: { fontFamily: Typography.sansFamily, fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.3 },
  orderItems: { padding: 18, gap: 14 },
  orderItemRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12 },
  itemImageContainer: { width: 48, height: 48, borderRadius: 10, overflow: 'hidden' as const, backgroundColor: Colors.charcoalDeep },
  itemImage: { width: 48, height: 48 },
  itemInfo: { flex: 1 },
  itemName: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha80, fontSize: 14, fontWeight: '400' as const },
  itemCategory: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha20, fontSize: 11, fontWeight: '300' as const, marginTop: 2, letterSpacing: 1, textTransform: 'uppercase' as const },
  itemPrice: { fontFamily: Typography.serifFamily, color: Colors.whiteAlpha60, fontSize: 14, fontWeight: '400' as const },
  moreItems: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 12, fontWeight: '400' as const, marginTop: 2 },
  orderFooter: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, padding: 18, borderTopWidth: 0.5, borderTopColor: Colors.whiteAlpha05, backgroundColor: Colors.whiteAlpha05 },
  totalLabel: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 10, fontWeight: '300' as const, letterSpacing: 2, textTransform: 'uppercase' as const },
  totalValue: { fontFamily: Typography.serifFamily, color: Colors.gold, fontSize: 18, fontWeight: '400' as const, marginTop: 2 },
});
