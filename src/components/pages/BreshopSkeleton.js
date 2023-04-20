import React from 'react'
import { Skeleton } from '@mui/material'

const BreshopSkeleton = ({ totalItems }) => {
  const skeletonArray = new Array(totalItems).fill(null);

  return (
    <>
      {skeletonArray.map((item, index) => (
        <div key={index} className=''>
          <div className="d-flex my-3" style={{ maxWidth: 450 }} >
            <Skeleton variant="circular" sx={{ minWidth: 125 }} width={125} height={125} animation='wave' />

            <div className="row mx-3">
              <div className="d-flex mb-2">
                <Skeleton variant="rectangular" width={110} height={24} animation='wave' />
                <div className="ms-2">
                  <Skeleton variant="rectangular" width={130} height={24} animation='wave' />
                </div>
              </div>
              <div className="d-flex flex-wrap align-content-between">
                <div className="w-100">
                  <Skeleton variant="rectangular" width={280} height={58} animation='wave' />
                </div>
                <div className="w-100">
                  <Skeleton className='mt-2' variant="rectangular" width={170} height={25} animation='wave' />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default BreshopSkeleton