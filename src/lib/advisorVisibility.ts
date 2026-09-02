export const ADVISOR_VISIBILITY_EVENT = 'kavan:advisor-visibility'

export function publishAdvisorVisibility(visible: boolean) {
  document.documentElement.dataset.advisorVisible = String(visible)
  window.dispatchEvent(
    new CustomEvent<{ visible: boolean }>(ADVISOR_VISIBILITY_EVENT, {
      detail: { visible },
    }),
  )
}

export function isAdvisorVisible() {
  return document.documentElement.dataset.advisorVisible === 'true'
}
