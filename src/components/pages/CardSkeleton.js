import React from 'react'
import { Skeleton } from '@mui/material'

const CardSkeleton = ({ totalItems }) => {
  const skeletonArray = new Array(totalItems).fill(null);

  return (
    <>
      {skeletonArray.map((item, index) => (
        <div key={index} className='m-3'>
          <div className="row">
            <Skeleton variant="rectangular" width={290} height={400} animation='wave' />
          </div>
          <div className="row mt-2">
            <Skeleton variant="rectangular" width={170} height={15} animation='wave' />
          </div>
          <div className="row mt-2">
            <Skeleton variant="rectangular" width={120} height={25} animation='wave' />
          </div>
          <div className="row mt-2">
            <Skeleton variant="rectangular" width={40} height={35} animation='wave' />
            <Skeleton className='ms-2' variant="rectangular" width={40} height={35} animation='wave' />
          </div>
        </div>
      ))}
    </>
  )
}


export default CardSkeleton