import * as github from '@actions/github'

export function getPreviousLines(): string[] {
  if (!github.context.payload.pull_request) {
    throw new Error('This action only supports pull_request events')
  }
  const body = github.context.payload.changes?.body?.from || ''
  return body.split('\n')
}

export function getCurrentLines(): string[] {
  if (!github.context.payload.pull_request) {
    throw new Error('This action only supports pull_request events')
  }

  const body = github.context.payload.pull_request.body || ''
  return body.split('\n')
}

const CHECK_REGEXP = /^\s*- \[x\] /
const UNCHECK_REGEXP = /^\s*- \[ \] /

export function getPreviousChecked(previousLines: string[]): string[] {
  const items = previousLines
    .filter(line => CHECK_REGEXP.test(line))
    .map(line => line.replace(CHECK_REGEXP, ''))
    .map(line => line.replace(/\n/, ''))
  return items
}

export function getPreviousUnchecked(previousLines: string[]): string[] {
  const items = previousLines
    .filter(line => UNCHECK_REGEXP.test(line))
    .map(line => line.replace(UNCHECK_REGEXP, ''))
    .map(line => line.replace(/\n/, ''))
  return items
}

export function getCurrentChecked(currentLines: string[]): string[] {
  const items = currentLines
    .filter(line => CHECK_REGEXP.test(line))
    .map(line => line.replace(CHECK_REGEXP, ''))
    .map(line => line.replace(/\n/, ''))
  return items
}

export function getCurrentUnchecked(currentLines: string[]): string[] {
  const items = currentLines
    .filter(line => UNCHECK_REGEXP.test(line))
    .map(line => line.replace(UNCHECK_REGEXP, ''))
    .map(line => line.replace(/\n/, ''))
  return items
}

export function getDiff(
  previousLines: string[],
  currentLines: string[]
): {checked: string[]; unchecked: string[]} {
  const prevChecked = getPreviousChecked(previousLines)
  const prevUnchecked = getPreviousUnchecked(previousLines)
  const currChecked = getCurrentChecked(currentLines)
  const currUnchecked = getCurrentUnchecked(currentLines)

  const checked = currChecked.filter(line => prevUnchecked.includes(line))
  const unchecked = currUnchecked.filter(line => prevChecked.includes(line))

  return {checked, unchecked}
}
