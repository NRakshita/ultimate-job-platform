import { getAllTestsPassed } from './testChecklistStorage'
import { getAllStepsCompleted, getAllLinksProvided } from './proofStorage'

/**
 * Shipped status is true ONLY when:
 * - All 8 steps marked completed
 * - All 10 checklist items passed
 * - All 3 proof links provided and valid
 */
export function isShipped() {
  return (
    getAllStepsCompleted() &&
    getAllTestsPassed() &&
    getAllLinksProvided()
  )
}
