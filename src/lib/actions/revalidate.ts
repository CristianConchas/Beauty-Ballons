'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateSite() {
  revalidatePath('/', 'layout')
  revalidatePath('/portafolio')
  revalidatePath('/privacidad')
}

export async function revalidatePath_(path: string) {
  revalidatePath(path)
}
