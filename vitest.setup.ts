import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest is not running with globals:true, so RTL's automatic cleanup is
// never registered. Without this, components leak between tests and queries
// match elements from a previous render.
afterEach(cleanup)
