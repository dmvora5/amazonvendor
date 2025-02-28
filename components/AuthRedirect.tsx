'use client'

import { PAGE_ROUTES } from '@/constant/routes'
// Next Imports
import { redirect, usePathname } from 'next/navigation'

// Config Imports


const AuthRedirect = () => {
  return redirect(PAGE_ROUTES.AUTH.LOGIN);
}

export default AuthRedirect
