import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const page = () => {
    return (
        <div className='w-full flex justify-center items-center min-h-[90%]'>
            <div className='flex flex-col space-y-6'>
                <Input type='file' />
                <Button className='bg-gradient-to-r from-blue-500 to-indigo-500 hover:bg-brand-100'>
                    Upload
                </Button>
            </div>
        </div>
    )
}

export default page