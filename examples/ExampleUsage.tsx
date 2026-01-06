/**
 * Example Usage of Rendezvous Design System
 * 
 * This file demonstrates how to use the design system in a React Native component
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows, layout } from '../design-system';

// Example: Feed Post Component
export const FeedPost: React.FC<{
  username: string;
  avatarInitials: string;
  imageUrl?: string;
  hasNewNotification?: boolean;
}> = ({ username, avatarInitials, imageUrl, hasNewNotification }) => {
  return (
    <View style={styles.feedPost}>
      {/* User Header */}
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarInitials}</Text>
        </View>
        <Text style={styles.username}>{username}</Text>
      </View>

      {/* Post Image */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.postImage} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        {hasNewNotification && (
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>1 new</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Example: Daily Content Card Component
export const DailyCard: React.FC<{
  day: string;
  imageUrl?: string;
  onPress?: () => void;
}> = ({ day, imageUrl, onPress }) => {
  return (
    <TouchableOpacity style={styles.dailyCard} onPress={onPress}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.dailyCardImage} />
      ) : (
        <View style={styles.dailyCardPlaceholder}>
          <Text style={styles.plusSign}>+</Text>
        </View>
      )}
      <View style={styles.dailyCardLabel}>
        <Text style={styles.dailyCardText}>{day}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Example: Primary Button Component
export const PrimaryButton: React.FC<{
  title: string;
  onPress: () => void;
  disabled?: boolean;
}> = ({ title, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.primaryButton, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

// Example: Header Component
export const AppHeader: React.FC<{
  title: string;
  onMailPress?: () => void;
  onCalendarPress?: () => void;
}> = ({ title, onMailPress, onCalendarPress }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity onPress={onMailPress} style={styles.headerIcon}>
          {/* Mail icon would go here */}
        </TouchableOpacity>
        <TouchableOpacity onPress={onCalendarPress} style={styles.headerIcon}>
          {/* Calendar icon would go here */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles using the design system
const styles = StyleSheet.create({
  // Feed Post Styles
  feedPost: {
    backgroundColor: colors.background.primary,
    marginBottom: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  avatar: {
    width: layout.sizes.avatar.md,
    height: layout.sizes.avatar.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.interactive.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    ...typography.styles.label,
    color: colors.text.inverse,
  },
  username: {
    ...typography.styles.body,
    fontWeight: typography.fontWeight.semibold,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.lg,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
  },
  notificationBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.interactive.red,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.inverse,
  },

  // Daily Card Styles
  dailyCard: {
    width: layout.sizes.dailyCard.width,
    height: layout.sizes.dailyCard.height,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  dailyCardImage: {
    width: '100%',
    flex: 1,
  },
  dailyCardPlaceholder: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusSign: {
    fontSize: typography.fontSize['4xl'],
    color: colors.text.primary,
    fontWeight: typography.fontWeight.light,
  },
  dailyCardLabel: {
    padding: spacing.sm,
    backgroundColor: colors.background.primary,
  },
  dailyCardText: {
    ...typography.styles.caption,
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
  },

  // Button Styles
  primaryButton: {
    backgroundColor: colors.primary.gold,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.sizes.button.height.md,
  },
  primaryButtonText: {
    ...typography.styles.label,
    color: colors.text.inverse,
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // Header Styles
  header: {
    height: layout.header.height,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.header.padding.horizontal,
    paddingVertical: layout.header.padding.vertical,
    backgroundColor: colors.background.primary,
  },
  headerTitle: {
    ...typography.styles.h1,
    fontSize: typography.fontSize['2xl'],
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  headerIcon: {
    width: layout.sizes.icon.md,
    height: layout.sizes.icon.md,
    // Icon would be rendered here
  },
});

// Example Usage in a Screen
export const ExampleScreen: React.FC = () => {
  return (
    <View style={screenStyles.container}>
      <AppHeader
        title="Week 29"
        onMailPress={() => console.log('Mail pressed')}
        onCalendarPress={() => console.log('Calendar pressed')}
      />

      {/* Daily Content Scroll */}
      <View style={screenStyles.dailyScroll}>
        <DailyCard day="Mon" />
        <DailyCard day="Tue" />
        <DailyCard day="Wed" />
        <DailyCard day="" />
      </View>

      {/* Feed Posts */}
      <View style={screenStyles.feed}>
        <FeedPost
          username="janesmith"
          avatarInitials="JS"
          hasNewNotification={true}
        />
        <FeedPost
          username="nadim"
          avatarInitials="N"
        />
      </View>
    </View>
  );
};

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  dailyScroll: {
    flexDirection: 'row',
    paddingHorizontal: layout.screenPadding.horizontal,
    paddingVertical: spacing.md,
  },
  feed: {
    flex: 1,
  },
});

