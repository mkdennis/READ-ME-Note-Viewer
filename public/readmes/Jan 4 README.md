# Learning Summary: Item Upload V2 Prototype

This document summarizes key React and front-end development concepts learned while building this prototype.

## Table of Contents
1. [Project Setup](#project-setup)
2. [Component Architecture](#component-architecture)
3. [State Management](#state-management)
4. [Styling & Layout](#styling--layout)
5. [Font Loading](#font-loading)
6. [SearchableCategoryDropdown Component](#searchablecategorydropdown-component) - *Added January 4, 2025*
7. [Common Questions & Answers](#common-questions--answers)

---

## Project Setup

### Tech Stack
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Yarn** - Package manager

### Project Structure
```
src/
  ├── components/     # Reusable design system components
  ├── pages/          # Page-level components
  ├── fonts/          # Custom font files
  ├── App.tsx         # Main app component
  ├── main.tsx        # Entry point
  └── index.css       # Global styles
```

---

## Component Architecture

### Creating Reusable Components

**Key Principle:** Build components that can be reused across the application.

**Example: Dropdown Component**
- Accepts props (label, placeholder, value, onChange, options)
- Encapsulates its own styling
- Can be used anywhere in the app

**Component Structure:**
```typescript
interface ComponentProps {
  label: string
  value?: string
  onChange?: (value: string) => void
}

function Component({ label, value, onChange }: ComponentProps) {
  return (
    <div className="component">
      {/* Component JSX */}
    </div>
  )
}
```

### Components Created
1. **Dropdown** - Select dropdown with custom chevron
2. **TextInput** - Text input field
3. **NumberInput** - Number input with optional suffix
4. **RadioButtonGroup** - Group of radio buttons
5. **SearchableCategoryDropdown** - Searchable autocomplete with hierarchical data (added January 4, 2025)

---

## State Management

### useState Hook

**What it does:** Allows components to remember and update data.

**Syntax:**
```typescript
const [variableName, setVariableName] = useState(initialValue)
```

**Example:**
```typescript
const [internalValue, setInternalValue] = useState<string>('')

// Update the value
setInternalValue('new value')
```

### Controlled vs Uncontrolled Components

**Controlled Component:**
- Parent component manages the state
- Requires `value` and `onChange` props
- Parent has full control over the input

**Uncontrolled Component:**
- Component manages its own state internally
- Works independently without parent state
- More flexible for simple use cases

**Hybrid Approach (What we used):**
- Component manages its own state with `useState`
- Also supports parent control via props
- Works both ways for maximum flexibility

**Example from TextInput:**
```typescript
const [internalValue, setInternalValue] = useState<string>(value || '')

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const inputValue = e.target.value
  setInternalValue(inputValue)      // Update internal state
  onChange?.(inputValue)            // Notify parent (if provided)
}
```

### Why Internal State Was Needed

**Problem:** TextInput and NumberInput weren't working when typing.

**Root Cause:** Components were "controlled" but parent wasn't providing state management.

**Solution:** Added internal state using `useState` so components work independently, while still supporting parent control when needed.

---

## Styling & Layout

### CSS Organization

**Component-Level Styles:**
- Each component has its own `.css` file
- Styles are scoped to that component
- Example: `Dropdown.css`, `TextInput.css`

**Global Styles:**
- `index.css` - Base styles, font definitions, resets
- `App.css` - App-level layout and section styles

### Layout Techniques

**Flexbox:**
```css
.container {
  display: flex;
  flex-direction: column;  /* Stack vertically */
  gap: 18px;               /* Space between items */
  align-items: center;     /* Center horizontally */
}
```

**CSS Grid:**
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3 equal columns */
  gap: 18px;
}
```

**Absolute Positioning:**
```css
.parent {
  position: relative;  /* Creates positioning context */
}

.child {
  position: absolute;
  right: 18px;         /* Position from right edge */
  top: 50%;
  transform: translateY(-50%);  /* Center vertically */
}
```

### Common Patterns Used

1. **Form Field Structure:**
   - Label on top
   - Input field below
   - 9px gap between label and field

2. **Side-by-Side Layouts:**
   - Used CSS Grid with `grid-template-columns: repeat(2, 1fr)`
   - Applied to: Date/Period fields, Wear/Restoration fields

3. **Suffix Inside Input:**
   - Used absolute positioning
   - Added right padding to input to make room
   - Suffix positioned on right side

---

## Font Loading

### @font-face Declaration

**What it does:** Tells the browser to load a custom font file.

**Structure:**
```css
@font-face {
  font-family: 'Font Name';           /* Name you'll use in CSS */
  src: url('./fonts/font-file.otf') format('opentype');
  font-weight: 400;                    /* Which weight this file represents */
  font-style: normal;                  /* normal or italic */
  font-display: swap;                  /* How to display while loading */
}
```

**How it works:**
1. Browser loads the font file from the specified path
2. Makes it available under the `font-family` name
3. When you use `font-family: 'Font Name'` in CSS, it uses that file

**Multiple Weights:**
- Need separate `@font-face` for each weight/style combination
- Example: Regular (400), Medium (500), Semibold (600), Bold (700)

**Font Files Used:**
- Proxima Nova (Light 300, Regular 400, Semibold 600, Bold 700)
- Cardinal Classic Short (Regular 400, Medium 500, Semibold 600, Bold 700)

---

## SearchableCategoryDropdown Component

*Added: Sunday, January 4, 2025*

### Overview

A searchable autocomplete dropdown component that allows users to type and filter hierarchical category data (L1 > L2 format), with real-time suggestions, keyboard navigation, and support for both controlled and uncontrolled modes.

### Key Features

- Real-time search filtering (searches both L1 and L2 categories)
- Keyboard navigation (Arrow keys, Enter, Escape)
- Click-outside detection to close dropdown
- Displays selected value in "L1 > L2" format (e.g., "Lighting > Table Lamps")
- Works in both controlled and uncontrolled modes

### Data Structure

```typescript
interface Category {
  l1: string  // Level 1: e.g., "Lighting"
  l2: string  // Level 2: e.g., "Table Lamps"
}

// Display format: "Lighting > Table Lamps"
```

### React Hooks Used

#### 1. Multiple useState Hooks

**Purpose:** Manage different aspects of component state

```typescript
const [inputValue, setInputValue] = useState<string>(value || '')
const [isOpen, setIsOpen] = useState<boolean>(false)
const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
const [isSearching, setIsSearching] = useState<boolean>(false)
```

**Why Multiple States?**
- Each state variable has a specific purpose
- Separating concerns makes the component easier to understand and debug
- `inputValue` - What the user typed or selected
- `isOpen` - Whether dropdown is visible
- `highlightedIndex` - Which suggestion is highlighted (for keyboard nav)
- `isSearching` - Whether user is actively searching vs. showing selected value

#### 2. useRef Hook

**Purpose:** Get direct access to DOM elements without causing re-renders

```typescript
const wrapperRef = useRef<HTMLDivElement>(null)
const inputRef = useRef<HTMLInputElement>(null)
const suggestionsRef = useRef<HTMLDivElement>(null)
```

**Why useRef?**
- Need to check if clicks are outside the component (click-outside detection)
- Need to scroll highlighted item into view
- Need to programmatically set input value
- Refs don't cause re-renders (unlike state)

**Usage:**
```typescript
// Attach ref to element
<div ref={wrapperRef}>

// Access the DOM element
if (wrapperRef.current && !wrapperRef.current.contains(target)) {
  // Click is outside
}
```

#### 3. useEffect Hook

**Three useEffect Hooks in This Component:**

**A. Sync with prop value (controlled mode):**
```typescript
useEffect(() => {
  if (value !== undefined) {
    setInputValue(value)
    setIsSearching(false)
  }
}, [value])
```
- Runs when `value` prop changes
- Keeps internal state in sync with parent's state

**B. Click-outside detection:**
```typescript
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    if (wrapperRef.current && !wrapperRef.current.contains(target)) {
      setIsOpen(false)
      // Reset state appropriately
    }
  }

  document.addEventListener('mousedown', handleClickOutside)
  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
  }
}, [value, isSearching, inputValue])
```
- Adds event listener when component mounts
- Removes event listener when component unmounts (cleanup)
- Dependencies array: re-runs when these values change
- **Critical:** Cleanup function prevents memory leaks

**C. Scroll highlighted item into view:**
```typescript
useEffect(() => {
  if (highlightedIndex >= 0 && suggestionsRef.current) {
    const element = suggestionsRef.current.children[highlightedIndex] as HTMLElement
    if (element) {
      element.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }
}, [highlightedIndex])
```
- Runs when `highlightedIndex` changes
- Scrolls the highlighted suggestion into view

### Event Handling & Event Bubbling

#### The Problem We Solved

**Initial Issue:** Clicking a suggestion didn't select it properly.

**Root Cause:** Event bubbling - the click event was bubbling up to the document, triggering the "click-outside" handler before the selection could complete.

#### Event Bubbling Explained

```
User clicks suggestion
  ↓
onClick fires on suggestion div
  ↓
Event bubbles up to parent div
  ↓
Event bubbles up to document
  ↓
Click-outside handler fires ❌ (closes dropdown before selection)
```

#### The Solution: preventDefault() and stopPropagation()

```typescript
onClick={(e) => {
  e.preventDefault()      // Prevents default browser behavior
  e.stopPropagation()     // Stops event from bubbling up
  handleSelect(suggestion)
}}
```

**What each does:**

1. **preventDefault():**
   - Prevents the browser's default action
   - In this case, not strictly necessary, but good practice
   - Example: Prevents form submission, link navigation, etc.

2. **stopPropagation():**
   - **Critical fix!** Stops the event from bubbling to parent elements
   - Prevents click-outside handler from firing
   - Allows selection to complete first

**After fix:**
```
User clicks suggestion
  ↓
onClick fires on suggestion div
  ↓
stopPropagation() stops bubbling ✅
  ↓
handleSelect() completes
  ↓
Dropdown closes with selected value
```

### Controlled vs Uncontrolled Components

#### Hybrid Approach

The component works in both modes:

```typescript
interface SearchableCategoryDropdownProps {
  value?: string           // Optional - makes it work both ways
  onChange?: (value: string) => void
  // ... other props
}
```

**How it works:**

```typescript
// Internal state always exists
const [inputValue, setInputValue] = useState<string>(value || '')

// Display logic chooses source
const displayValue = isSearching 
  ? inputValue                                    // Always use input when searching
  : (value !== undefined ? value : inputValue)    // Use prop if provided, else internal

// When selecting
const handleSelect = (selectedValue: string) => {
  setInputValue(selectedValue)      // Update internal state
  onChange?.(selectedValue)         // Notify parent (if provided)
}
```

**Benefits:**
- Works standalone (uncontrolled)
- Can be controlled by parent if needed
- Flexible and reusable

### Search & Filter Logic

```typescript
const getFilteredCategories = (searchTerm: string): string[] => {
  if (!searchTerm.trim()) {
    return []  // No search term = no results
  }

  const lowerSearch = searchTerm.toLowerCase()
  return categories
    .filter(category => 
      category.l1.toLowerCase().includes(lowerSearch) ||
      category.l2.toLowerCase().includes(lowerSearch)
    )
    .map(category => `${category.l1} > ${category.l2}`)
}
```

**How it works:**
1. Convert search term to lowercase for case-insensitive matching
2. Filter categories where L1 OR L2 contains the search term
3. Map to display format: "L1 > L2"

**Example:**
- User types: "lamp"
- Matches: "Lighting > Floor Lamps", "Lighting > Table Lamps"
- Displays: "Lighting > Floor Lamps", "Lighting > Table Lamps"

### Keyboard Navigation

```typescript
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()  // Prevent cursor movement
      setHighlightedIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      )
      break
    case 'ArrowUp':
      e.preventDefault()
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1))
      break
    case 'Enter':
      e.preventDefault()
      if (highlightedIndex >= 0) {
        handleSelect(filteredSuggestions[highlightedIndex])
      }
      break
    case 'Escape':
      e.preventDefault()
      setIsOpen(false)
      // Reset to original value
      break
  }
}
```

**Key Points:**
- `e.preventDefault()` stops default browser behavior (cursor movement, form submission)
- Functional state updates: `prev => prev + 1` (uses previous value)
- Bounds checking: `prev < filteredSuggestions.length - 1`

### Common Patterns Learned

#### 1. Click-Outside Detection Pattern

```typescript
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    if (wrapperRef.current && !wrapperRef.current.contains(target)) {
      // Click is outside - close dropdown
      setIsOpen(false)
    }
  }

  document.addEventListener('mousedown', handleClickOutside)
  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
  }
}, [dependencies])
```

**Important Points:**
- Listener added to `document` (catches all clicks)
- `contains()` checks if click target is inside component
- Cleanup function removes listener (prevents memory leaks)
- Dependencies array ensures handler has latest values

#### 2. Hybrid Controlled/Uncontrolled Pattern

```typescript
const [internalValue, setInternalValue] = useState(value || '')
const displayValue = value !== undefined ? value : internalValue
```

#### 3. Keyboard Navigation Pattern

```typescript
const handleKeyDown = (e) => {
  e.preventDefault()
  switch (e.key) {
    case 'ArrowDown': setIndex(prev => prev + 1); break
    case 'Enter': selectItem(); break
  }
}
```

### Key Questions & Answers

#### Q: Why did clicking a suggestion not work initially?

**A:** Event bubbling was causing the click-outside handler to fire before the selection could complete. The fix was adding `e.stopPropagation()` to prevent the event from bubbling up to the document level.

**Before:**
```typescript
onClick={() => handleSelect(suggestion)}
```

**After:**
```typescript
onClick={(e) => {
  e.preventDefault()
  e.stopPropagation()  // Critical fix!
  handleSelect(suggestion)
}}
```

#### Q: What's the difference between preventDefault() and stopPropagation()?

**A:**
- **preventDefault():** Prevents the browser's default action (e.g., form submission, link navigation)
- **stopPropagation():** Stops the event from bubbling up to parent elements

In our case, `stopPropagation()` was the critical fix - it prevented the click-outside handler from firing.

#### Q: Why use useRef instead of useState for DOM elements?

**A:** Refs don't cause re-renders. When you need to:
- Check if an element contains another element
- Scroll an element into view
- Focus/blur an element

You don't want to trigger a re-render - you just need to access the DOM. Refs are perfect for this.

**Example:**
```typescript
// useState would cause re-render (not what we want)
const [element, setElement] = useState<HTMLElement | null>(null)

// useRef doesn't cause re-render (what we want)
const elementRef = useRef<HTMLDivElement>(null)
```

#### Q: What does the cleanup function in useEffect do?

**A:** The cleanup function (returned from useEffect) runs when:
1. Component unmounts
2. Dependencies change (before the effect runs again)

**Example:**
```typescript
useEffect(() => {
  document.addEventListener('mousedown', handleClick)
  return () => {
    document.removeEventListener('mousedown', handleClick)  // Cleanup
  }
}, [dependencies])
```

**Why it's important:**
- Prevents memory leaks
- Prevents multiple event listeners from accumulating
- Ensures old listeners are removed before new ones are added

#### Q: Why use functional state updates (prev => prev + 1)?

**A:** Functional updates ensure you're using the latest state value, especially important when:
- State updates might be batched
- Multiple updates happen quickly
- You need the previous value to calculate the new value

**Example:**
```typescript
// Good: Uses previous value
setHighlightedIndex(prev => prev + 1)

// Bad: Might use stale value
setHighlightedIndex(highlightedIndex + 1)
```

### Key Takeaways

1. **Event Bubbling** - Events propagate from child to parent. Use `stopPropagation()` when you need to prevent parent handlers from firing.

2. **useRef for DOM Access** - Use refs when you need to access DOM elements without causing re-renders.

3. **useEffect Cleanup** - Always clean up event listeners in useEffect cleanup functions to prevent memory leaks.

4. **Multiple useState** - Separate state variables by concern makes code clearer and easier to debug.

5. **Hybrid Components** - Supporting both controlled and uncontrolled modes makes components more flexible and reusable.

6. **Keyboard Navigation** - Always prevent default behavior when handling keyboard events in custom components.

---

## Common Questions & Answers

### Q: How does @font-face work?

**A:** `@font-face` is a CSS rule that tells the browser to load a custom font file and make it available for use. Here's how it works:

1. **font-family** - The name you'll use in your CSS (e.g., `font-family: 'Proxima Nova'`)
2. **src** - The path to the font file and its format
3. **font-weight** - Which weight this specific file represents (300 = light, 400 = regular, 700 = bold)
4. **font-display: swap** - Shows fallback text immediately, then swaps in the custom font when ready

When you write `font-family: 'Proxima Nova'` with `font-weight: 300`, the browser looks for a `@font-face` with matching family and weight, then loads that file.

### Q: Why can't I type in the number/text fields?

**A:** This happened because the components were "controlled" but the parent wasn't managing state. 

**The Fix:** Added internal state using `useState` so components manage their own values:

```typescript
const [internalValue, setInternalValue] = useState<string>(value || '')

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const inputValue = e.target.value
  setInternalValue(inputValue)  // Update internal state
  onChange?.(inputValue)        // Also notify parent if provided
}
```

Now the component works independently, but can still be controlled by a parent if needed.

### Q: What is useState and how does it work?

**A:** `useState` is a React "hook" that lets components remember and update data.

**Breaking it down:**
- `const [variable, setVariable] = useState(initialValue)`
- `variable` - The current value
- `setVariable` - Function to update the value
- `initialValue` - Starting value

**Example:**
```typescript
const [count, setCount] = useState(0)

// Later, update it:
setCount(5)  // Now count = 5
```

When you call `setCount`, React re-renders the component with the new value.

### Q: What's the difference between controlled and uncontrolled components?

**A:** 

**Controlled:**
- Parent component manages the state
- Requires `value` and `onChange` props
- Parent has full control

**Uncontrolled:**
- Component manages its own state internally
- Works independently
- More flexible for simple cases

**What we built (Hybrid):**
- Component manages its own state (works standalone)
- Also supports parent control (works with parent state)
- Best of both worlds!

### Q: How do I position elements inside an input field?

**A:** Use absolute positioning:

1. Make parent `position: relative` (creates positioning context)
2. Position child `position: absolute`
3. Use `right`, `top`, etc. to place it
4. Add padding to input to make room

**Example:**
```css
.input-wrapper {
  position: relative;  /* Creates context */
}

.input-field {
  padding-right: 60px;  /* Make room for suffix */
}

.suffix {
  position: absolute;
  right: 18px;          /* Position from right */
  pointer-events: none;  /* Don't block clicks */
}
```

---

## Key Takeaways

1. **Components should be reusable** - Build them to work in multiple places
2. **State management is crucial** - Use `useState` when components need to remember data
3. **CSS organization matters** - Keep component styles separate from global styles
4. **Layout tools** - Flexbox for 1D layouts, Grid for 2D layouts
5. **Font loading** - Use `@font-face` to load custom fonts, need separate declarations for each weight
6. **Controlled vs Uncontrolled** - Understand when to use each approach, or build hybrid components
7. **Event handling** - Understand event bubbling and when to use `preventDefault()` and `stopPropagation()`
8. **useRef for DOM access** - Use refs when you need DOM access without re-renders
9. **useEffect cleanup** - Always clean up event listeners and side effects to prevent memory leaks
10. **Multiple state variables** - Separate state by concern for clearer, more maintainable code

---

## Next Steps for Learning

1. **Advanced React Hooks** - Learn more hooks like `useCallback`, `useMemo`, `useContext`
2. **Form Handling** - Learn about form libraries like React Hook Form
3. **TypeScript** - Deepen understanding of types and interfaces
4. **CSS Advanced** - Learn about CSS variables, animations, responsive design
5. **Component Patterns** - Learn about compound components, render props, etc.
6. **Performance Optimization** - React.memo, useMemo, useCallback for preventing unnecessary re-renders
7. **Accessibility** - ARIA attributes, focus management, keyboard navigation improvements
8. **Testing** - Unit testing React components, testing user interactions

---

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [CSS-Tricks Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS-Tricks Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [MDN @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)

