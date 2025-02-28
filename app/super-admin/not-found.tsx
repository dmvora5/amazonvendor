'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports

// Third-party Imports

// Hook Imports

// Styled Components
// const MaskImg = styled('img')({
//   blockSize: 'auto',
//   maxBlockSize: 355,
//   inlineSize: '100%',
//   position: 'absolute',
//   insetBlockEnd: 0,
//   zIndex: -1
// })
import { Button } from "@/components/ui/button";
import { PAGE_ROUTES } from '@/constant/routes';

const NotFound = () => {
  // Vars

  // Hooks


  return (
    <div className='flex items-center justify-center min-bs-[100dvh] relative p-6 overflow-x-hidden'>
      <div className='flex items-center flex-col text-center space-y-4'>
        <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset] mbe-6'>
          <h1 className='font-medium text-8xl text-brand' color='text.primary'>
            404
          </h1>
          <h4 >Page Not Found ⚠️</h4>
          <h6>we couldn&#39;t find the page you are looking for.</h6>
        </div>
        <Link href={PAGE_ROUTES.SUPERADMIN.ALLUSERS}>
          <Button className='bg-brand'>
            Back To Home
          </Button>
        </Link>

        <img
          alt='error-404-illustration'
          src='/images/1.png'
          className='max-h-96'
        />
      </div>
      {/* {!hidden && (
        <MaskImg
          alt='mask'
          src={miscBackground}
          className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
        />
      )} */}
    </div>
  )
}

export default NotFound
