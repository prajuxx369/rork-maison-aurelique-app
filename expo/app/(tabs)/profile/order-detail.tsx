import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CheckCircle,
  Truck,
  Clock,
  Package,
  MapPin,
  Hash,
  Calendar,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { MOCK_ORDERS, ORDER_STATUS_CONFIG } from '@/mocks/orders';
import type { OrderStatus } from '@/mocks/orders';

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  delivered: <CheckCircle color="#27AE60" size={20} strokeWidth={1.5} />,
  shipped: <Truck color={Colors.gold} size={20} strokeWidth={1.5} />,
  processing: <Clock color="#E67E22" size={20} strokeWidth={1.5} />,
  confirmed: <Package color="#3498DB" size={20} strokeWidth={1.5} />,
};

const TIMELINE_STEPS: OrderStatus[] = ['confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = MOCK_ORDERS.find(o => o.id === id);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  if (!order) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Order', headerStyle: { backgroundColor: Colors.black }, headerTintColor: Colors.white }} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Order not found</Text>
        </View>
      </View>
    );
  }

  const config = ORDER_STATUS_CONFIG[order.status];
  const formattedDate = new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const currentStepIndex = TIMELINE_STEPS.indexOf(order.status);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: order.orderNumber, headerStyle: { backgroundColor: Colors.black }, headerTintColor: Colors.white, headerTitleStyle: { fontFamily: Typography.sansFamily, fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.5 } }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.statusCard}>
            <LinearGradient
              colors={[config.color + '12', 'transparent']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.statusHeader}>
              {STATUS_ICONS[order.status]}
              <View style={styles.statusInfo}>
                <Text style={[styles.statusTitle, { color: config.color }]}>{config.label}</Text>
                {order.estimatedDelivery && (
                  <Text style={styles.statusSub}>Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                )}
                {order.status === 'delivered' && (
                  <Text style={styles.statusSub}>Delivered on {formattedDate}</Text>
                )}
              </View>
            </View>

            <View style={styles.timeline}>
              {TIMELINE_STEPS.map((step, i) => {
                const isActive = i <= currentStepIndex;
                const stepConfig = ORDER_STATUS_CONFIG[step];
                return (
                  <View key={step} style={styles.timelineStep}>
                    <View style={[styles.timelineDot, isActive && { backgroundColor: config.color, borderColor: config.color }]} />
                    {i < TIMELINE_STEPS.length - 1 && (
                      <View style={[styles.timelineLine, isActive && i < currentStepIndex && { backgroundColor: config.color }]} />
                    )}
                    <Text style={[styles.timelineLabel, isActive && { color: Colors.whiteAlpha60 }]}>{stepConfig.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ORDER DETAILS</Text>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}><Hash color={Colors.whiteAlpha30} size={14} strokeWidth={1.5} /></View>
              <Text style={styles.detailLabel}>Order Number</Text>
              <Text style={styles.detailValue}>{order.orderNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}><Calendar color={Colors.whiteAlpha30} size={14} strokeWidth={1.5} /></View>
              <Text style={styles.detailLabel}>Order Date</Text>
              <Text style={styles.detailValue}>{formattedDate}</Text>
            </View>
            {order.trackingNumber && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}><Truck color={Colors.whiteAlpha30} size={14} strokeWidth={1.5} /></View>
                <Text style={styles.detailLabel}>Tracking</Text>
                <Text style={styles.detailValueGold}>{order.trackingNumber}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}><MapPin color={Colors.whiteAlpha30} size={14} strokeWidth={1.5} /></View>
              <Text style={styles.detailLabel}>Delivery</Text>
              <Text style={styles.detailValue}>{order.deliveryAddress}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ITEMS ({order.items.length})</Text>
            {order.items.map((item, i) => (
              <View key={i} style={styles.itemCard}>
                <View style={styles.itemImageWrap}>
                  <Image source={{ uri: item.imageUrl }} style={styles.itemImage} contentFit="cover" />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <View style={styles.itemPriceRow}>
                    <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
                    <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PAYMENT SUMMARY</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${order.subtotal.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValueGreen}>{order.shipping === 0 ? 'Complimentary' : `$${order.shipping}`}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${order.total.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  scrollContent: { paddingBottom: 40 },
  emptyState: { flex: 1, justifyContent: 'center' as const, alignItems: 'center' as const },
  emptyText: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 15 },
  statusCard: { marginHorizontal: 20, marginTop: 16, marginBottom: 24, borderRadius: 14, backgroundColor: Colors.charcoalMedium, borderWidth: 0.5, borderColor: Colors.whiteAlpha05, overflow: 'hidden' as const, padding: 20 },
  statusHeader: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 14, marginBottom: 24 },
  statusInfo: { flex: 1 },
  statusTitle: { fontFamily: Typography.serifFamily, fontSize: 20, fontWeight: '400' as const },
  statusSub: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 12, fontWeight: '300' as const, marginTop: 3 },
  timeline: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, justifyContent: 'space-between' as const },
  timelineStep: { alignItems: 'center' as const, flex: 1 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.charcoalDeep, borderWidth: 1.5, borderColor: Colors.whiteAlpha15 },
  timelineLine: { position: 'absolute' as const, top: 4, left: '55%' as const, right: '-45%' as const, height: 1.5, backgroundColor: Colors.whiteAlpha08, zIndex: -1 },
  timelineLabel: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha15, fontSize: 9, fontWeight: '400' as const, letterSpacing: 0.5, marginTop: 8, textTransform: 'uppercase' as const },
  section: { marginHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha15, fontSize: 9, fontWeight: '500' as const, letterSpacing: 4, textTransform: 'uppercase' as const, marginBottom: 14 },
  detailRow: { flexDirection: 'row' as const, alignItems: 'center' as const, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: Colors.whiteAlpha05 },
  detailIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.whiteAlpha05, justifyContent: 'center' as const, alignItems: 'center' as const, marginRight: 12 },
  detailLabel: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 13, fontWeight: '300' as const, flex: 1 },
  detailValue: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha60, fontSize: 13, fontWeight: '400' as const, textAlign: 'right' as const, maxWidth: '50%' as const },
  detailValueGold: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.3 },
  itemCard: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 14, paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: Colors.whiteAlpha05 },
  itemImageWrap: { width: 64, height: 64, borderRadius: 12, overflow: 'hidden' as const, backgroundColor: Colors.charcoalMedium },
  itemImage: { width: 64, height: 64 },
  itemDetails: { flex: 1 },
  itemName: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha80, fontSize: 15, fontWeight: '400' as const },
  itemCategory: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha20, fontSize: 11, fontWeight: '300' as const, letterSpacing: 1, textTransform: 'uppercase' as const, marginTop: 2 },
  itemPriceRow: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, marginTop: 6 },
  itemPrice: { fontFamily: Typography.serifFamily, color: Colors.gold, fontSize: 15, fontWeight: '400' as const },
  itemQty: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 12, fontWeight: '300' as const },
  summaryCard: { backgroundColor: Colors.charcoalMedium, borderRadius: 14, padding: 18, borderWidth: 0.5, borderColor: Colors.whiteAlpha05 },
  summaryRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, paddingVertical: 8 },
  summaryLabel: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 14, fontWeight: '300' as const },
  summaryValue: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha60, fontSize: 14, fontWeight: '400' as const },
  summaryValueGreen: { fontFamily: Typography.sansFamily, color: Colors.success, fontSize: 14, fontWeight: '400' as const },
  summaryDivider: { height: 0.5, backgroundColor: Colors.whiteAlpha08, marginVertical: 8 },
  totalLabel: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 16, fontWeight: '400' as const },
  totalValue: { fontFamily: Typography.serifFamily, color: Colors.gold, fontSize: 20, fontWeight: '400' as const },
});
