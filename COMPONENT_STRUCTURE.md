# Component Structure Documentation

## Overview
The components have been refactored into a more granular, modular structure for better maintainability, reusability, and testing.

## Folder Structure
```
src/components/
├── GroupList.tsx (Main component)
├── ReminderList.tsx (Main component)
├── shared/                   # Reusable components
│   ├── index.ts
│   ├── SearchBox.tsx
│   ├── ColorPicker.tsx
│   ├── IconButton.tsx
│   ├── Badge.tsx
│   └── FormField.tsx
├── GroupList/               # GroupList-specific components
│   ├── index.ts
│   ├── SmartListItem.tsx
│   ├── GroupItem.tsx
│   ├── MyListsSection.tsx
│   ├── CreateGroupForm.tsx
│   └── AddListButton.tsx
└── ReminderList/           # ReminderList-specific components
    ├── index.ts
    ├── ReminderHeader.tsx
    ├── TimeSection.tsx
    ├── ReminderItem.tsx
    ├── QuickAddForm.tsx
    └── DetailedAddForm.tsx
```

## Shared Components

### SearchBox
- **Purpose**: Reusable search input component
- **Props**: `placeholder`, `value`, `onChange`, `className`
- **Usage**: Used in GroupList for filtering groups

### ColorPicker
- **Purpose**: Color selection component
- **Props**: `colors`, `selectedColor`, `onColorSelect`, `className`
- **Usage**: Used in CreateGroupForm and DetailedAddForm

### IconButton
- **Purpose**: Reusable button with icon
- **Props**: `onClick`, `icon`, `className`, `variant`
- **Variants**: `primary`, `secondary`, `danger`
- **Usage**: Used for action buttons throughout the app

### Badge
- **Purpose**: Display count/number badges
- **Props**: `count`, `className`
- **Features**: Automatically hides when count is 0, shows "99+" for counts over 99
- **Usage**: Used in SmartListItem and GroupItem

### FormField
- **Purpose**: Consistent form field with label
- **Props**: `label`, `children`, `className`
- **Usage**: Used in DetailedAddForm for form organization

## GroupList Components

### SmartListItem
- **Purpose**: Renders smart list items (Today, Scheduled, All, etc.)
- **Props**: `icon`, `label`, `count`, `bgColor`, `isSelected`, `onClick`, `animationDelay`
- **Features**: Motion animations, selection state

### GroupItem
- **Purpose**: Renders individual reminder groups
- **Props**: `group`, `isSelected`, `onSelect`, `onDelete`, `animationDelay`, `reminderCount`
- **Features**: Hover delete button, motion animations

### MyListsSection
- **Purpose**: Container for user-created groups
- **Props**: `groups`, `selectedGroupId`, `onSelectGroup`, `onDeleteGroup`
- **Features**: Section header, maps through GroupItem components

### CreateGroupForm
- **Purpose**: Form for creating new groups
- **Props**: `isVisible`, `groupName`, `selectedColor`, `colorOptions`, event handlers
- **Features**: AnimatePresence for smooth show/hide, color picker integration

### AddListButton
- **Purpose**: Button to trigger group creation
- **Props**: `onClick`
- **Features**: Motion hover/tap animations

## ReminderList Components

### ReminderHeader
- **Purpose**: Header section for reminder views
- **Props**: `selectedGroupId`, `selectedGroup`
- **Features**: Dynamic title based on selection, additional info for Today view

### TimeSection
- **Purpose**: Groups reminders by time of day
- **Props**: `title`, `reminders`, `onCancelReminder`, `getGroupName`, `formatDate`, `animationDelay`
- **Features**: Handles empty states, maps through ReminderItem

### ReminderItem
- **Purpose**: Individual reminder display
- **Props**: `reminder`, `onCancel`, `getGroupName`, `formatDate`, `formatTime`, `showGroupName`, `animationDelay`
- **Features**: Conditional display of group name and time info, cancel button

### QuickAddForm
- **Purpose**: Simple reminder creation interface
- **Props**: `value`, `onChange`, `onSubmit`
- **Features**: Enter key submission, additional action buttons

### DetailedAddForm
- **Purpose**: Advanced reminder creation with full options
- **Props**: `isVisible`, `formData`, `groups`, `colorOptions`, `intervalOptions`, event handlers
- **Features**: Form fields, color picker, dropdown selections

## Benefits of This Structure

1. **Single Responsibility**: Each component has one clear purpose
2. **Reusability**: Shared components can be used across different parts of the app
3. **Maintainability**: Easier to locate and modify specific functionality
4. **Testing**: Smaller components are easier to unit test
5. **Performance**: Smaller components can be optimized individually
6. **Code Organization**: Clear separation of concerns
7. **Consistency**: Shared components ensure consistent UI patterns

## Usage Examples

```tsx
// Using shared components
import { Badge, IconButton } from './shared';

// Using GroupList components
import { SmartListItem, GroupItem } from './GroupList';

// Using ReminderList components
import { ReminderHeader, TimeSection } from './ReminderList';
```

## Future Improvements

1. Add prop validation with PropTypes or stronger TypeScript interfaces
2. Create Storybook stories for each component
3. Add unit tests for each component
4. Consider adding compound component patterns for complex forms
5. Add accessibility features (ARIA labels, keyboard navigation)
6. Create theme variants for components
